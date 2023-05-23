import { LoggedInUser } from '../typeUtils/types';
import '../css/Header.css';

interface Props {
    user: LoggedInUser | null,
    logout: () => void
};

const Header = ({ 
    user, 
    logout 
    }: Props) => {

    if (!user) return <div className='Header inactive'></div>;

    return (
        <header className='Header'>
            <h4 className='Header--username'>
                {user.username}
            </h4>
            <button 
                className='Header--logout-button' 
                onClick={logout}>
                Logout
            </button>
        </header>
    );
};

export default Header;