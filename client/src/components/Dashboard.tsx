import { LoggedInUser, Group, GroupDocumentInfo, CommentaryInfo, Commentary, SelectedSection } from '../typeUtils/types';
import Header from './Header';
import GroupContentPanel from './GroupContentPanel';
import NetworkPanel from './NetworkPanel';
import CommentarySelector from './CommentarySelector';
import '../css/Dashboard.css';

interface Props {
    user: LoggedInUser | null,
    userGroups: Group[],
    userCommentaries: CommentaryInfo[],
    selectedCommentary: Commentary | null,
    selectedSection: SelectedSection | null,
    selectedGroup: Group | null,
    groupDocuments: GroupDocumentInfo[],
    updateUser: (userData: LoggedInUser | null) => void,
    createGroup: (groupName: string) => void,
    joinGroup: (groupId: number) => void, 
    setSelectedGroup: (group: Group) => void,
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void,
    uploadDocument: (document: File, groupId: number) => void,
    getCommentaryForSelection: (commentaryId: number) => void,
    setSelectedCommentary: (commentary: Commentary | null) => void, 
    setSelectedSection: (section: SelectedSection | null) => void
};

const Dashboard = ({ 
    user, 
    userGroups,
    userCommentaries,
    selectedCommentary, 
    selectedSection, 
    selectedGroup,
    groupDocuments, 
    updateUser,
    createGroup,
    joinGroup, 
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
                <div className='TEST-TEST-TEST'>
                    {userCommentaries.map(commentaryInfo => 
                    <CommentarySelector 
                        commentaryInfo={commentaryInfo}
                        groupDocuments={groupDocuments}
                        setSelectedDocument={setSelectedDocument}
                        getCommentaryForSelection={getCommentaryForSelection} 
                        setSelectedSection={setSelectedSection}
                    />)}
                </div>
                {selectedGroup && 
                <GroupContentPanel 
                    user={user}
                    selectedGroup={selectedGroup}
                    documentsOfGroup={groupDocuments.filter(groupDocument => 
                        groupDocument.groupId === selectedGroup.id
                    )}
                    selectedCommentary={selectedCommentary}
                    selectedSection={selectedSection}
                    setSelectedDocument={setSelectedDocument}
                    uploadDocument={uploadDocument}
                    setSelectedCommentary={setSelectedCommentary}
                    setSelectedSection={setSelectedSection}
                />}
                <NetworkPanel 
                    user={user} 
                    userGroups={userGroups}
                    selectedGroup={selectedGroup}
                    setSelectedGroup={setSelectedGroup}
                    createGroup={createGroup}
                    joinGroup={joinGroup}
                />
            </main>
        </div>
    );
};

export default Dashboard;