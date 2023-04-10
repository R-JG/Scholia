import { UserToken } from '../typeUtils/types';
import UserHeader from './UserHeader';
import '../css/Dashboard.css';

interface Props {
    user: UserToken | null,
    updateUser: (userData: UserToken | null) => void
};

const Dashboard = ({ user, updateUser }: Props) => {
    return (
        <div className='Dashboard'>
            {user && 
            <UserHeader 
                user={user} 
                updateUser={updateUser}
            />}
            <h1>Dashboard</h1>
        </div>
    );
};

export default Dashboard;