import { LoggedInUser, Group, GroupDocumentInfo, CommentaryInfo, Commentary } from '../typeUtils/types';
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
    selectedGroup: Group | null,
    groupDocuments: GroupDocumentInfo[],
    updateUser: (userData: LoggedInUser | null) => void,
    createGroup: (groupName: string) => void,
    setSelectedGroup: (group: Group) => void,
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void,
    uploadDocument: (document: File, groupId: number) => void,
    getCommentaryForSelection: (commentaryId: number) => void,
    setSelectedCommentary: (commentary: Commentary | null) => void
};

const Dashboard = ({ 
    user, 
    userGroups,
    userCommentaries,
    selectedCommentary, 
    selectedGroup,
    groupDocuments, 
    updateUser,
    createGroup,
    setSelectedGroup,
    setSelectedDocument,
    uploadDocument,
    getCommentaryForSelection, 
    setSelectedCommentary
    }: Props) => {

    if (!user) return <div className='Dashboard'></div>;

    return (
        <div className='Dashboard'>
            <Header 
                user={user} 
                updateUser={updateUser}
            />
            <div className='TEST-TEST-TEST'>
                {userCommentaries.map(commentaryInfo => 
                <CommentarySelector 
                    commentaryInfo={commentaryInfo}
                    groupDocuments={groupDocuments}
                    setSelectedDocument={setSelectedDocument}
                    getCommentaryForSelection={getCommentaryForSelection} 
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
                setSelectedDocument={setSelectedDocument}
                uploadDocument={uploadDocument}
                setSelectedCommentary={setSelectedCommentary}
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