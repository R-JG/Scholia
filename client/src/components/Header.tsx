import { UserToken } from '../typeUtils/types';
import '../css/Header.css';

interface Props {
    user: UserToken | null,
    updateUser: (userData: UserToken | null) => void
};

const UserHeader = ({ user, updateUser }: Props) => {

    const logout = (): void => updateUser(null);

    return (
        <header className='Header'>
            {user && <h4 className='header--username'>{user.username}</h4>}
            {user && <button className='header--logout-button' onClick={logout}>Logout</button>}
        </header>
    );
};

export default UserHeader;