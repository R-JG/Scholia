import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GroupDocumentInfo, Commentary, CommentaryInfo, SelectedSection } from '../typeUtils/types';
import { commentaryToolRoute } from '../config';
import DocumentCommentaryList from './DocumentCommentaryList';
import CommentaryCreationForm from './CommentaryCreationForm';
import '../css/DocumentSelector.css';

interface Props {
    isSelected: boolean, 
    documentsForGroup: GroupDocumentInfo[], 
    commentariesForDocument: CommentaryInfo[], 
    documentInfo: GroupDocumentInfo, 
    selectedDocument: GroupDocumentInfo | null, 
    selectedCommentary: Commentary | null,
    selectedSection: SelectedSection | null,
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void,
    setSelectedCommentary: (commentary: Commentary | null) => void,
    setSelectedSection: (section: SelectedSection | null) => void, 
    createCommentary: (documentId: number, commentaryName: string) => void, 
    getCommentaryForSelection: (commentaryId: number) => void
};

const DocumentSelector = ({ 
    isSelected, 
    documentsForGroup, 
    commentariesForDocument, 
    documentInfo, 
    selectedDocument, 
    selectedCommentary, 
    selectedSection, 
    setSelectedDocument, 
    setSelectedCommentary, 
    setSelectedSection, 
    createCommentary, 
    getCommentaryForSelection
    }: Props) => {

    const [createCommentaryMode, setCreateCommentaryMode] = useState<boolean>(false);

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
            {isSelected && 
            <DocumentCommentaryList 
                documentsForGroup={documentsForGroup}
                selectedDocument={selectedDocument}
                commentariesForDocument={commentariesForDocument}
                setSelectedDocument={setSelectedDocument}
                getCommentaryForSelection={getCommentaryForSelection}
                setSelectedSection={setSelectedSection}
            />}
            {isSelected && 
            <button 
                className='DocumentCommentaryList--create-commentary-button'
                onClick={() => setCreateCommentaryMode(!createCommentaryMode)}>
                {createCommentaryMode ? 'Cancel' : 'Create Commentary'}
            </button>}
            {isSelected && createCommentaryMode && 
            <CommentaryCreationForm 
                selectedDocument={selectedDocument}
                createCommentary={createCommentary}
            />}
        </div>
    );
};

export default DocumentSelector;