import { useState, useEffect, ChangeEvent } from 'react';
import { LoggedInUser, Group } from '../typeUtils/types';
import groupsService from '../services/groupsService';
import GroupSelector from './GroupSelector';

interface Props {
    user: LoggedInUser | null, 
    userGroups: Group[], 
    selectedGroup: Group | null,
    setSelectedGroup: (group: Group) => void, 
    joinGroup: (groupId: number) => void
};

const GroupSearch = ({ 
    user, 
    userGroups, 
    selectedGroup, 
    setSelectedGroup, 
    joinGroup
    }: Props) => {

    if (!user) return <div className='GroupSearch'></div>;

    const [searchInputValue, setSearchInputValue] = useState('');
    const [searchResults, setSearchResults] = useState<Group[]>([]);

    useEffect(() => {
        if (!searchInputValue) return;
        const searchGroupbyName = () => {
            groupsService.getGroupsByName(user.token, searchInputValue)
            .then(groupsResult => {
                if (!groupsResult) return;
                setSearchResults(groupsResult);
            });
        };
        const searchDebounce = setTimeout(searchGroupbyName, 1000);
        return () => clearTimeout(searchDebounce);
    }, [searchInputValue]);

    const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setSearchInputValue(e.currentTarget.value);
    };

    return (
        <div className='GroupSearch'>
            <h4>Search for groups</h4>
            <input 
                className='group-search-input' 
                type='text' 
                value={searchInputValue}
                onChange={handleSearchInputChange}
            />
            <div className='search-results'>
                {searchResults.map(group => 
                <GroupSelector 
                    group={group}
                    isSelected={selectedGroup?.id === group.id}
                    userIsAMember={userGroups.some(userGroup => (userGroup.id === group.id))}
                    setSelectedGroup={setSelectedGroup}
                    joinGroup={joinGroup}
                />)}
            </div>
        </div>
    );
};

export default GroupSearch;