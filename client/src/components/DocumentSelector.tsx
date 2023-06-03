import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoggedInUser, GroupDocumentInfo, Commentary, CommentaryInfo, SelectedSection } from '../typeUtils/types';
import { commentaryToolRoute } from '../config';
import DocumentCommentaryList from './DocumentCommentaryList';
import CommentaryCreationForm from './CommentaryCreationForm';
import DocumentThumbnail from './DocumentThumbnail';
import '../css/DocumentSelector.css';

interface Props {
    user: LoggedInUser | null, 
    documentInfo: GroupDocumentInfo, 
    isSelected: boolean, 
    documentsForGroup: GroupDocumentInfo[], 
    userCommentariesForDocument: CommentaryInfo[], 
    groupCommentariesForDocument: CommentaryInfo[], 
    selectedDocument: GroupDocumentInfo | null, 
    selectedCommentary: Commentary | null,
    selectedSection: SelectedSection | null,
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void,
    setSelectedCommentary: (commentary: Commentary | null) => void,
    setSelectedSection: (section: SelectedSection | null) => void, 
    createCommentary: (documentId: number, commentaryName: string) => Promise<boolean>, 
    getCommentaryForSelection: (commentaryId: number) => void
};

const DocumentSelector = ({ 
    user, 
    documentInfo, 
    isSelected, 
    documentsForGroup, 
    userCommentariesForDocument, 
    groupCommentariesForDocument, 
    selectedDocument, 
    selectedCommentary, 
    selectedSection, 
    setSelectedDocument, 
    setSelectedCommentary, 
    setSelectedSection, 
    createCommentary, 
    getCommentaryForSelection
    }: Props) => {

    if (!user) return <div className='DocumentSelector inactive'></div>;

    const documentSelectorRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const handleComponentClick = (): void => {
        setSelectedDocument(documentInfo);
        documentSelectorRef.current?.scrollIntoView();
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
            ref={documentSelectorRef}
            onClick={handleComponentClick}>
            <DocumentThumbnail user={user} documentId={documentInfo.id} />

            {isSelected && 
            <div className='DocumentSelector--expanded-section'>
                <h3 className='DocumentSelector--document-name'>
                    {documentInfo.documentName}
                </h3>
                <div className='DocumentSelector--button-section'>
                    <button 
                        className='DocumentSelector--read-document-button'
                        onClick={handleReadDocumentButton}>
                        Read
                    </button>
                    <CommentaryCreationForm 
                        selectedDocument={selectedDocument}
                        createCommentary={createCommentary}
                    />
                    <hr className='DocumentSelector--divider' />
                </div>
                <DocumentCommentaryList 
                    user={user}
                    documentsForGroup={documentsForGroup}
                    selectedDocument={selectedDocument}
                    userCommentariesForDocument={userCommentariesForDocument}
                    groupCommentariesForDocument={groupCommentariesForDocument
                        .filter(commentaryInfo => (commentaryInfo.userId !== user.id))
                    }
                    setSelectedDocument={setSelectedDocument}
                    getCommentaryForSelection={getCommentaryForSelection}
                    setSelectedSection={setSelectedSection}
                />
            </div>}

        </div>
    );
};

export default DocumentSelector;