import { useNavigate } from 'react-router-dom';
import { GroupDocumentInfo, Commentary, SelectedSection } from '../typeUtils/types';
import { commentaryToolRoute } from '../config';
import '../css/DocumentSelector.css';

interface Props {
    documentInfo: GroupDocumentInfo,
    selectedCommentary: Commentary | null,
    selectedSection: SelectedSection | null,
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void,
    setSelectedCommentary: (commentary: Commentary | null) => void,
    setSelectedSection: (section: SelectedSection | null) => void
};

const DocumentSelector = ({ 
    documentInfo, 
    selectedCommentary, 
    selectedSection, 
    setSelectedDocument, 
    setSelectedCommentary, 
    setSelectedSection
    }: Props) => {

    const navigate = useNavigate();

    const handleClick = () => {
        setSelectedDocument(documentInfo);
        if (selectedCommentary) setSelectedCommentary(null);
        if (selectedSection) setSelectedSection(null);
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