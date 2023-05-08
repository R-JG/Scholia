import { Commentary, CommentarySection, PageSelectionCoordinates } from '../typeUtils/types';
import '../css/CommentaryNavigator.css';

interface Props {
    selectedCommentary: Commentary | null,
    selectedSection: { section: CommentarySection, index: number } | null,
    setSelectedSection: (section: { section: CommentarySection, index: number }) => void,
    jumpToSelection: (coordinates: PageSelectionCoordinates) => void
};

const CommentaryNavigator = ({ 
    selectedCommentary, 
    selectedSection, 
    setSelectedSection, 
    jumpToSelection 
    }: Props) => {

    if (!selectedCommentary) return <div className='CommentaryNavigator'></div>;

    const handleNavigateButton = (direction: 'previous' | 'next'): void => {
        if (!selectedSection) return;
        const newIndex: number = (
            (direction === 'previous') ? selectedSection.index - 1 : selectedSection.index + 1
        );
        const newSelectedSection: CommentarySection | undefined = 
        selectedCommentary.commentarySections.body[newIndex];
        if (!newSelectedSection) return;
        setSelectedSection({ section: newSelectedSection, index: newIndex });
        jumpToSelection(newSelectedSection.coordinates);
    };

    return (
        <div className='CommentaryNavigator'>
            <button onClick={() => handleNavigateButton('previous')}>◀</button>
            <div className='commentary-section-display'>
                {selectedCommentary.commentarySections.body.map((section, index) => 
                <div 
                    className='commentary-section-icon' 
                    onClick={() => {
                        setSelectedSection({ section, index });
                        jumpToSelection(section.coordinates);
                    }}>
                </div>)}
            </div>
            <button onClick={() => handleNavigateButton('next')}>▶</button>
        </div>
    );
};

export default CommentaryNavigator;