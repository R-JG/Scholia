import { useState, ChangeEvent, FormEvent } from 'react';
import { User, UserToken } from '../typeUtils/types';
import usersService from '../services/usersService';

interface Props {
    user: UserToken | null
};

const NetworkPanel = ({ user }: Props) => {

    if (!user) return <div className='NetworkPanel'></div>;

    const [userSearchValue, setUserSearchValue] = useState('');
    const [userSearchResult, setUserSearchResult] = useState<User[]>([]);

    const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setUserSearchValue(e.currentTarget.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (userSearchValue === '') return;
        usersService.searchByUsername(userSearchValue, user.token).then(users => 
            setUserSearchResult(users)
        );
    };

    return (
        <div className='NetworkPanel'>
            <form onSubmit={handleSubmit}>
                <input 
                    className='input--user-search' 
                    type='text' 
                    value={userSearchValue}
                    onChange={handleSearchInputChange}
                />
                <button>Search Users</button>
            </form>
            <div>
                {userSearchResult.map(user => 
                <h5>{user.username}</h5>)}
            </div>
        </div>
    );
};

export default NetworkPanel;