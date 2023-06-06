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
    logout: () => void, 
    createGroup: (groupName: string) => void,
    joinGroup: (groupId: number) => void, 
    createCommentary: (documentId: number, commentaryName: string) => Promise<boolean>,
    setGroupDocuments: (groupDocuments: GroupDocumentInfo[]) => void, 
    setSelectedGroup: (group: Group) => void,
    setSelectedDocument: (documentInfo: GroupDocumentInfo | null) => void,
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
    logout,
    createGroup,
    joinGroup, 
    createCommentary, 
    setGroupDocuments, 
    setSelectedGroup,
    setSelectedDocument,
    getCommentaryForSelection, 
    setSelectedCommentary, 
    setSelectedSection
    }: Props) => {

    if (!user) return <div className='Dashboard inactive'></div>;

    const createGroupDisplayStyle = (groupId: number): { display: string } => {
        return (groupId === selectedGroup?.id) ? { display: 'flex' } : { display: 'none' };
    };

    return (
        <div className='Dashboard'>
            <Header 
                user={user} 
                logout={logout}
            />
            <main className='Dashboard--main'>
                {userGroups.map(group => 
                <GroupContentPanel 
                    key={group.id}
                    displayStyle={createGroupDisplayStyle(group.id)}
                    user={user}
                    userCommentaries={userCommentaries}
                    groupDocuments={groupDocuments}
                    selectedGroup={selectedGroup}
                    documentsForGroup={groupDocuments.filter(groupDocument => 
                        groupDocument.groupId === group.id
                    )}
                    selectedDocument={selectedDocument}
                    selectedCommentary={selectedCommentary}
                    selectedSection={selectedSection}
                    setGroupDocuments={setGroupDocuments}
                    setSelectedDocument={setSelectedDocument}
                    createCommentary={createCommentary}
                    getCommentaryForSelection={getCommentaryForSelection}
                    setSelectedCommentary={setSelectedCommentary}
                    setSelectedSection={setSelectedSection}
                />)}
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