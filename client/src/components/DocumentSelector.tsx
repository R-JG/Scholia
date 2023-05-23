import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoggedInUser, GroupDocumentInfo, Commentary, CommentaryInfo, SelectedSection } from '../typeUtils/types';
import { commentaryToolRoute } from '../config';
import DocumentCommentaryList from './DocumentCommentaryList';
import CommentaryCreationForm from './CommentaryCreationForm';
import '../css/DocumentSelector.css';

interface Props {
    user: LoggedInUser | null, 
    isSelected: boolean, 
    documentsForGroup: GroupDocumentInfo[], 
    userCommentariesForDocument: CommentaryInfo[], 
    groupCommentariesForDocument: CommentaryInfo[], 
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
    user, 
    isSelected, 
    documentsForGroup, 
    userCommentariesForDocument, 
    groupCommentariesForDocument, 
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

    const handleReadDocumentButton = (): void => {
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
                className='DocumentSelector--read-document-button'
                onClick={handleReadDocumentButton}>
                Read
            </button>
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
            {isSelected && 
            <DocumentCommentaryList 
                user={user}
                documentsForGroup={documentsForGroup}
                selectedDocument={selectedDocument}
                userCommentariesForDocument={userCommentariesForDocument}
                groupCommentariesForDocument={groupCommentariesForDocument}
                setSelectedDocument={setSelectedDocument}
                getCommentaryForSelection={getCommentaryForSelection}
                setSelectedSection={setSelectedSection}
            />}
        </div>
    );
};

export default DocumentSelector;