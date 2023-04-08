import { UserToken } from '../typeUtils/types';
import LoginForm from './LoginForm';
import '../css/Home.css';

interface Props {
    user: UserToken | null,
    setUser: (userData: UserToken | null) => void
};

const Home = ({ 
    user, 
    setUser
}: Props) => {

    return (
        <div className='Home'>
            <div>
                {!user && 
                <LoginForm 
                    setUser={setUser}
                />}
            </div>
        </div>
    );
};

export default Home;