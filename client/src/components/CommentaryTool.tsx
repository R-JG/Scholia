import { useEffect, useState, useRef, UIEvent } from 'react';
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
    const [pageIsLoaded, setPageIsLoaded] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [pageHeight, setPageHeight] = useState<number | null>(null);
    const [initialPageNum] = useState<number>(20);
    const [previousPagesToRender, setPreviousPagesToRender] = useState<number>(0);
    const [nextPagesToRender, setNextPagesToRender] = useState<number>(0);

    const documentContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        groupDocumentsService.getSingleDocumentFile(selectedDocument.id, user.token)
        .then(blob => setDocumentBlob(blob));
    }, []);

    useEffect(() => {
        if (!documentIsLoaded || !pageIsLoaded) return;
        expandNextPages();
        expandPreviousPages();
    }, [pageIsLoaded]);

    const calculatePagesToAdd = (direction: 'before-initial' | 'after-initial'): number => {
        const unrenderedPages: number = (direction === 'before-initial') 
            ? (initialPageNum - previousPagesToRender) 
            : (totalPages - (initialPageNum + nextPagesToRender));
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

        // prevent loading too many pages at once when agressively scrolling
    };

    const createPages = (direction: 'before-initial' | 'after-initial'): JSX.Element[] => {
        const pagesToRender: number = (direction === 'before-initial') 
            ? previousPagesToRender : nextPagesToRender;
        const getPageNum = (index: number): number => {
            return (direction === 'before-initial') 
                ? ((initialPageNum - previousPagesToRender) + (index + 1)) 
                : (initialPageNum + (index + 1));
        };
        return (
            Array.from({ length: pagesToRender }).map((_el, index) => {
                const pageNum = getPageNum(index);
                return (
                    <Page 
                        key={`${selectedDocument.documentName} page ${pageNum}`}
                        className='document--pdf-page'
                        pageNumber={pageNum} 
                        renderAnnotationLayer={false}
                        width={documentContainerRef.current?.clientWidth}
                    />
                );
            })
        );
    };

    console.log('TOTAL PAGES:   ', totalPages);
    console.log('PREVIOUS:   ', previousPagesToRender);
    console.log('NEXT:   ', nextPagesToRender);

    return (
        <div className='CommentaryTool'>
            <div 
                className='document-container' 
                ref={documentContainerRef}
                onScroll={handleScroll}
            >
                {documentBlob && 
                <Document 
                    className='document--pdf' 
                    file={documentBlob}
                    onLoadSuccess={(pdf) => {
                        setTotalPages(pdf.numPages);
                        setDocumentIsLoaded(true);
                    }}
                >
                    {createPages('before-initial')}
                    <Page 
                        key={`${selectedDocument.documentName} page ${initialPageNum}`}
                        className='document--pdf-page'
                        pageNumber={initialPageNum} 
                        renderAnnotationLayer={false}
                        width={documentContainerRef.current?.clientWidth}
                        onLoadSuccess={(page) => {
                            setPageHeight(page.height);
                            setPageIsLoaded(true);
                        }}
                    />
                    {createPages('after-initial')}
                </Document>}
            </div>
        </div>
    );
};

export default CommentaryTool;