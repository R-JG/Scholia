import { useEffect, useState, useRef, UIEvent, MouseEvent } from 'react';
import { Document, PDFPageProxy, Page } from 'react-pdf';
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
    const [coordinateSelectMode, /*setCoordinateSelectMode*/] = useState<boolean>(true);
    // const [oneCoordinateIsSelected, setOneCoordinateIsSelected] = useState<boolean>(false);
    // const [coordinateOne, setCoordinateOne] = useState<number | null>(null);
    // const [coordinateTwo, setCoordinateTwo] = useState<number | null>(null);

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

    const getYCoordinatePercentage = (yPixels: number, pageHeight: number): number => {
        return Math.floor((yPixels / pageHeight) * 100);
    };

    const handlePageClick = (e: MouseEvent<Element>, page: PDFPageProxy): void => {
        if (!coordinateSelectMode) return;
        const targetPageNum = page.pageNumber;
        const yCoordinatePixels: number = (e.clientY - e.currentTarget.getBoundingClientRect().y);
        const yCoordinatePercent: number = getYCoordinatePercentage(yCoordinatePixels, page.height);

        console.log('Page ', targetPageNum, ', ', yCoordinatePercent, '%');
    };

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
                        className='document-page-container'>
                        <Page 
                            className='document-page'
                            pageNumber={pageNumber} 
                            renderAnnotationLayer={false}
                            width={documentContainerRef.current?.clientWidth}
                            onClick={handlePageClick}
                        />
                    </div>
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
                    <div 
                        key={createPageId(initialPageNum)} 
                        id={createPageId(initialPageNum)}
                        className='document-page-container--initial-page'>
                        <Page 
                            className='document-page'
                            pageNumber={initialPageNum} 
                            renderAnnotationLayer={false}
                            width={documentContainerRef.current?.clientWidth}
                            onClick={handlePageClick}
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