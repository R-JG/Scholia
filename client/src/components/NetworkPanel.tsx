import { useState, ChangeEvent, FormEvent } from 'react';
import { User, LoggedInUser, Group } from '../typeUtils/types';
import usersService from '../services/usersService';
import GroupSelector from './GroupSelector';
import '../css/NetworkPanel.css';

interface Props {
    user: LoggedInUser | null,
    userGroups: Group[],
    selectedGroup: Group | null,
    setSelectedGroup: (group: Group) => void,
    createGroup: (groupName: string) => void
};

const NetworkPanel = ({ 
    user, 
    userGroups, 
    selectedGroup, 
    setSelectedGroup,
    createGroup
}: Props) => {

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
        createGroup(groupNameInputValue);
        setGroupNameInputValue('');
    };

    return (
        <div className='NetworkPanel'>
            <div className='network-panel--groups'>
                <h3>Groups</h3>
                {(userGroups.length > 0) 
                && <div className='network-panel--group-list'>
                    {userGroups.map(group => 
                    <GroupSelector 
                        group={group}
                        isSelected={selectedGroup?.id === group.id}
                        setSelectedGroup={setSelectedGroup}
                    />)}
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
            <h3>Search</h3>
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
        </div>
    );
};

export default NetworkPanel;