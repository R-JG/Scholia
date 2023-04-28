import { useNavigate } from 'react-router-dom';
import { GroupDocumentInfo } from '../typeUtils/types';
import { commentaryToolRoute } from '../routesConfig';
import '../css/DocumentSelector.css';

interface Props {
    documentInfo: GroupDocumentInfo,
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void
};

const DocumentSelector = ({ documentInfo, setSelectedDocument }: Props) => {

    const navigate = useNavigate();

    const handleClick = () => {
        setSelectedDocument(documentInfo);
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