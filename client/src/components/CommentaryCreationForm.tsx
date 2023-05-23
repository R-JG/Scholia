import { useState, ChangeEvent, FormEvent } from 'react';
import { GroupDocumentInfo } from '../typeUtils/types';

interface Props {
    selectedDocument: GroupDocumentInfo | null, 
    createCommentary: (documentId: number, commentaryName: string) => void, 
};

const CommentaryCreationForm = ({
    selectedDocument, 
    createCommentary, 
    }: Props) => {

    if (!selectedDocument) return <div className='CommentaryCreationForm'></div>;

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [nameInputValue, setNameInputValue] = useState<string>('');

    const handleExpandButton = (): void => setIsExpanded(true);

    const handleCancelButton = (): void => {
        setNameInputValue('');
        setIsExpanded(false);
    };

    const handleNameInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setNameInputValue(e.currentTarget.value);
    };

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        createCommentary(selectedDocument.id, nameInputValue);
        setNameInputValue('');
    };

    return (
        <div className='CommentaryCreationForm'>
            {!isExpanded && 
            <button
                className='CommentaryCreationForm--expand-button'
                onClick={handleExpandButton}>
                Create Commentary
            </button>}
            <form 
                className='CommentaryCreationForm--form'
                style={isExpanded ? undefined : { display: 'none' }}
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
                <button 
                    className='CommentaryCreationForm--cancel-button'
                    type='button'
                    onClick={handleCancelButton}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default CommentaryCreationForm;