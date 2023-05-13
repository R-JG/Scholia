import { useNavigate } from 'react-router-dom';
import { GroupDocumentInfo, CommentaryInfo } from '../typeUtils/types';
import { commentaryToolRoute } from '../routesConfig';

interface Props {
    commentaryInfo: CommentaryInfo,
    groupDocuments: GroupDocumentInfo[],
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void,
    getCommentaryForSelection: (commentaryId: number) => void
};

const CommentarySelector = ({
    commentaryInfo,
    groupDocuments,
    setSelectedDocument,
    getCommentaryForSelection
    }: Props) => {

    const navigate = useNavigate();

    const handleClick = (): void => {
        const commentaryDocument: GroupDocumentInfo | undefined = groupDocuments.find(
            documentInfo => (documentInfo.id === commentaryInfo.documentId)
        );
        if (!commentaryDocument) return;
        setSelectedDocument(commentaryDocument);
        getCommentaryForSelection(commentaryInfo.id);
        navigate(commentaryToolRoute);
    };

    return (
        <div 
            className='CommentarySelector'
            onClick={handleClick}>
            {commentaryInfo.commentaryName}
        </div>
    );
};

export default CommentarySelector;