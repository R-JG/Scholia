import { Group } from '../typeUtils/types';
import '../css/GroupSelector.css';

interface Props {
    group: Group,
    isSelected: boolean,
    userIsAMember: boolean, 
    setSelectedGroup: (group: Group) => void, 
    joinGroup: (groupId: number) => void
};

const GroupSelector = ({ 
    group, 
    isSelected, 
    userIsAMember, 
    setSelectedGroup, 
    joinGroup
    }: Props) => {

    const handleSelectorClick = (): void => {
        if (!userIsAMember) return;
        setSelectedGroup(group)
    };

    const handleJoinButton = (): void => {
        if (userIsAMember) return;
        joinGroup(group.id);
    };

    return (
        <div 
            className={`GroupSelector ${isSelected ? 'selected' : ''}`}
            onClick={handleSelectorClick}
        >
            <h5>{group.groupName}</h5>
            {!userIsAMember && 
            <button 
                className='join-group-button'
                onClick={handleJoinButton}>
                Join
            </button>}
        </div>
    );
};

export default GroupSelector;