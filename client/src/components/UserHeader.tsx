import { UserToken } from '../typeUtils/types';

interface Props {
    user: UserToken | null,
    setUser: (userData: UserToken | null) => void
};

const UserHeader = ({ user, setUser }: Props) => {

    const logout = (): void => setUser(null);

    return (
        <header className='UserHeader'>
            <h1>{(user) ? user.username : ''}</h1>
            <button className='button--logout' onClick={logout}>Logout</button>
        </header>
    );
};

export default UserHeader;