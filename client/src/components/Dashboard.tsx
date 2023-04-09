import { UserToken } from '../typeUtils/types';
import UserHeader from './UserHeader';
import '../css/Dashboard.css';

interface Props {
    user: UserToken | null,
    setUser: (userData: UserToken | null) => void
};

const Dashboard = ({ user, setUser }: Props) => {
    return (
        <div className='Dashboard'>
            {user && 
            <UserHeader 
                user={user} 
                setUser={setUser}
            />}
            <h1>Dashboard</h1>
        </div>
    );
};

export default Dashboard;