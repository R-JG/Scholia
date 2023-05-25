import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { commentaryToolRoute } from '../config';
import { GroupDocumentInfo } from '../typeUtils/types';
import '../css/CommentaryCreationForm.css';

interface Props {
    selectedDocument: GroupDocumentInfo | null, 
    createCommentary: (documentId: number, commentaryName: string) => Promise<boolean>, 
};

const CommentaryCreationForm = ({
    selectedDocument, 
    createCommentary, 
    }: Props) => {

    if (!selectedDocument) return <div className='CommentaryCreationForm inactive'></div>;

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [nameInputValue, setNameInputValue] = useState<string>('');

    const navigate = useNavigate();

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
        createCommentary(selectedDocument.id, nameInputValue)
        .then(creationIsSuccessful => {
            if (!creationIsSuccessful) return;
            setNameInputValue('');
            navigate(commentaryToolRoute);
        });
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