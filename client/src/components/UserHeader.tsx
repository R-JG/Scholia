import { UserToken } from '../typeUtils/types';

interface Props {
    user: UserToken | null,
    updateUser: (userData: UserToken | null) => void
};

const UserHeader = ({ user, updateUser }: Props) => {

    const logout = (): void => updateUser(null);

    return (
        <header className='UserHeader'>
            <h1>{(user) ? user.username : ''}</h1>
            <button className='button--logout' onClick={logout}>Logout</button>
        </header>
    );
};

export default UserHeader;