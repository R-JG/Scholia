import { Link } from 'react-router-dom';
import { LoggedInUser } from '../typeUtils/types';
import { dashboardRoute } from '../config';
import LoginForm from './LoginForm';
import Header from './Header';
import '../css/Home.css';

interface Props {
    user: LoggedInUser | null,
    updateUser: (userData: LoggedInUser | null) => void,
    logout: () => void
};

const Home = ({ 
    user, 
    updateUser, 
    logout
    }: Props) => {

    return (
        <div className='Home'>
            <Header 
                user={user} 
                logout={logout} 
            />
            {(!user) 
            ? <LoginForm 
                updateUser={updateUser}
            />
            : <Link to={dashboardRoute}>Go to dashboard</Link>}
        </div>
    );
};

export default Home;