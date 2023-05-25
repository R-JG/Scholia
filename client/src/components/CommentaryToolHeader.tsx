import { useNavigate } from 'react-router-dom';
import { GroupDocumentInfo, Commentary, SelectedSection } from '../typeUtils/types';
import { dashboardRoute } from '../config';
import '../css/CommentaryToolHeader.css';

interface Props {
    selectedDocument: GroupDocumentInfo | null,
    selectedCommentary: Commentary | null,
    setSelectedCommentary: (commentary: Commentary | null) => void, 
    setSelectedSection: (section: SelectedSection | null) => void
};

const CommentaryToolHeader = ({ 
    selectedDocument, 
    selectedCommentary, 
    setSelectedCommentary, 
    setSelectedSection
    }: Props) => {

    if (!selectedDocument) return <div className='CommentaryToolHeader inactive'></div>;

    const navigate = useNavigate();

    const handleReturnButton = () => {
        setSelectedSection(null);
        setSelectedCommentary(null);
        navigate(dashboardRoute);
    };
    
    return (
        <header className='CommentaryToolHeader'>
            <button 
                className='CommentaryToolHeader--return-button' 
                onClick={handleReturnButton}>
                Return To Dashboard
            </button>
            {selectedCommentary && 
            <h4 className='CommentaryToolHeader--commentary-title'>
                <span className='CommentaryToolHeader--commentary-tag'>
                    Commentary
                </span>
                <span className='CommentaryToolHeader--commentary-name'>
                    {selectedCommentary.commentaryName}
                </span>
            </h4>}
            <h4 className='CommentaryToolHeader--document-title'>
                <span className='CommentaryToolHeader--document-tag'>
                    Document
                </span>
                <span className='CommentaryToolHeader--document-name'>
                    {selectedDocument.documentName}
                </span>
            </h4>
        </header>
    );
};

export default CommentaryToolHeader;