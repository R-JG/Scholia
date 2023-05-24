import { LoggedInUser, Group, GroupDocumentInfo } from '../typeUtils/types';
import GroupCreationForm from './GroupCreationForm';
import GroupSelector from './GroupSelector';
import GroupSearch from './GroupSearch';
import '../css/NetworkPanel.css';

interface Props {
    user: LoggedInUser | null,
    userGroups: Group[],
    selectedGroup: Group | null,
    setSelectedGroup: (group: Group) => void, 
    setSelectedDocument: (documentInfo: GroupDocumentInfo | null) => void, 
    createGroup: (groupName: string) => void, 
    joinGroup: (groupId: number) => void
};

const NetworkPanel = ({ 
    user, 
    userGroups, 
    selectedGroup, 
    setSelectedGroup,
    setSelectedDocument, 
    createGroup, 
    joinGroup
    }: Props) => {

    if (!user) return <div className='NetworkPanel'></div>;

    return (
        <div className='NetworkPanel'>
            <h3 className='NetworkPanel--groups-title'>Groups</h3>
            {(userGroups.length > 0) && 
            <div className='NetworkPanel--group-membership-list'>
                {userGroups.map(group => 
                <GroupSelector 
                    key={group.id}
                    group={group}
                    isSelected={selectedGroup?.id === group.id}
                    userIsAMember={true}
                    setSelectedGroup={setSelectedGroup}
                    setSelectedDocument={setSelectedDocument}
                    joinGroup={joinGroup}
                />)}
            </div>}
            <GroupSearch 
                user={user}
                userGroups={userGroups}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
                setSelectedDocument={setSelectedDocument}
                joinGroup={joinGroup}
            />
            <GroupCreationForm 
                createGroup={createGroup} 
            />
        </div>
    );
};

export default NetworkPanel;