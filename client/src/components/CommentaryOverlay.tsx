import { useState, ChangeEvent } from 'react';
import { Commentary, CommentarySection } from '../typeUtils/types';

interface Props {
    selectedCommentary: Commentary | null,
    selectedSection: { section: CommentarySection, index: number } | null,
    editTextMode: boolean
};

const CommentaryOverlay = ({ 
    selectedCommentary, 
    selectedSection, 
    editTextMode 
    }: Props) => {

    if (!selectedCommentary || !selectedSection) return <div className='CommentaryOverlay'></div>

    const [textAreaValue, setTextAreaValue] = useState<string>('');

    const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        setTextAreaValue(e.currentTarget.value);
    };

    return (
        <div className='CommentaryOverlay'>
            {editTextMode 
            ? <textarea 
                className='commentary-section-text'
                value={textAreaValue}
                onChange={handleTextAreaChange}
            />
            : <p className='commentary-section-text'>
                {selectedSection.section.text}
            </p>}
        </div>
    );
};

export default CommentaryOverlay;