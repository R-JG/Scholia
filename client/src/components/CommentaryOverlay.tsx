import { ChangeEvent } from 'react';
import { Commentary, SelectedSection } from '../typeUtils/types';
import '../css/CommentaryOverlay.css';

interface Props {
    selectedCommentary: Commentary | null,
    selectedSection: SelectedSection | null,
    editTextMode: boolean,
    setSelectedSection: (section: SelectedSection | null) => void, 
    updateSelectedSectionText: (updatedText: string) => void,
    cancelSectionTextEdit: () => void
};

const CommentaryOverlay = ({ 
    selectedCommentary, 
    selectedSection, 
    editTextMode,
    setSelectedSection, 
    updateSelectedSectionText, 
    cancelSectionTextEdit
    }: Props) => {

    if (!selectedCommentary || !selectedSection) return <div className='CommentaryOverlay inactive'></div>;

    const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        updateSelectedSectionText(e.currentTarget.value);
    };

    const handleCloseButton = () => {
        cancelSectionTextEdit();
        setSelectedSection(null);
    };

    return (
        <div className='CommentaryOverlay'>
            <button 
                className='CommentaryOverlay--close-button'
                onClick={handleCloseButton}>
                🞪
            </button>
            {editTextMode 
            ? <textarea 
                className='CommentaryOverlay--section-text--edit'
                value={selectedSection.data.text}
                onChange={handleTextAreaChange}
            />
            : <p 
                className='CommentaryOverlay--section-text--read-only' 
                style={{ whiteSpace: 'pre-line' }}>
                {selectedSection.data.text}
            </p>}
        </div>
    );
};

export default CommentaryOverlay;