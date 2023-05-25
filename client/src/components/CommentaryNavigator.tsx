import { LoggedInUser, Commentary, CommentarySection, SelectedSection, NavDirection } from '../typeUtils/types';
import '../css/CommentaryNavigator.css';

interface Props {
    user: LoggedInUser | null, 
    selectedCommentary: Commentary | null,
    selectedSection: SelectedSection | null,
    coordinateSelectMode: boolean,
    setSelectedSection: (section: SelectedSection) => void,
    jumpToSelection: (pageNumber: number, pageCoordinateTop: number) => void
};

const CommentaryNavigator = ({ 
    user, 
    selectedCommentary, 
    selectedSection, 
    coordinateSelectMode, 
    setSelectedSection, 
    jumpToSelection 
    }: Props) => {

    if (!user || !selectedCommentary) return <div className='CommentaryNavigator inactive'></div>;

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

    const handleSectionIconClick = (section: CommentarySection, index: number): void => {
        if (coordinateSelectMode) return;
        setSelectedSection({ data: section, index });
        jumpToSelection(section.pageNumber, section.pageCoordinateTop);
    };

    return (
        <div className='CommentaryNavigator'>
            <div className='CommentaryNavigator--button-container--previous'>
                {(selectedSection && (selectedSection.index !== 0)) 
                ? <button 
                    className='CommentaryNavigator--navigate-button'
                    onClick={() => handleNavigateButton('previous')}>
                    ◀
                </button>
                : <div className='CommentaryNavigator--navigate-button-placeholder'></div>}
            </div>
            <div className='CommentaryNavigator--commentary-section-display'>
                {selectedCommentary.commentarySections.map((section, index) => 
                <div 
                    className={`CommentaryNavigator--commentary-section-icon 
                    ${(section.id === selectedSection?.data.id) 
                        ? 'selected' : 'unselected'}`}
                    onClick={() => handleSectionIconClick(section, index)}>
                </div>)}
            </div>
            <div className='CommentaryNavigator--button-container--next'>
                {(selectedSection && 
                (selectedSection.index !== (selectedCommentary.commentarySections.length - 1))) 
                ? <button 
                    className='CommentaryNavigator--navigate-button'
                    onClick={() => handleNavigateButton('next')}>
                    ▶
                </button> 
                : <div className='CommentaryNavigator--navigate-button-placeholder'></div>}
            </div>
            {(selectedCommentary.commentarySections.length === 0) && 
            <h4 className='CommentaryNavigator--empty-commentary-message'>
                {(user.id === selectedCommentary.userId) 
                ? 'Add a new section to get started' : 'This commentary is empty'}
            </h4>}
        </div>
    );
};

export default CommentaryNavigator;