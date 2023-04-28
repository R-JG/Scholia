import { useEffect } from 'react';
import { LoggedInUser, GroupDocumentInfo } from '../typeUtils/types';
import groupDocumentsService from '../services/groupDocumentsService';
import '../css/CommentaryTool.css';

interface Props {
    user: LoggedInUser | null,
    selectedDocument: GroupDocumentInfo | null
};

const CommentaryTool = ({ user, selectedDocument }: Props) => {

    if (!user || !selectedDocument) return <div className='CommentaryTool'></div>;

    useEffect(() => {
        groupDocumentsService.getSingleDocumentFile(selectedDocument.id, user.token).then(blob => console.log(blob));
    }, []);

    return (
        <div className='CommentaryTool'></div>
    );
};

export default CommentaryTool;