import { useEffect, useState, useRef, UIEvent } from 'react';
import { Document } from 'react-pdf';
import { 
    LoggedInUser, GroupDocumentInfo, Commentary, CommentarySection, SelectedSection 
} from '../typeUtils/types';
import groupDocumentsService from '../services/groupDocumentsService';
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
    setSelectedSection: (section: SelectedSection) => void,
    createCommentary: (documentId: number, commentaryName: string) => void,
    addSectionToSelectedCommentary: (
        commentaryId: number, 
        pageNumber: number, 
        pageCoordinateTop: number, 
        pageCoordinateBottom: number
    ) => void,
};

const CommentaryTool = ({ 
    user, 
    selectedDocument, 
    selectedCommentary, 
    createCommentary,
    addSectionToSelectedCommentary,
    }: Props) => {

    if (!user || !selectedDocument) return <div className='CommentaryTool'></div>;

    const [documentBlob, setDocumentBlob] = useState<Blob | null>(null);
    const [documentIsLoaded, setDocumentIsLoaded] = useState<boolean>(false);
    const [initialPageIsLoaded, setInitialPageIsLoaded] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [initialPageHeight, setInitialPageHeight] = useState<number | null>(null);
    const [initialPageNumber, setInitialPageNumber] = useState<number>(20);
    const [previousPagesToRender, setPreviousPagesToRender] = useState<number>(0);
    const [nextPagesToRender, setNextPagesToRender] = useState<number>(0);
    const [editTextMode, setEditTextMode] = useState<boolean>(false);
    const [coordinateSelectMode, setCoordinateSelectMode] = useState<boolean>(false);
    const [userIsSelecting, setUserIsSelecting] = useState<boolean>(false);
    const [pageForSelection, setPageForSelection] = useState<number | null>(null);
    const [yPercentCoordinateOne, setYPercentCoordinateOne] = useState<number | null>(null);
    const [yPercentCoordinateTwo, setYPercentCoordinateTwo] = useState<number | null>(null);

    const documentContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        groupDocumentsService.getSingleDocumentFile(selectedDocument.id, user.token)
        .then(blob => setDocumentBlob(blob));
    }, []);

    useEffect(() => {
        if (!documentIsLoaded || !initialPageIsLoaded || !initialPageHeight) return;
        expandNextPages();
        expandPreviousPages();
    }, [initialPageIsLoaded]);

    const calculatePagesToAdd = (direction: 'before-initial' | 'after-initial'): number => {
        const unrenderedPages: number = (direction === 'before-initial') 
            ? (initialPageNumber - previousPagesToRender - 1) 
            : (totalPages - initialPageNumber + nextPagesToRender);
        const amountToAdd: number = (unrenderedPages < 3) ? unrenderedPages : 3;
        return amountToAdd;
    };

    const expandPreviousPages = (): void => {
        setPreviousPagesToRender(previousPagesToRender + calculatePagesToAdd('before-initial'));
    };

    const expandNextPages = (): void => {
        setNextPagesToRender(nextPagesToRender + calculatePagesToAdd('after-initial'));
    };

    const jumpToNewPage = (pageNumber: number) => {
        setPreviousPagesToRender(0);
        setNextPagesToRender(0);
        setInitialPageNumber(pageNumber);
    };

    const jumpToSelection = (coordinates: PageSelectionCoordinates): void => {
        if ((coordinates.pageNumber > (initialPageNumber - previousPagesToRender)) 
        && (coordinates.pageNumber < (initialPageNumber + nextPagesToRender))) {
            const pageElement = documentContainerRef.current?.querySelector(
                `.DocumentPage[data-page-number="${coordinates.pageNumber}"]`
            );
            const selectionBoxElement = pageElement?.querySelector(
                `.selection-box--commentary-section[data-coordinate-top="${coordinates.top}"]`
            );
            selectionBoxElement?.scrollIntoView({ block: 'start' });
        } else {
            jumpToNewPage(coordinates.pageNumber);
        };
    };

    const handleScroll = (e: UIEvent<HTMLDivElement>): void => {
        if (!documentIsLoaded || !initialPageHeight || !documentContainerRef.current) return;
        if ((previousPagesToRender + nextPagesToRender + 1) === totalPages) return;
        if (((initialPageNumber + nextPagesToRender) !== totalPages) 
        && (e.currentTarget.scrollTop >= (documentContainerRef.current.scrollHeight - initialPageHeight))) {
            expandNextPages();
        };
        if (((initialPageNumber - previousPagesToRender) !== 1) 
        && (e.currentTarget.scrollTop <= initialPageHeight)) {
            expandPreviousPages();
        };
    };

    const resetPercentCoordinates = (): void => {
        setYPercentCoordinateOne(null);
        setYPercentCoordinateTwo(null);
    };

    const updateSelectedSectionText = (updatedText: string): void => {
        if (!selectedSection) return;
        setSelectedSection({ 
            ...selectedSection, 
            data: { ...selectedSection.data, text: updatedText } 
        });
    }

    console.log('M0de--> ', editTextMode);
    console.log('T3XT--> ', selectedSection?.data.text);
    
    const createPageId = (pageNumber: number): string => `${pageNumber} ${selectedDocument.id}`;

    const createPages = (direction: 'before-initial' | 'after-initial'): JSX.Element[] => {
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
            <div 
                className='document-container' 
                ref={documentContainerRef}
                onScroll={handleScroll}
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
            {selectedCommentary ?
            <CommentaryNavigator 
                selectedCommentary={selectedCommentary}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
                jumpToSelection={jumpToSelection}
            />
            : <button onClick={() => createCommentary(selectedDocument.id, 'TEST')}>TEST Create Commentary TEST</button>}
            {selectedCommentary && selectedSection &&
            <CommentaryOverlay 
                selectedCommentary={selectedCommentary}
                selectedSection={selectedSection}
                editTextMode={editTextMode}
                updateSelectedSectionText={updateSelectedSectionText}
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
                setCoordinateSelectMode={setCoordinateSelectMode}
                resetPercentCoordinates={resetPercentCoordinates}
                addSectionToSelectedCommentary={addSectionToSelectedCommentary}
                setEditTextMode={setEditTextMode}
                updateSelectedSectionText={updateSelectedSectionText}
            />}
        </div>
    );
};

export default CommentaryTool;