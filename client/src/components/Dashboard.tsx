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
    groupStateIsInitialized: boolean, 
    userCommentaries: CommentaryInfo[], 
    selectedDocument: GroupDocumentInfo | null, 
    selectedCommentary: Commentary | null, 
    selectedSection: SelectedSection | null,
    selectedGroup: Group | null,
    allDocumentsForGroups: GroupDocumentInfo[],
    logout: () => void, 
    createGroup: (groupName: string) => void,
    joinGroup: (groupId: number) => void, 
    createCommentary: (documentId: number, commentaryName: string) => Promise<boolean>,
    setAllDocumentsForGroups: (groupDocuments: GroupDocumentInfo[]) => void, 
    setSelectedGroup: (group: Group) => void,
    setSelectedDocument: (documentInfo: GroupDocumentInfo | null) => void,
    getCommentaryForSelection: (commentaryId: number) => void,
    setSelectedCommentary: (commentary: Commentary | null) => void, 
    setSelectedSection: (section: SelectedSection | null) => void
};

const Dashboard = ({ 
    user, 
    userGroups,
    groupStateIsInitialized, 
    userCommentaries, 
    selectedDocument, 
    selectedCommentary, 
    selectedSection, 
    selectedGroup,
    allDocumentsForGroups, 
    logout,
    createGroup,
    joinGroup, 
    createCommentary, 
    setAllDocumentsForGroups, 
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
                {groupStateIsInitialized && (userGroups.length === 0) && 
                <div className='Dashboard--no-groups-message-container'>
                    <p className='Dashboard--no-groups-message-text'>
                        {`Welcome to Scholia ${user.username}!`}
                    </p>
                    <p className='Dashboard--no-groups-message-text'>
                        Create a group and upload some documents to get started.
                    </p>
                    <p className='Dashboard--no-groups-message-text'>
                        Or, search for the "Demo Group" and join to view some example documents and commentaries.
                    </p>
                </div>}
                {userGroups.map(group => 
                <GroupContentPanel 
                    key={group.id}
                    user={user}
                    group={group}
                    displayStyle={createGroupDisplayStyle(group.id)}
                    userCommentaries={userCommentaries}
                    allDocumentsForGroups={allDocumentsForGroups}
                    selectedGroup={selectedGroup}
                    selectedDocument={selectedDocument}
                    selectedCommentary={selectedCommentary}
                    selectedSection={selectedSection}
                    setAllDocumentsForGroups={setAllDocumentsForGroups}
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