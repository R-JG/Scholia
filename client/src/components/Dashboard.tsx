import { 
    LoggedInUser, Group, GroupDocumentInfo, Commentary, CommentaryInfo, SelectedSection 
} from '../typeUtils/types';
import Header from './Header';
import GroupContentPanel from './GroupContentPanel';
import NetworkPanel from './NetworkPanel';
import '../css/Dashboard.css';

interface Props {
    user: LoggedInUser | null,
    userGroups: Group[],
    userCommentaries: CommentaryInfo[], 
    selectedDocument: GroupDocumentInfo | null, 
    selectedCommentary: Commentary | null, 
    selectedSection: SelectedSection | null,
    selectedGroup: Group | null,
    groupDocuments: GroupDocumentInfo[],
    updateUser: (userData: LoggedInUser | null) => void,
    createGroup: (groupName: string) => void,
    joinGroup: (groupId: number) => void, 
    createCommentary: (documentId: number, commentaryName: string) => Promise<boolean>,
    setSelectedGroup: (group: Group) => void,
    setSelectedDocument: (documentInfo: GroupDocumentInfo | null) => void,
    uploadDocument: (document: File, groupId: number) => void,
    getCommentaryForSelection: (commentaryId: number) => void,
    setSelectedCommentary: (commentary: Commentary | null) => void, 
    setSelectedSection: (section: SelectedSection | null) => void
};

const Dashboard = ({ 
    user, 
    userGroups,
    userCommentaries, 
    selectedDocument, 
    selectedCommentary, 
    selectedSection, 
    selectedGroup,
    groupDocuments, 
    updateUser,
    createGroup,
    joinGroup, 
    createCommentary, 
    setSelectedGroup,
    setSelectedDocument,
    uploadDocument,
    getCommentaryForSelection, 
    setSelectedCommentary, 
    setSelectedSection
    }: Props) => {

    if (!user) return <div className='Dashboard'></div>;

    return (
        <div className='Dashboard'>
            <Header 
                user={user} 
                updateUser={updateUser}
            />
            <main className='dashboard-main'>
                {selectedGroup && 
                <GroupContentPanel 
                    key={selectedGroup.id}
                    user={user}
                    userCommentaries={userCommentaries}
                    selectedGroup={selectedGroup}
                    documentsForGroup={groupDocuments.filter(groupDocument => 
                        groupDocument.groupId === selectedGroup.id
                    )}
                    selectedDocument={selectedDocument}
                    selectedCommentary={selectedCommentary}
                    selectedSection={selectedSection}
                    setSelectedDocument={setSelectedDocument}
                    uploadDocument={uploadDocument}
                    createCommentary={createCommentary}
                    getCommentaryForSelection={getCommentaryForSelection}
                    setSelectedCommentary={setSelectedCommentary}
                    setSelectedSection={setSelectedSection}
                />}
                <NetworkPanel 
                    user={user} 
                    userGroups={userGroups}
                    selectedGroup={selectedGroup}
                    setSelectedGroup={setSelectedGroup}
                    setSelectedDocument={setSelectedDocument}
                    createGroup={createGroup}
                    joinGroup={joinGroup}
                />
            </main>
        </div>
    );
};

export default Dashboard;