import { useNavigate } from 'react-router-dom';
import { GroupDocumentInfo, CommentaryInfo, SelectedSection } from '../typeUtils/types';
import { commentaryToolRoute } from '../config';
import '../css/CommentarySelector.css';

interface Props {
    commentaryInfo: CommentaryInfo,
    groupDocuments: GroupDocumentInfo[],
    selectedDocument: GroupDocumentInfo | null, 
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void,
    getCommentaryForSelection: (commentaryId: number) => void, 
    setSelectedSection: (section: SelectedSection | null) => void
};

const CommentarySelector = ({
    commentaryInfo, 
    groupDocuments, 
    selectedDocument, 
    setSelectedDocument,
    getCommentaryForSelection,
    setSelectedSection
    }: Props) => {

    const navigate = useNavigate();

    const findDocumentForCommentary = (): GroupDocumentInfo | undefined => groupDocuments.find(
        documentInfo => (documentInfo.id === commentaryInfo.documentId)
    );

    const handleClick = (): void => {
        if (!selectedDocument || (commentaryInfo.documentId !== selectedDocument.id)) {
            const commentaryDocument: GroupDocumentInfo | undefined = findDocumentForCommentary();
            if (!commentaryDocument) return console.error('document not found for commentary');
            setSelectedDocument(commentaryDocument);
        };
        getCommentaryForSelection(commentaryInfo.id);
        setSelectedSection(null);
        navigate(commentaryToolRoute);
    };

    return (
        <div 
            className='CommentarySelector'
            onClick={handleClick}>
            <div className='CommentarySelector--bullet-point'></div>
            <div className='CommentarySelector--info'>
                <h5 className='CommentarySelector--title'>{commentaryInfo.commentaryName}</h5>
                <h5 className='CommentarySelector--author'>By: {commentaryInfo.author}</h5>
            </div>
        </div>
    );
};

export default CommentarySelector;