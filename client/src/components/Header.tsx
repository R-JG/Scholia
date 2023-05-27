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

    return (
        <header className='Header'>
            <h1 className='Header--title'>SCHOLIA</h1>
            {user &&
            <div className='Header--user-section'>
                <h4 className='Header--username'>
                    {user.username}
                </h4>
                <button 
                    className='Header--logout-button' 
                    onClick={logout}>
                    Logout
                </button>
            </div>}
        </header>
    );
};

export default Header;