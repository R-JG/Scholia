import { useState, ChangeEvent, FormEvent } from 'react';
import { GroupDocumentInfo } from '../typeUtils/types';

interface Props {
    documentInfo: GroupDocumentInfo, 
    createCommentary: (documentId: number, commentaryName: string) => void, 
};

const CommentaryCreationForm = ({
    documentInfo, 
    createCommentary, 
    }: Props) => {

    const [nameInputValue, setNameInputValue] = useState<string>('');

    const handleNameInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setNameInputValue(e.currentTarget.value);
    };

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        createCommentary(documentInfo.id, nameInputValue);
        setNameInputValue('');
    };

    return (
        <form 
            className='CommentaryCreationForm'
            onSubmit={handleFormSubmit}>
            <label 
                className='CommentaryCreationForm--name-label'
                htmlFor='CommentaryCreationForm--name-input'>
                Commentary name: 
            </label>
            <input 
                id='CommentaryCreationForm--name-input'
                className='CommentaryCreationForm--name-input'
                type='text' 
                value={nameInputValue}
                onChange={handleNameInputChange}
            />
            <button className='CommentaryCreationForm--submit-button'>
                Create
            </button>
        </form>
    );
}

export default CommentaryCreationForm;