import { useState } from 'react';
import { LoggedInUser, Group, GroupDocumentInfo } from '../typeUtils/types';
import Header from './Header';
import GroupContentPanel from './GroupContentPanel';
import NetworkPanel from './NetworkPanel';
import '../css/Dashboard.css';

interface Props {
    user: LoggedInUser | null,
    userGroups: Group[],
    groupDocuments: GroupDocumentInfo[],
    updateUser: (userData: LoggedInUser | null) => void,
    createGroup: (groupName: string) => void,
    uploadDocument: (document: File, groupId: number) => void
};

const Dashboard = ({ 
    user, 
    userGroups,
    groupDocuments, 
    updateUser,
    createGroup,
    uploadDocument
}: Props) => {

    if (!user) return <div className='Dashboard'></div>;

    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    return (
        <div className='Dashboard'>
            <Header 
                user={user} 
                updateUser={updateUser}
            />
            {selectedGroup && 
            <GroupContentPanel 
                selectedGroup={selectedGroup}
                selectedGroupDocuments={groupDocuments.filter(groupDocument => 
                    groupDocument.groupId === selectedGroup.id
                )}
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