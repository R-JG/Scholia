import { useEffect, useState, useRef } from 'react';
import { Document } from 'react-pdf';
import { LoggedInUser, GroupDocumentInfo, Commentary, CommentarySection, SelectedSection } from '../typeUtils/types';
import { pageAmountToRenderOnScroll, pageRenderCooldownMilliseconds } from '../config';
import groupDocumentsService from '../services/groupDocumentsService';
import CommentaryToolHeader from './CommentaryToolHeader';
import DocumentPage from './DocumentPage';
import CommentaryNavigator from './CommentaryNavigator';
import CommentaryOverlay from './CommentaryOverlay';
import CommentaryEditBar from './CommentaryEditBar';
import ProgressBar from './ProgressBar';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import '../css/CommentaryTool.css';

type PageDirection = 'before-initial' | 'after-initial';

interface Props {
    user: LoggedInUser | null,
    selectedDocument: GroupDocumentInfo | null,
    selectedCommentary: Commentary | null,
    selectedSection: SelectedSection | null,
    setSelectedCommentary: (commentary: Commentary | null) => void, 
    setSelectedSection: (section: SelectedSection | null) => void,
    addSectionToSelectedCommentary: (
        commentaryId: number, pageNumber: number, 
        pageCoordinateTop: number, pageCoordinateBottom: number
    ) => Promise<boolean>,
    deleteSelectedCommentarySection: () => void, 
    updateSelectedSectionText: (updatedText: string) => void,
    saveSectionTextToCommentary: (commentarySection: CommentarySection) => void
};

const CommentaryTool = ({ 
    user, 
    selectedDocument, 
    selectedCommentary, 
    selectedSection,
    setSelectedCommentary, 
    setSelectedSection,
    addSectionToSelectedCommentary, 
    deleteSelectedCommentarySection, 
    updateSelectedSectionText,
    saveSectionTextToCommentary
    }: Props) => {

    if (!user || !selectedDocument) return <div className='CommentaryTool inactive'></div>;

    const [downloadProgress, setDownloadProgress] = useState<number | undefined>(undefined);
    const [documentBlob, setDocumentBlob] = useState<Blob | null>(null);
    const [documentIsLoaded, setDocumentIsLoaded] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [initialPageHeight, setInitialPageHeight] = useState<number | null>(null);
    const [initialPageNumber, setInitialPageNumber] = useState<number>(1);
    const [previousPagesToRender, setPreviousPagesToRender] = useState<number>(0);
    const [nextPagesToRender, setNextPagesToRender] = useState<number>(0);
    const [pageRenderCooldown, setPageRenderCooldown] = useState<boolean>(false);
    const [editTextMode, setEditTextMode] = useState<boolean>(false);
    const [coordinateSelectMode, setCoordinateSelectMode] = useState<boolean>(false);
    const [userIsSelecting, setUserIsSelecting] = useState<boolean>(false);
    const [pageForSelection, setPageForSelection] = useState<number | null>(null);
    const [yPercentCoordinateOne, setYPercentCoordinateOne] = useState<number | null>(null);
    const [yPercentCoordinateTwo, setYPercentCoordinateTwo] = useState<number | null>(null);

    const documentContainerRef = useRef<HTMLDivElement>(null);

    const sectionTextHasBeenEdited = (((selectedCommentary && selectedSection) && 
        (selectedCommentary.commentarySections[selectedSection.index].text !== selectedSection.data.text)
    ) ?? false);

    useEffect(() => {
        const callbackDownloadProgress = (newProgressValue: number | undefined): void => {
            setDownloadProgress(newProgressValue);
        };
        groupDocumentsService.downloadDocument(selectedDocument.id, user.token, callbackDownloadProgress)
        .then(blob => {
            setDownloadProgress(undefined);
            setDocumentBlob(blob);
        });
        setDownloadProgress(0);
    }, []);

    useEffect(() => {
        if (!pageRenderCooldown) return;
        const handleCooldownEnd = () => setPageRenderCooldown(false);
        const cooldownTimer = setTimeout(handleCooldownEnd, pageRenderCooldownMilliseconds);
        return () => clearTimeout(cooldownTimer);
    }, [pageRenderCooldown]);

    const handleDocumentLoadSuccess = () => {
        if (selectedCommentary && !selectedSection) {
            if (selectedCommentary.commentarySections.length > 0) {
                const firstSection: CommentarySection = selectedCommentary.commentarySections[0];
                setInitialPageNumber(firstSection.pageNumber);
                setSelectedSection({ data: firstSection, index: 0 });
            };
        };
        if (selectedCommentary && selectedSection) {
            setInitialPageNumber(selectedSection.data.pageNumber);
        };
        setDocumentIsLoaded(true);
    };
    
    const handleInitialPageLoadSuccess = () => {
        expandNextPages();
        expandPreviousPages();
    };

    const jumpToNewPage = (pageNumber: number): void => {
        setPreviousPagesToRender(0);
        setNextPagesToRender(0);
        setInitialPageNumber(pageNumber);
    };

    const jumpToSelection = (pageNumber: number, pageCoordinateTop: number): void => {
        const selectionPageHasBeenRendered: boolean = 
            ((pageNumber > (initialPageNumber - previousPagesToRender)) 
            && (pageNumber < (initialPageNumber + nextPagesToRender)));
        if (selectionPageHasBeenRendered) {
            const pageElement = documentContainerRef.current?.querySelector(
                `.DocumentPage[data-page-number="${pageNumber}"]`
            );
            const selectionBoxElement = pageElement?.querySelector(
                `.selection-box--commentary-section[data-coordinate-top="${pageCoordinateTop}"]`
            );
            selectionBoxElement?.scrollIntoView({ block: 'start' });
        } else {
            jumpToNewPage(pageNumber);
        };
    };

    const documentIsScrolledNearBottom = (): boolean => {
        if (!documentContainerRef.current || !initialPageHeight) return false;
        const distanceFromBottomAmount: number = (initialPageHeight * 2);
        return (documentContainerRef.current.scrollTop 
        >= (documentContainerRef.current.scrollHeight - distanceFromBottomAmount));
    };

    const documentIsScrolledNearTop = (): boolean => {
        if (!documentContainerRef.current || !initialPageHeight) return false;
        const distanceFromTopAmount: number = (initialPageHeight * 2);
        return (documentContainerRef.current.scrollTop <= distanceFromTopAmount);
    };

    const allNextPagesAreRendered = (): boolean => {
        return ((initialPageNumber + nextPagesToRender) === totalPages);
    };

    const allPreviousPagesAreRendered = (): boolean => {
        return ((initialPageNumber - previousPagesToRender) === 1);
    };

    const calculatePagesToAdd = (direction: PageDirection): number => {
        const unrenderedPages: number = (direction === 'before-initial') 
            ? (initialPageNumber - previousPagesToRender - 1) 
            : (totalPages - initialPageNumber + nextPagesToRender);
        const amountToAdd: number = (unrenderedPages < pageAmountToRenderOnScroll) 
            ? unrenderedPages 
            : pageAmountToRenderOnScroll;
        return amountToAdd;
    };

    const expandPreviousPages = (): void => {
        setPreviousPagesToRender(previousPagesToRender + calculatePagesToAdd('before-initial'));
    };

    const expandNextPages = (): void => {
        setNextPagesToRender(nextPagesToRender + calculatePagesToAdd('after-initial'));
    };

    const handleDocumentScroll = (): void => {
        if (!documentIsLoaded || !initialPageHeight || !documentContainerRef.current) return;
        if (pageRenderCooldown) return;
        if (!allNextPagesAreRendered() && documentIsScrolledNearBottom()) {
            expandNextPages();
            setPageRenderCooldown(true);
        };
        if (!allPreviousPagesAreRendered() && documentIsScrolledNearTop()) {
            expandPreviousPages();
            setPageRenderCooldown(true);
        };
    };

    const resetSelectionCoordinates = (): void => {
        setYPercentCoordinateOne(null);
        setYPercentCoordinateTwo(null);
        setPageForSelection(null);
    };

    const cancelSectionTextEdit = (): void => {
        if (!selectedCommentary || !selectedSection) return;
        if (sectionTextHasBeenEdited) updateSelectedSectionText(
            selectedCommentary.commentarySections[selectedSection.index].text
        );
        setEditTextMode(false);
    };
    
    const createPageId = (pageNumber: number): string => `${pageNumber} ${selectedDocument.id}`;

    const createPages = (direction: PageDirection): JSX.Element[] => {
        const pagesToRender: number = (direction === 'before-initial') 
            ? previousPagesToRender : nextPagesToRender;
        const getPageNumber = (index: number): number => {
            return (direction === 'before-initial') 
                ? (initialPageNumber - previousPagesToRender + index) 
                : (initialPageNumber + index + 1);
        };
        return (
            Array.from({ length: pagesToRender })
            .map((_el, index) => {
                const pageNumber: number = getPageNumber(index);
                const pageId: string = createPageId(pageNumber);
                return (
                    <DocumentPage 
                        key={pageId}
                        pageId={pageId}
                        pageNumber={pageNumber}
                        pageWidth={documentContainerRef.current?.clientWidth}
                        isInitialPage={false}
                        selectedCommentary={selectedCommentary}
                        selectedSection={selectedSection}
                        coordinateSelectMode={coordinateSelectMode}
                        userIsSelecting={userIsSelecting}
                        pageForSelection={pageForSelection}
                        yPercentCoordinateOne={yPercentCoordinateOne}
                        yPercentCoordinateTwo={yPercentCoordinateTwo}
                        editTextMode={editTextMode}
                        setEditTextMode={setEditTextMode}
                        setInitialPageHeight={setInitialPageHeight}
                        setPageForSelection={setPageForSelection}
                        setUserIsSelecting={setUserIsSelecting}
                        setYPercentCoordinateOne={setYPercentCoordinateOne}
                        setYPercentCoordinateTwo={setYPercentCoordinateTwo}
                        setSelectedSection={setSelectedSection}
                    />
                );
            })
        );
    };

    return (
        <div className='CommentaryTool'>
            <CommentaryToolHeader 
                selectedDocument={selectedDocument}
                selectedCommentary={selectedCommentary}
                setSelectedCommentary={setSelectedCommentary}
                setSelectedSection={setSelectedSection}
            />
            {(downloadProgress !== undefined) && 
            <ProgressBar 
                className='CommentaryTool--progress-bar'
                message='Downloading' 
                progressPercent={downloadProgress * 100} 
            />}
            <div 
                className='CommentaryTool--document-container' 
                ref={documentContainerRef}
                onScroll={handleDocumentScroll}>
                {documentBlob && 
                <Document 
                    className='CommentaryTool--document-component' 
                    file={documentBlob}
                    loading='Preparing document'
                    onLoadSuccess={(pdf) => {
                        setTotalPages(pdf.numPages);
                        handleDocumentLoadSuccess();
                    }}>
                    {createPages('before-initial')}
                    <DocumentPage 
                        key={createPageId(initialPageNumber)}
                        pageId={createPageId(initialPageNumber)}
                        pageNumber={initialPageNumber}
                        pageWidth={documentContainerRef.current?.clientWidth}
                        isInitialPage={true}
                        selectedCommentary={selectedCommentary}
                        selectedSection={selectedSection}
                        coordinateSelectMode={coordinateSelectMode}
                        userIsSelecting={userIsSelecting}
                        pageForSelection={pageForSelection}
                        yPercentCoordinateOne={yPercentCoordinateOne}
                        yPercentCoordinateTwo={yPercentCoordinateTwo}
                        editTextMode={editTextMode}
                        handleInitialPageLoadSuccess={handleInitialPageLoadSuccess}
                        setEditTextMode={setEditTextMode}
                        setInitialPageHeight={setInitialPageHeight}
                        setPageForSelection={setPageForSelection}
                        setUserIsSelecting={setUserIsSelecting}
                        setYPercentCoordinateOne={setYPercentCoordinateOne}
                        setYPercentCoordinateTwo={setYPercentCoordinateTwo}
                        setSelectedSection={setSelectedSection}
                    />
                    {createPages('after-initial')}
                </Document>}
            </div>
            {selectedCommentary && documentIsLoaded && 
            <CommentaryNavigator 
                user={user}
                selectedCommentary={selectedCommentary}
                selectedSection={selectedSection}
                coordinateSelectMode={coordinateSelectMode}
                editTextMode={editTextMode}
                setEditTextMode={setEditTextMode}
                setSelectedSection={setSelectedSection}
                jumpToSelection={jumpToSelection}
            />}
            {selectedCommentary && selectedSection && documentIsLoaded && 
            <CommentaryOverlay 
                key={selectedSection.data.id}
                selectedCommentary={selectedCommentary}
                selectedSection={selectedSection}
                editTextMode={editTextMode}
                setSelectedSection={setSelectedSection}
                updateSelectedSectionText={updateSelectedSectionText}
                cancelSectionTextEdit={cancelSectionTextEdit}
            />}
            {selectedCommentary && documentIsLoaded && 
            (user.id === selectedCommentary.userId) && 
            <CommentaryEditBar 
                user={user}
                selectedCommentary={selectedCommentary}
                selectedSection={selectedSection}
                coordinateSelectMode={coordinateSelectMode}
                pageForSelection={pageForSelection}
                yPercentCoordinateOne={yPercentCoordinateOne}
                yPercentCoordinateTwo={yPercentCoordinateTwo}
                editTextMode={editTextMode}
                sectionTextHasBeenEdited={sectionTextHasBeenEdited}
                setSelectedSection={setSelectedSection}
                setCoordinateSelectMode={setCoordinateSelectMode}
                resetSelectionCoordinates={resetSelectionCoordinates}
                addSectionToSelectedCommentary={addSectionToSelectedCommentary}
                deleteSelectedCommentarySection={deleteSelectedCommentarySection}
                setEditTextMode={setEditTextMode}
                saveSectionTextToCommentary={saveSectionTextToCommentary}
                cancelSectionTextEdit={cancelSectionTextEdit}
            />}
        </div>
    );
};

export default CommentaryTool;