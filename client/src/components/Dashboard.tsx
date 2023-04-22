import { useState } from 'react';
import { LoggedInUser, Group } from '../typeUtils/types';
import Header from './Header';
import NetworkPanel from './NetworkPanel';
import '../css/Dashboard.css';

interface Props {
    user: LoggedInUser | null,
    userGroups: Group[],
    updateUser: (userData: LoggedInUser | null) => void,
    createGroup: (groupName: string) => void
};

const Dashboard = ({ 
    user, 
    userGroups, 
    updateUser,
    createGroup
}: Props) => {

    if (!user) return <div className='Dashboard'></div>;

    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    return (
        <div className='Dashboard'>
            {user && 
            <Header 
                user={user} 
                updateUser={updateUser}
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