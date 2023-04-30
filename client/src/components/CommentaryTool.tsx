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
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [pageHeight, setPageHeight] = useState<number | null>(null);
    const [pagesToRender, setPagesToRender] = useState<number>(0);

    const documentContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        groupDocumentsService.getSingleDocumentFile(selectedDocument.id, user.token)
        .then(blob => setDocumentBlob(blob));
    }, []);

    useEffect(() => {
        (totalPages && (totalPages < 3)) 
            ? setPagesToRender(totalPages) 
            : setPagesToRender(3);
    }, [totalPages]);

    const handleScroll = (e: UIEvent<HTMLDivElement>): void => {
        if (!totalPages || !pageHeight || !documentContainerRef.current) return;
        if (totalPages === pagesToRender) return;
        if (e.currentTarget.scrollTop >= (documentContainerRef.current.scrollHeight - pageHeight)) {
            const pagesUnrendered: number = (totalPages - pagesToRender);
            if (pagesUnrendered < 3) setPagesToRender(pagesToRender + pagesUnrendered);
            if (pagesUnrendered >= 3) setPagesToRender(pagesToRender + 3);
        };
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
                    className='document--pdf' 
                    file={documentBlob}
                    onLoadSuccess={(pdf) => setTotalPages(pdf.numPages)}
                >
                    <Page 
                        className='document--pdf-page'
                        pageNumber={1} 
                        renderAnnotationLayer={false}
                        width={documentContainerRef.current?.clientWidth}
                        onLoadSuccess={(page) => setPageHeight(page.height)}
                    />
                    {Array.from({ length: (pagesToRender - 1) }).map((_el, index) => 
                        <Page 
                            key={`${selectedDocument.documentName} page ${index + 2}`}
                            className='document--pdf-page'
                            pageNumber={index + 2} 
                            renderAnnotationLayer={false}
                            width={documentContainerRef.current?.clientWidth}
                        />
                    )}
                </Document>}
            </div>
        </div>
    );
};

export default CommentaryTool;