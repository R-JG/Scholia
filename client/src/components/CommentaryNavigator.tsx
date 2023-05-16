import { Commentary, CommentarySection, NavDirection } from '../typeUtils/types';
import '../css/CommentaryNavigator.css';

interface Props {
    selectedCommentary: Commentary | null,
    selectedSection: { data: CommentarySection, index: number } | null,
    setSelectedSection: (section: { data: CommentarySection, index: number }) => void,
    jumpToSelection: (pageNumber: number, pageCoordinateTop: number) => void
};

const CommentaryNavigator = ({ 
    selectedCommentary, 
    selectedSection, 
    setSelectedSection, 
    jumpToSelection 
    }: Props) => {

    if (!selectedCommentary) return <div className='CommentaryNavigator'></div>;

    const navigateSections = (direction: NavDirection): void => {
        if (!selectedSection) return;
        const newIndex: number = (
            (direction === 'previous') ? selectedSection.index - 1 : selectedSection.index + 1
        );
        const newSelectedSection: CommentarySection | undefined = 
        selectedCommentary.commentarySections[newIndex];
        if (!newSelectedSection) return;
        setSelectedSection({ data: newSelectedSection, index: newIndex });
        jumpToSelection(newSelectedSection.pageNumber, newSelectedSection.pageCoordinateTop);
    };

    const handleNavigateButton = (direction: NavDirection): void => {
        navigateSections(direction);
    };

    return (
        <div className='CommentaryNavigator'>
            {selectedSection && (selectedSection.index !== 0) &&
            <button 
                onClick={() => handleNavigateButton('previous')}>
                ◀
            </button>}
            <div className='commentary-section-display'>
                {selectedCommentary.commentarySections.map((section, index) => 
                <div 
                    className='commentary-section-icon' 
                    onClick={() => {
                        setSelectedSection({ data: section, index });
                        jumpToSelection(section.pageNumber, section.pageCoordinateTop);
                    }}>
                </div>)}
            </div>
            {selectedSection && 
            (selectedSection.index !== (selectedCommentary.commentarySections.length - 1)) &&
            <button 
                onClick={() => handleNavigateButton('next')}>
                ▶
            </button>}
        </div>
    );
};

export default CommentaryNavigator;