import { Link } from 'react-router-dom';
import { UserToken } from '../typeUtils/types';
import { dashboardRoute } from '../routesConfig';
import LoginForm from './LoginForm';
import Header from './Header';
import '../css/Home.css';

interface Props {
    user: UserToken | null,
    updateUser: (userData: UserToken | null) => void
};

const Home = ({ 
    user, 
    updateUser
}: Props) => {

    return (
        <div className='Home'>
            <Header 
                user={user} 
                updateUser={updateUser} 
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