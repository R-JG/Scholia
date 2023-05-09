import { ChangeEvent } from 'react';
import { Commentary, CommentarySection } from '../typeUtils/types';
import '../css/CommentaryOverlay.css';

interface Props {
    selectedCommentary: Commentary | null,
    selectedSection: { data: CommentarySection, index: number } | null,
    editTextMode: boolean,
    updateSelectedSectionText: (updatedText: string) => void,
};

const CommentaryOverlay = ({ 
    selectedCommentary, 
    selectedSection, 
    editTextMode,
    updateSelectedSectionText
    }: Props) => {

    if (!selectedCommentary || !selectedSection) return <div className='CommentaryOverlay'></div>

    const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        updateSelectedSectionText(e.currentTarget.value);
    };

    return (
        <div className='CommentaryOverlay'>
            {editTextMode 
            ? <textarea 
                className='commentary-section-text--edit'
                value={selectedSection.data.text}
                onChange={handleTextAreaChange}
            />
            : <p className='commentary-section-text--read-only'>
                {selectedSection.data.text}
            </p>}
        </div>
    );
};

export default CommentaryOverlay;