import { useNavigate } from 'react-router-dom';
import { GroupDocumentInfo, CommentaryInfo, SelectedSection } from '../typeUtils/types';
import { commentaryToolRoute } from '../config';

interface Props {
    commentaryInfo: CommentaryInfo,
    groupDocuments: GroupDocumentInfo[],
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void,
    getCommentaryForSelection: (commentaryId: number) => void, 
    setSelectedSection: (section: SelectedSection | null) => void
};

const CommentarySelector = ({
    commentaryInfo,
    groupDocuments,
    setSelectedDocument,
    getCommentaryForSelection,
    setSelectedSection
    }: Props) => {

    const navigate = useNavigate();

    const handleClick = (): void => {
        const commentaryDocument: GroupDocumentInfo | undefined = groupDocuments.find(
            documentInfo => (documentInfo.id === commentaryInfo.documentId)
        );
        if (!commentaryDocument) return;
        setSelectedDocument(commentaryDocument);
        getCommentaryForSelection(commentaryInfo.id);
        setSelectedSection(null);
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