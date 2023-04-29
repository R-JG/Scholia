import { useEffect, useState } from 'react';
import { Document } from 'react-pdf';
import { LoggedInUser, GroupDocumentInfo } from '../typeUtils/types';
import groupDocumentsService from '../services/groupDocumentsService';
import '../css/CommentaryTool.css';

interface Props {
    user: LoggedInUser | null,
    selectedDocument: GroupDocumentInfo | null
};

const CommentaryTool = ({ user, selectedDocument }: Props) => {

    if (!user || !selectedDocument) return <div className='CommentaryTool'></div>;

    const [documentFile, setDocumentFile] = useState<Blob | null>(null);

    useEffect(() => {
        groupDocumentsService.getSingleDocumentFile(selectedDocument.id, user.token)
        .then(blob => setDocumentFile(blob));
    }, []);

    console.log(documentFile);

    return (
        <div className='CommentaryTool'>
            {documentFile && 
            <Document file={documentFile} />}
        </div>
    );
};

export default CommentaryTool;