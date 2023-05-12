import { LoggedInUser, Group, GroupDocumentInfo, CommentaryInfo } from '../typeUtils/types';
import Header from './Header';
import GroupContentPanel from './GroupContentPanel';
import NetworkPanel from './NetworkPanel';
import '../css/Dashboard.css';

interface Props {
    user: LoggedInUser | null,
    userGroups: Group[],
    userCommentaries: CommentaryInfo[],
    selectedGroup: Group | null,
    groupDocuments: GroupDocumentInfo[],
    updateUser: (userData: LoggedInUser | null) => void,
    createGroup: (groupName: string) => void,
    setSelectedGroup: (group: Group) => void,
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void,
    uploadDocument: (document: File, groupId: number) => void,
    getCommentaryForSelection: (commentaryId: number) => void
};

const Dashboard = ({ 
    user, 
    userGroups,
    userCommentaries,
    selectedGroup,
    groupDocuments, 
    updateUser,
    createGroup,
    setSelectedGroup,
    setSelectedDocument,
    uploadDocument,
    getCommentaryForSelection
    }: Props) => {

    if (!user) return <div className='Dashboard'></div>;

    return (
        <div className='Dashboard'>
            <Header 
                user={user} 
                updateUser={updateUser}
            />
            <div className='TEST-TEST-TEST'>{userCommentaries.map(commentaryInfo => <div onClick={() => getCommentaryForSelection(commentaryInfo.id)}>{commentaryInfo.commentaryName}</div>)}</div>
            {selectedGroup && 
            <GroupContentPanel 
                user={user}
                selectedGroup={selectedGroup}
                documentsOfGroup={groupDocuments.filter(groupDocument => 
                    groupDocument.groupId === selectedGroup.id
                )}
                setSelectedDocument={setSelectedDocument}
                uploadDocument={uploadDocument}
            />}
            <NetworkPanel 
                user={user} 
                userGroups={userGroups}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
                createGroup={createGroup}
            />
        </div>
    );
};

export default Dashboard;