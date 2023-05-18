import { useState, ChangeEvent, FormEvent } from 'react';
import { LoggedInUser, Group } from '../typeUtils/types';
import GroupSelector from './GroupSelector';
import GroupSearch from './GroupSearch';
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

    const [groupNameInputValue, setGroupNameInputValue] = useState('');

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
            <div className='network-panel--group-membership-section'>
                <h3>User's Groups:</h3>
                {(userGroups.length > 0) && 
                <div className='group-membership-list'>
                    {userGroups.map(group => 
                    <GroupSelector 
                        group={group}
                        isSelected={selectedGroup?.id === group.id}
                        setSelectedGroup={setSelectedGroup}
                    />)}
                </div>}
            </div>
            <div className='network-panel--create-group-section'>
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
            <GroupSearch 
                user={user}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
            />
        </div>
    );
};

export default NetworkPanel;