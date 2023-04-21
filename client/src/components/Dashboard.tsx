import { UserToken, Group } from '../typeUtils/types';
import Header from './Header';
import NetworkPanel from './NetworkPanel';
import '../css/Dashboard.css';

interface Props {
    user: UserToken | null,
    userGroups: Group[],
    updateUser: (userData: UserToken | null) => void
};

const Dashboard = ({ user, userGroups, updateUser }: Props) => {

    if (!user) return <div className='Dashboard'></div>;

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
            />
        </div>
    );
};

export default Dashboard;