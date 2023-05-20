import { useState, useEffect, ChangeEvent } from 'react';
import { LoggedInUser, Group } from '../typeUtils/types';
import { groupSearchDebounceMilliseconds } from '../config';
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

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
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
        const searchDebounce = setTimeout(searchGroupbyName, groupSearchDebounceMilliseconds);
        return () => clearTimeout(searchDebounce);
    }, [searchInputValue]);

    const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setSearchInputValue(e.currentTarget.value);
    };

    const handleExpandButton = (): void => setIsExpanded(true);

    const handleCancelButton = (): void => {
        setSearchInputValue('');
        setIsExpanded(false);
    };

    return (
        <div className='GroupSearch'>
            {!isExpanded && 
            <button 
                className='GroupSearch--expand-button'
                onClick={handleExpandButton}>
                Search for groups
            </button>}
            <div 
                className='GroupSearch--search-container'
                style={isExpanded ? undefined : { display: 'none' }}>
                <div className='GroupSearch--top-bar'>
                    <input 
                        className='GroupSearch--search-input' 
                        type='text' 
                        value={searchInputValue}
                        onChange={handleSearchInputChange}
                    />
                    <button 
                        className='GroupSearch--cancel-button'
                        onClick={handleCancelButton}>
                        Cancel
                    </button>
                </div>
                <div className='GroupSearch--search-results'>
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
        </div>
    );
};

export default GroupSearch;