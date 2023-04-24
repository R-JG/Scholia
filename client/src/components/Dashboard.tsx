import { useState } from 'react';
import { LoggedInUser, Group } from '../typeUtils/types';
import Header from './Header';
import GroupContentPanel from './GroupContentPanel';
import NetworkPanel from './NetworkPanel';
import '../css/Dashboard.css';

interface Props {
    user: LoggedInUser | null,
    userGroups: Group[],
    updateUser: (userData: LoggedInUser | null) => void,
    createGroup: (groupName: string) => void,
    uploadDocument: (document: File, groupId: number) => void
};

const Dashboard = ({ 
    user, 
    userGroups, 
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
            <GroupContentPanel 
                selectedGroup={selectedGroup}
                uploadDocument={uploadDocument}
            />
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