import { useNavigate } from 'react-router-dom';
import { GroupDocumentInfo, Commentary } from '../typeUtils/types';
import { commentaryToolRoute } from '../routesConfig';
import '../css/DocumentSelector.css';

interface Props {
    documentInfo: GroupDocumentInfo,
    selectedCommentary: Commentary | null,
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void,
    setSelectedCommentary: (commentary: Commentary | null) => void
};

const DocumentSelector = ({ 
    documentInfo, 
    selectedCommentary, 
    setSelectedDocument, 
    setSelectedCommentary 
    }: Props) => {

    const navigate = useNavigate();

    const handleClick = () => {
        setSelectedDocument(documentInfo);
        if (selectedCommentary) setSelectedCommentary(null);
        navigate(commentaryToolRoute);
    };

    return (
        <div 
            className='DocumentSelector'
            onClick={handleClick}>
            <h4>{documentInfo.documentName}</h4>
        </div>
    );
};

export default DocumentSelector;