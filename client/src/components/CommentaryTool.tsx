import { useEffect, useState, useRef } from 'react';
import { Document } from 'react-pdf';
import { 
    LoggedInUser, PageDirection, GroupDocumentInfo, Commentary, CommentarySection, SelectedSection 
} from '../typeUtils/types';
import { pageAmountToRenderOnScroll, pageRenderCooldownMilliseconds } from '../config';
import groupDocumentsService from '../services/groupDocumentsService';
import CommentaryToolHeader from './CommentaryToolHeader';
import DocumentPage from './DocumentPage';
import CommentaryNavigator from './CommentaryNavigator';
import CommentaryOverlay from './CommentaryOverlay';
import CommentaryEditBar from './CommentaryEditBar';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import '../css/CommentaryTool.css';

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
    ) => void,
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

    if (!user || !selectedDocument) return <div className='CommentaryTool'></div>;

    const [documentBlob, setDocumentBlob] = useState<Blob | null>(null);
    const [documentIsLoaded, setDocumentIsLoaded] = useState<boolean>(false);
    const [initialPageIsLoaded, setInitialPageIsLoaded] = useState<boolean>(false);
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
    const [sectionTextHasBeenEdited, setSectionTextHasBeenEdited] = useState<boolean>(false);

    const documentContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        groupDocumentsService.getSingleDocumentFile(selectedDocument.id, user.token)
        .then(blob => setDocumentBlob(blob));
    }, []);

    useEffect(() => {
        if (!documentIsLoaded) return;
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
    }, [documentIsLoaded]);

    useEffect(() => {
        if (!documentIsLoaded || !initialPageIsLoaded || !initialPageHeight) return;
        expandNextPages();
        expandPreviousPages();
    }, [initialPageIsLoaded]);

    useEffect(() => {
        if (!pageRenderCooldown) return;
        const handleCooldownEnd = () => setPageRenderCooldown(false);
        const cooldownTimer = setTimeout(handleCooldownEnd, pageRenderCooldownMilliseconds);
        return () => clearTimeout(cooldownTimer);
    }, [pageRenderCooldown]);

    useEffect(() => {
        if (!selectedCommentary || !selectedSection) return;
        const sectionInCommentary: CommentarySection | undefined = selectedCommentary.commentarySections
        .find(section => section.id === selectedSection.data.id);
        if (!sectionInCommentary) return;
        if (sectionInCommentary.text !== selectedSection.data.text) {
            setSectionTextHasBeenEdited(true)
        } else setSectionTextHasBeenEdited(false);
    }, [selectedCommentary, selectedSection]);

    const jumpToNewPage = (pageNumber: number) => {
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
        ? unrenderedPages : pageAmountToRenderOnScroll;
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
            Array.from({ length: pagesToRender }).map((_el, index) => {
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
                        setInitialPageIsLoaded={setInitialPageIsLoaded}
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
            <div 
                className='document-container' 
                ref={documentContainerRef}
                onScroll={handleDocumentScroll}
                style={(pageRenderCooldown) ? { overflow: 'hidden' } : undefined}
            >
                {documentBlob && 
                <Document 
                    className='document-component' 
                    file={documentBlob}
                    onLoadSuccess={(pdf) => {
                        setTotalPages(pdf.numPages);
                        setDocumentIsLoaded(true);
                    }}
                >
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
                        setInitialPageIsLoaded={setInitialPageIsLoaded}
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
            {selectedCommentary && 
            <CommentaryNavigator 
                user={user}
                selectedCommentary={selectedCommentary}
                selectedSection={selectedSection}
                coordinateSelectMode={coordinateSelectMode}
                setSelectedSection={setSelectedSection}
                jumpToSelection={jumpToSelection}
            />}
            {selectedCommentary && selectedSection &&
            <CommentaryOverlay 
                selectedCommentary={selectedCommentary}
                selectedSection={selectedSection}
                editTextMode={editTextMode}
                setSelectedSection={setSelectedSection}
                updateSelectedSectionText={updateSelectedSectionText}
                cancelSectionTextEdit={cancelSectionTextEdit}
            />}
            {selectedCommentary && (user.id === selectedCommentary.userId) && 
            <CommentaryEditBar 
                user={user}
                selectedCommentary={selectedCommentary}
                selectedSection={selectedSection}
                coordinateSelectMode={coordinateSelectMode}
                pageForSelection={pageForSelection}
                yPercentCoordinateOne={yPercentCoordinateOne}
                yPercentCoordinateTwo={yPercentCoordinateTwo}
                editTextMode={editTextMode}
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