import { useEffect } from 'react';
import groupsService from '../services/groupsService';
import { UserToken } from '../typeUtils/types';
import UserHeader from './Header';
import NetworkPanel from './NetworkPanel';
import '../css/Dashboard.css';

interface Props {
    user: UserToken | null,
    updateUser: (userData: UserToken | null) => void
};

const Dashboard = ({ user, updateUser }: Props) => {

    if (!user) return <div className='Dashboard'></div>;

    useEffect(() => {
        groupsService.getGroupsByUser(user.token);
    }, []);

    return (
        <div className='Dashboard'>
            {user && 
            <UserHeader 
                user={user} 
                updateUser={updateUser}
            />}
            <h1>Dashboard</h1>
            <NetworkPanel user={user} />
        </div>
    );
};

export default Dashboard;