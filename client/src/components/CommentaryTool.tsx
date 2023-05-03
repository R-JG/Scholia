import { useEffect, useState, useRef, UIEvent, MouseEvent } from 'react';
import { Document, Page } from 'react-pdf';
import { LoggedInUser, GroupDocumentInfo } from '../typeUtils/types';
import groupDocumentsService from '../services/groupDocumentsService';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import '../css/CommentaryTool.css';

interface Props {
    user: LoggedInUser | null,
    selectedDocument: GroupDocumentInfo | null
};

const CommentaryTool = ({ user, selectedDocument }: Props) => {

    if (!user || !selectedDocument) return <div className='CommentaryTool'></div>;

    const [documentBlob, setDocumentBlob] = useState<Blob | null>(null);
    const [documentIsLoaded, setDocumentIsLoaded] = useState<boolean>(false);
    const [initialPageIsLoaded, setInitialPageIsLoaded] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [pageHeight, setPageHeight] = useState<number | null>(null);
    const [initialPageNum] = useState<number>(20);
    const [previousPagesToRender, setPreviousPagesToRender] = useState<number>(0);
    const [nextPagesToRender, setNextPagesToRender] = useState<number>(0);
    const [coordinateSelectMode, setCoordinateSelectMode] = useState<boolean>(false);
    const [userIsSelecting, setUserIsSelecting] = useState<boolean>(false);
    const [pageForSelection, setPageForSelection] = useState<number | null>(null);
    const [/*coordinateOne*/, setCoordinateOne] = useState<number | null>(null);
    const [/*coordinateTwo*/, setCoordinateTwo] = useState<number | null>(null);

    const [testOne, setTestOne] = useState(0);
    const [testTwo, setTestTwo] = useState(0);

    const documentContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        groupDocumentsService.getSingleDocumentFile(selectedDocument.id, user.token)
        .then(blob => setDocumentBlob(blob));
    }, []);

    useEffect(() => {
        if (!documentIsLoaded || !initialPageIsLoaded || !pageHeight) return;
        expandNextPages();
        expandPreviousPages();
        documentContainerRef.current?.scrollBy(0, 1);
    }, [initialPageIsLoaded]);

    const calculatePagesToAdd = (direction: 'before-initial' | 'after-initial'): number => {
        const unrenderedPages: number = (direction === 'before-initial') 
            ? (initialPageNum - previousPagesToRender - 1) 
            : (totalPages - initialPageNum + nextPagesToRender);
        const amountToAdd: number = (unrenderedPages < 3) ? unrenderedPages : 3;
        return amountToAdd;
    };

    const expandPreviousPages = (): void => {
        setPreviousPagesToRender(previousPagesToRender + calculatePagesToAdd('before-initial'));
    };

    const expandNextPages = (): void => {
        setNextPagesToRender(nextPagesToRender + calculatePagesToAdd('after-initial'));
    };

    const handleScroll = (e: UIEvent<HTMLDivElement>): void => {
        if (!documentIsLoaded || !pageHeight || !documentContainerRef.current) return;
        if ((previousPagesToRender + nextPagesToRender + 1) === totalPages) return;
        if (((initialPageNum + nextPagesToRender) !== totalPages) 
        && (e.currentTarget.scrollTop >= (documentContainerRef.current.scrollHeight - pageHeight))) {
            expandNextPages();
        };
        if (((initialPageNum - previousPagesToRender) !== 1) 
        && (e.currentTarget.scrollTop <= pageHeight)) {
            expandPreviousPages();
        };
    };
    
    const getMouseEventYCoordinate = (e: MouseEvent<HTMLDivElement>): number => {
        const targetPageHeight = e.currentTarget.clientHeight;
        const yCoordinatePixels: number = (e.clientY - e.currentTarget.getBoundingClientRect().y);
        const yCoordinatePercent: number = Math.floor((yCoordinatePixels / targetPageHeight) * 100);
        return yCoordinatePercent;
    };
    
    const getMouseEventPageNumber = (e: MouseEvent<HTMLDivElement>): number => {
        const pageNumberData: string | undefined = e.currentTarget.dataset.pageNumber;
        const pageNumber = Number(pageNumberData);
        return pageNumber;
    };

    const handlePageMouseDown = (e: MouseEvent<HTMLDivElement>): void => {
        if (!coordinateSelectMode) return;
        const targetPageNumber: number = getMouseEventPageNumber(e);
        const yCoordinatePercent: number = getMouseEventYCoordinate(e);
        setCoordinateOne(yCoordinatePercent);
        setUserIsSelecting(true);
        setPageForSelection(targetPageNumber);

        setTestOne(e.clientY);
    };

    const handlePageMouseUp = (e: MouseEvent<HTMLDivElement>): void => {
        if (!coordinateSelectMode || !userIsSelecting || !pageForSelection) return;
        const targetPageNumber: number = getMouseEventPageNumber(e);
        const yCoordinatePercent: number = getMouseEventYCoordinate(e);
        if (targetPageNumber === pageForSelection) setCoordinateTwo(yCoordinatePercent);
        if (targetPageNumber > pageForSelection) setCoordinateTwo(100);
        if (targetPageNumber < pageForSelection) setCoordinateTwo(0);
        setUserIsSelecting(false);

        setTestOne(0);
        setTestTwo(0);
    };

    const handlePageMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
        if (!coordinateSelectMode || !userIsSelecting) return;
        const targetPageNumber: number = getMouseEventPageNumber(e);
        if (targetPageNumber !== pageForSelection) return;
        setTestTwo(e.clientY);
    };

    /*
    const endCoordinateSelection = (): void => {
        setCoordinateOne(null);
        setCoordinateTwo(null);
        setPageForSelection(null);
        setUserIsSelecting(false);
        setCoordinateSelectMode(false);
    };
    */

    const createPageId = (pageNumber: number): string => `${pageNumber} ${selectedDocument.id}`;

    const createPages = (direction: 'before-initial' | 'after-initial'): JSX.Element[] => {
        const pagesToRender: number = (direction === 'before-initial') 
            ? previousPagesToRender : nextPagesToRender;
        const getPageNumber = (index: number): number => {
            return (direction === 'before-initial') 
                ? (initialPageNum - previousPagesToRender + index) 
                : (initialPageNum + index + 1);
        };
        return (
            Array.from({ length: pagesToRender }).map((_el, index) => {
                const pageNumber: number = getPageNumber(index);
                const pageId: string = createPageId(pageNumber);
                return (
                    <div 
                        key={pageId} 
                        id={pageId}
                        data-page-number={pageNumber}
                        className='document-page-container'
                        onMouseDown={handlePageMouseDown}
                        onMouseUp={handlePageMouseUp}
                        onMouseMove={handlePageMouseMove}>
                        {userIsSelecting && (pageForSelection === pageNumber) && testOne && testTwo 
                        && <div className='selection-box' style={{ 
                            top: `${Math.min(testOne, testTwo)}px`,
                            height: `${Math.abs(testOne - testTwo)}px`,
                        }}></div>}
                        <Page 
                            className='document-page'
                            pageNumber={pageNumber} 
                            renderAnnotationLayer={false}
                            renderTextLayer={!coordinateSelectMode}
                            width={documentContainerRef.current?.clientWidth}
                        />
                    </div>
                );
            })
        );
    };

    return (
        <div className='CommentaryTool'>
            <button onClick={() => setCoordinateSelectMode(!coordinateSelectMode)}>
                {`SELECT MODE ${(coordinateSelectMode) ? 'ON' : 'OFF'}`}
            </button>
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
                    <div 
                        key={createPageId(initialPageNum)} 
                        id={createPageId(initialPageNum)}
                        data-page-number={initialPageNum}
                        className='document-page-container'
                        onMouseDown={handlePageMouseDown}
                        onMouseUp={handlePageMouseUp}
                        onMouseMove={handlePageMouseMove}>

                        {userIsSelecting && (pageForSelection === initialPageNum) && testOne && testTwo
                        && <div className='selection-box' style={{ 
                            top: `${Math.min(testOne, testTwo)}px`,
                            height: `${Math.abs(testOne - testTwo)}px`,
                        }}></div>}

                        <Page 
                            className='document-page'
                            pageNumber={initialPageNum} 
                            renderAnnotationLayer={false}
                            renderTextLayer={!coordinateSelectMode}
                            width={documentContainerRef.current?.clientWidth}
                            onLoadSuccess={(page) => {
                                setPageHeight(page.height);
                                setInitialPageIsLoaded(true);
                            }}
                        />
                    </div>
                    {createPages('after-initial')}
                </Document>}
            </div>
        </div>
    );
};

export default CommentaryTool;