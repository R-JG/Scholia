import { Group, GroupDocumentInfo } from '../typeUtils/types';
import '../css/GroupSelector.css';

interface Props {
    group: Group,
    isSelected: boolean,
    userIsAMember: boolean, 
    setSelectedGroup: (group: Group) => void, 
    setSelectedDocument: (documentInfo: GroupDocumentInfo | null) => void, 
    joinGroup: (groupId: number) => void
};

const GroupSelector = ({ 
    group, 
    isSelected, 
    userIsAMember, 
    setSelectedGroup, 
    setSelectedDocument, 
    joinGroup
    }: Props) => {

    const handleSelectorClick = (): void => {
        if (!userIsAMember) return;
        setSelectedGroup(group);
        setSelectedDocument(null);
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
            <h5 className='GroupSelector--group-name'>{group.groupName}</h5>
            {!userIsAMember && 
            <button 
                className='GroupSelector--join-group-button'
                onClick={handleJoinButton}>
                Join
            </button>}
        </div>
    );
};

export default GroupSelector;