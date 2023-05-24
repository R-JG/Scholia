import { useState, ChangeEvent, FormEvent } from 'react';
import '../css/GroupCreationForm.css';

interface Props {
    createGroup: (groupName: string) => void, 
};

const GroupCreationForm = ({ createGroup }: Props) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [groupNameInputValue, setGroupNameInputValue] = useState<string>('');

    const handleExpandButton = (): void => setIsExpanded(true);

    const handleCancelButton = (): void => {
        setGroupNameInputValue('');
        setIsExpanded(false);
    };

    const handleGroupNameInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setGroupNameInputValue(e.currentTarget.value);
    };

    const handleGroupFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (groupNameInputValue === '') return;
        createGroup(groupNameInputValue);
        setGroupNameInputValue('');
        setIsExpanded(false);
    };

    return (
        <div className='GroupCreationForm'>
            {!isExpanded && 
            <button
                className='GroupCreationForm--expand-button'
                onClick={handleExpandButton}>
                Create Group
            </button>}
            <form 
                className='GroupCreationForm--form'
                style={isExpanded ? undefined : { display: 'none' }}
                onSubmit={handleGroupFormSubmit}
            >
                <label 
                    className='GroupCreationForm--group-name-label' 
                    htmlFor='GroupCreationForm--group-name-input'>
                    Group name: 
                </label>
                <input 
                    id='GroupCreationForm--group-name-input'
                    className='GroupCreationForm--group-name-input' 
                    type='text' 
                    value={groupNameInputValue}
                    onChange={handleGroupNameInputChange}
                />
                <button className='GroupCreationForm--submit-button'>
                    Create
                </button>
                <button 
                    className='GroupCreationForm--cancel-button'
                    type='button'
                    onClick={handleCancelButton}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default GroupCreationForm;