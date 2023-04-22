import { Group } from '../typeUtils/types';
import '../css/GroupSelector.css';

interface Props {
    group: Group,
    isSelected: boolean,
    setSelectedGroup: (group: Group) => void
};

const GroupSelector = ({ group, isSelected, setSelectedGroup }: Props) => {

    const handleClick = () => setSelectedGroup(group);

    return (
        <div 
            className='GroupSelector'
            onClick={handleClick}
        >
            <h5>{group.groupName}</h5>
            {isSelected && 
            <div>
                <p>TEST - the group is selected</p>
            </div>}
        </div>
    );
};

export default GroupSelector;