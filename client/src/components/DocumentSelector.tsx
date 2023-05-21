import { useNavigate } from 'react-router-dom';
import { GroupDocumentInfo, Commentary, SelectedSection } from '../typeUtils/types';
import { commentaryToolRoute } from '../config';
import '../css/DocumentSelector.css';

interface Props {
    isSelected: boolean, 
    documentInfo: GroupDocumentInfo,
    selectedCommentary: Commentary | null,
    selectedSection: SelectedSection | null,
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void,
    setSelectedCommentary: (commentary: Commentary | null) => void,
    setSelectedSection: (section: SelectedSection | null) => void
};

const DocumentSelector = ({ 
    isSelected, 
    documentInfo, 
    selectedCommentary, 
    selectedSection, 
    setSelectedDocument, 
    setSelectedCommentary, 
    setSelectedSection
    }: Props) => {

    const navigate = useNavigate();

    const handleComponentClick = (): void => {
        setSelectedDocument(documentInfo);
    };

    const handleViewDocumentButton = (): void => {
        setSelectedDocument(documentInfo);
        if (selectedCommentary) setSelectedCommentary(null);
        if (selectedSection) setSelectedSection(null);
        navigate(commentaryToolRoute);
    };

    return (
        <div 
            className={`DocumentSelector ${isSelected ? 'selected' : ''}`}
            onClick={handleComponentClick}>
            <h4 className='DocumentSelector--document-name'>
                {documentInfo.documentName}
            </h4>
            <button 
                className='DocumentSelector--view-document-button'
                onClick={handleViewDocumentButton}>
                View
            </button>
        </div>
    );
};

export default DocumentSelector;