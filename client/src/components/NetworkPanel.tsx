import { useState, ChangeEvent, FormEvent } from 'react';
import { User, UserToken } from '../typeUtils/types';
import usersService from '../services/usersService';
import groupsService from '../services/groupsService';

interface Props {
    user: UserToken | null
};

const NetworkPanel = ({ user }: Props) => {

    if (!user) return <div className='NetworkPanel'></div>;

    const [searchInputValue, setSearchInputValue] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [groupNameInputValue, setGroupNameInputValue] = useState('');

    const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setSearchInputValue(e.currentTarget.value);
    };

    const handleSearchFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (searchInputValue === '') return;
        usersService.searchByUsername(searchInputValue, user.token).then(users => 
            setSearchResults(users)
        );
    };

    const handleGroupNameInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setGroupNameInputValue(e.currentTarget.value);
    };

    const handleGroupFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (groupNameInputValue === '') return;
        groupsService.createGroup({ groupName: groupNameInputValue }, user.token);
    };

    return (
        <div className='NetworkPanel'>
            <form 
                className='form--search' 
                onSubmit={handleSearchFormSubmit}
            >
                <input 
                    className='input--search' 
                    type='text' 
                    value={searchInputValue}
                    onChange={handleSearchInputChange}
                />
                <button>Search Users</button>
            </form>
            {(searchResults.length > 0) 
            && <div className='search-results'>
                {searchResults.map(user => 
                <h5>{user.username}</h5>)}
            </div>}
            <form 
                className='form--create-group'
                onSubmit={handleGroupFormSubmit}
            >
                <input 
                    className='input--group-name' 
                    type='text' 
                    value={groupNameInputValue}
                    onChange={handleGroupNameInputChange}
                />
                <button>Create Group</button>
            </form>
        </div>
    );
};

export default NetworkPanel;