import { useNavigate } from 'react-router-dom';
import { GroupDocumentInfo, Commentary } from '../typeUtils/types';
import { dashboardRoute } from '../config';
import '../css/CommentaryToolHeader.css';

interface Props {
    selectedDocument: GroupDocumentInfo | null,
    selectedCommentary: Commentary | null,
};

const CommentaryToolHeader = ({ 
    selectedDocument, 
    selectedCommentary 
    }: Props) => {

    if (!selectedDocument) return <div className='CommentaryToolHeader'></div>;

    const navigate = useNavigate();

    const handleNavigateButton = () => navigate(dashboardRoute);
    
    return (
        <header className='CommentaryToolHeader'>
            <button 
                className='commentary-tool-header--navigate-button' 
                onClick={handleNavigateButton}>
                Return To Dashboard
            </button>
            <h4>{`Document: ${selectedDocument.documentName}`}</h4>
            {selectedCommentary && 
            <h4>{`Commentary: ${selectedCommentary.commentaryName}`}</h4>}
        </header>
    );
};

export default CommentaryToolHeader;