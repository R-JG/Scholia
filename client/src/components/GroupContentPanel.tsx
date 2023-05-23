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
    selectedGroup: Group | null, 
    documentsForGroup: GroupDocumentInfo[],
    selectedDocument: GroupDocumentInfo | null, 
    selectedCommentary: Commentary | null,
    selectedSection: SelectedSection | null,
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void,
    uploadDocument: (document: File, groupId: number) => void, 
    createCommentary: (documentId: number, commentaryName: string) => Promise<boolean>, 
    getCommentaryForSelection: (commentaryId: number) => void, 
    setSelectedCommentary: (commentary: Commentary | null) => void, 
    setSelectedSection: (section: SelectedSection | null) => void
};

const GroupContentPanel = ({ 
    user,
    userCommentaries, 
    selectedGroup, 
    documentsForGroup, 
    selectedDocument, 
    selectedCommentary,
    selectedSection, 
    setSelectedDocument,
    uploadDocument,
    createCommentary, 
    getCommentaryForSelection, 
    setSelectedCommentary, 
    setSelectedSection
    }: Props) => {
    
    if (!user || !selectedGroup) return <div className='GroupContentPanel'></div>;

    const [groupCommentariesForDocument, setGroupCommentariesForDocument] = useState<CommentaryInfo[]>([]);

    useEffect(() => {
        if (!selectedDocument) return;
        commentariesService.getAllCommentaryInfoByDocument(user.token, selectedDocument.id)
        .then(commentaries => setGroupCommentariesForDocument(commentaries));
    }, [selectedDocument]);

    return (
        <div className='GroupContentPanel'>
            <div className='GroupContentPanel--group-documents-section'>
                <DocumentUploadForm 
                    selectedGroup={selectedGroup}
                    uploadDocument={uploadDocument}
                />
                <div className='GroupContentPanel--group-documents-list'>
                    {documentsForGroup.map(documentInfo => 
                    <DocumentSelector 
                        key={documentInfo.id}
                        user={user}
                        documentInfo={documentInfo}
                        isSelected={documentInfo.id == selectedDocument?.id}
                        documentsForGroup={documentsForGroup}
                        userCommentariesForDocument={userCommentaries.filter(commentary => 
                            (commentary.documentId === documentInfo.id))
                        }
                        groupCommentariesForDocument={groupCommentariesForDocument}
                        selectedDocument={selectedDocument}
                        selectedCommentary={selectedCommentary}
                        selectedSection={selectedSection}
                        setSelectedDocument={setSelectedDocument}
                        setSelectedCommentary={setSelectedCommentary}
                        setSelectedSection={setSelectedSection}
                        createCommentary={createCommentary}
                        getCommentaryForSelection={getCommentaryForSelection}
                    />)}
                </div>
            </div>
        </div>
    );
};

export default GroupContentPanel;