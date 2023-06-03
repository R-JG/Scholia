import { useState, useEffect } from 'react';
import { 
    LoggedInUser, Group, GroupDocumentInfo, Commentary, SelectedSection, CommentaryInfo 
} from '../typeUtils/types';
import commentariesService from '../services/commentariesService';
import DocumentUploadForm from './DocumentUploadForm';
import DocumentSelector from './DocumentSelector';
import '../css/GroupContentPanel.css';

interface Props {
    user: LoggedInUser | null,
    userCommentaries: CommentaryInfo[], 
    groupDocuments: GroupDocumentInfo[], 
    selectedGroup: Group | null, 
    documentsForGroup: GroupDocumentInfo[],
    selectedDocument: GroupDocumentInfo | null, 
    selectedCommentary: Commentary | null,
    selectedSection: SelectedSection | null,
    setGroupDocuments: (groupDocuments: GroupDocumentInfo[]) => void, 
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void,
    createCommentary: (documentId: number, commentaryName: string) => Promise<boolean>, 
    getCommentaryForSelection: (commentaryId: number) => void, 
    setSelectedCommentary: (commentary: Commentary | null) => void, 
    setSelectedSection: (section: SelectedSection | null) => void
};

const GroupContentPanel = ({ 
    user,
    userCommentaries, 
    groupDocuments, 
    selectedGroup, 
    documentsForGroup, 
    selectedDocument, 
    selectedCommentary,
    selectedSection, 
    setGroupDocuments, 
    setSelectedDocument,
    createCommentary, 
    getCommentaryForSelection, 
    setSelectedCommentary, 
    setSelectedSection
    }: Props) => {
    
    if (!user || !selectedGroup) return <div className='GroupContentPanel inactive'></div>;

    const [allDocumentCommentaries, setAllDocumentCommentaries] = useState<CommentaryInfo[]>([]);
    
    const documentListColumnAmount = 3;
    const selectedDocumentIndex = ((selectedDocument && (selectedDocument.groupId === selectedGroup.id)) 
        ? documentsForGroup.findIndex(document => (document.id === selectedDocument.id)) : null
    );
    
    useEffect(() => {
        if (documentsForGroup.length === 0) return;
        const documentIds: number[] = documentsForGroup.map(document => document.id);
        commentariesService.getAllCommentaryInfoForDocuments(user.token, documentIds)
        .then(commentaries => setAllDocumentCommentaries(commentaries));
    }, []);

    const filterCommentariesByDocument = (commentaries: CommentaryInfo[], documentId: number) => (
        commentaries.filter(commentary => (commentary.documentId === documentId))
    );

    const documentListOffsetElements = (selectedDocumentIndex ? Array.from({ 
            length: (documentListColumnAmount - ((selectedDocumentIndex % documentListColumnAmount))) 
        }).map(() => <div className='GroupContentPanel--document-list-offset'></div>) : []
    );

    return (
        <div className='GroupContentPanel'>
            <div className='GroupContentPanel--group-documents-section'>
                <DocumentUploadForm 
                    user={user}
                    groupDocuments={groupDocuments}
                    selectedGroup={selectedGroup}
                    setGroupDocuments={setGroupDocuments}
                    setSelectedDocument={setSelectedDocument}
                />
                <div className='GroupContentPanel--group-documents-list'>
                    {documentListOffsetElements.concat(
                    documentsForGroup.map(documentInfo => 
                    <DocumentSelector 
                        key={documentInfo.id}
                        user={user}
                        documentInfo={documentInfo}
                        isSelected={documentInfo.id == selectedDocument?.id}
                        documentsForGroup={documentsForGroup}
                        userCommentariesForDocument={
                            filterCommentariesByDocument(userCommentaries, documentInfo.id)
                        }
                        groupCommentariesForDocument={
                            filterCommentariesByDocument(allDocumentCommentaries, documentInfo.id)
                        }
                        selectedDocument={selectedDocument}
                        selectedCommentary={selectedCommentary}
                        selectedSection={selectedSection}
                        setSelectedDocument={setSelectedDocument}
                        setSelectedCommentary={setSelectedCommentary}
                        setSelectedSection={setSelectedSection}
                        createCommentary={createCommentary}
                        getCommentaryForSelection={getCommentaryForSelection}
                    />))}
                </div>
                {(documentsForGroup.length === 0) && 
                <h4 className='GroupContentPanel--no-documents-message'>
                    This group currently has no documents
                </h4>}
            </div>
        </div>
    );
};

export default GroupContentPanel;