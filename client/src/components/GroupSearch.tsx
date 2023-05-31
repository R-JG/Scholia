import { useState, useEffect, ChangeEvent } from 'react';
import { LoggedInUser, Group, GroupDocumentInfo } from '../typeUtils/types';
import { debounceMilliseconds } from '../config';
import groupsService from '../services/groupsService';
import GroupSelector from './GroupSelector';
import '../css/GroupSearch.css';

interface Props {
    user: LoggedInUser | null, 
    userGroups: Group[], 
    selectedGroup: Group | null,
    setSelectedGroup: (group: Group) => void, 
    setSelectedDocument: (documentInfo: GroupDocumentInfo | null) => void, 
    joinGroup: (groupId: number) => void
};

const GroupSearch = ({ 
    user, 
    userGroups, 
    selectedGroup, 
    setSelectedGroup, 
    setSelectedDocument, 
    joinGroup
    }: Props) => {

    if (!user) return <div className='GroupSearch inactive'></div>;

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [searchInputValue, setSearchInputValue] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Group[] | null>([]);

    useEffect(() => {
        if (!searchInputValue) return;
        if (!searchResults) setSearchResults([]);
        const searchGroupByName = () => {
            groupsService.getGroupsByName(user.token, searchInputValue)
            .then(groups => {
                const unjoinedGroups: Group[] = groups.filter(group => !userIsAMember(group));
                if (unjoinedGroups.length === 0) setSearchResults(null);
                if (unjoinedGroups.length > 0) setSearchResults(groups);
            });
        };
        const searchDebounce = setTimeout(searchGroupByName, debounceMilliseconds);
        return () => clearTimeout(searchDebounce);
    }, [searchInputValue]);

    const userIsAMember = (group: Group): boolean => userGroups.some(
        userGroup => (userGroup.id === group.id)
    );

    const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setSearchInputValue(e.currentTarget.value);
    };

    const handleExpandButton = (): void => setIsExpanded(true);

    const handleCancelButton = (): void => {
        setSearchInputValue('');
        setSearchResults([]);
        setIsExpanded(false);
    };

    return (
        <div className='GroupSearch'>
            {!isExpanded && 
            <button 
                className='GroupSearch--expand-button'
                onClick={handleExpandButton}>
                Search for new groups
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
                    {searchResults && searchResults.map(group => 
                    (!userIsAMember(group)) ?
                    <GroupSelector 
                        group={group}
                        isSelected={selectedGroup?.id === group.id}
                        userIsAMember={userIsAMember(group)}
                        setSelectedGroup={setSelectedGroup}
                        setSelectedDocument={setSelectedDocument}
                        joinGroup={joinGroup}
                    /> : undefined)}
                    {(!searchResults) && (searchInputValue !== '') && 
                    <div className='GroupSearch--results-null-message'>
                        No results
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default GroupSearch;