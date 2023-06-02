import { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { LoggedInUser } from '../typeUtils/types';
import groupDocumentsService from '../services/groupDocumentsService';

interface Props {
    user: LoggedInUser, 
    documentId: number
};

const DocumentThumbnail = ({ user, documentId }: Props) => {

    const [documentBlob, setDocumentBlob] = useState<Blob | null>(null);

    useEffect(() => {
        groupDocumentsService.downloadDocumentThumbnail(documentId, user.token)
        .then(thumbnailDocumentBlob => {
            if (thumbnailDocumentBlob) setDocumentBlob(thumbnailDocumentBlob);
        });
    }, []);

    if (!documentBlob) return <div className='DocumentThumbnail inactive'></div>;

    return (
        <div className='DocumentThumbnail'>
            <Document 
                className='DocumentThumbnail--document-component'
                file={documentBlob}>
                <Page 
                    className='DocumentThumbnail--document-page'
                    pageIndex={0} 
                    renderAnnotationLayer={false} 
                    renderInteractiveForms={false} 
                    renderTextLayer={false}
                />
            </Document>
        </div>
    );
};

export default DocumentThumbnail;