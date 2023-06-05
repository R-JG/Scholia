import { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { LoggedInUser } from '../typeUtils/types';
import groupDocumentsService from '../services/groupDocumentsService';
import '../css/DocumentThumbnail.css';

interface Props {
    user: LoggedInUser, 
    documentId: number
};

const DocumentThumbnail = ({ user, documentId }: Props) => {

    const [documentBlob, setDocumentBlob] = useState<Blob | null>(null);

    const thumbnailWidth = (0.15 * window.innerWidth);

    useEffect(() => {
        groupDocumentsService.downloadDocumentThumbnail(documentId, user.token)
        .then(thumbnailDocumentBlob => {
            if (thumbnailDocumentBlob) setDocumentBlob(thumbnailDocumentBlob);
        });
    }, []);

    return (
        <div className='DocumentThumbnail' style={{ maxWidth: `${thumbnailWidth}px` }}>
            {documentBlob 
            ? <Document 
                className='DocumentThumbnail--document-component'
                file={documentBlob}
                loading=''>
                <Page 
                    className='DocumentThumbnail--document-page'
                    pageIndex={0} 
                    height={thumbnailWidth * 1.5}
                    renderAnnotationLayer={false} 
                    renderInteractiveForms={false} 
                    renderTextLayer={false}
                />
            </Document> 
            : <div className='DocumentThumbnail--placeholder'></div>}
        </div>
    );
};

export default DocumentThumbnail;