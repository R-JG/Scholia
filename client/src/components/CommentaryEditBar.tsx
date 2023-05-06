import { LoggedInUser, Commentary, PageSelectionCoordinates } from '../typeUtils/types';
import '../css/CommentaryEditBar.css';

interface Props {
    user: LoggedInUser | null,
    selectedCommentary: Commentary | null,
    coordinateSelectMode: boolean,
    pageForSelection: number | null,
    yPercentCoordinateOne: number | null,
    yPercentCoordinateTwo: number | null,
    setCoordinateSelectMode: (boolean: boolean) => void,
    resetPercentCoordinates: () => void,
    addSectionToSelectedCommentary: (coordinates: PageSelectionCoordinates, text: string) => void,
};

const CommentaryEditBar = ({ 
    user, 
    selectedCommentary, 
    coordinateSelectMode,
    pageForSelection,
    yPercentCoordinateOne,
    yPercentCoordinateTwo,
    setCoordinateSelectMode,
    resetPercentCoordinates,
    addSectionToSelectedCommentary 
    }: Props) => {

    if (!user || !selectedCommentary || (user.id !== selectedCommentary.userId)
    ) return <div className='CommentaryEditBar'></div>;

    const handleAddSectionButton = () => {
        if (!coordinateSelectMode) {
            setCoordinateSelectMode(true);
        } else {
            if (pageForSelection && yPercentCoordinateOne && yPercentCoordinateTwo) {
                const coordinates: PageSelectionCoordinates = {
                    pageNumber: pageForSelection,
                    yTop: Math.min(yPercentCoordinateOne, yPercentCoordinateTwo),
                    yBottom: Math.max(yPercentCoordinateOne, yPercentCoordinateTwo)
                };
                addSectionToSelectedCommentary(coordinates, '');
            };
            resetPercentCoordinates();
            setCoordinateSelectMode(false);
        };
    };

    return (
        <div className='CommentaryEditBar'>
            <button 
                className='add-commentary-section-button'
                onClick={handleAddSectionButton}>
                {(!coordinateSelectMode) ? 'Add New Section' : '+'}
            </button>
        </div>
    );
};

export default CommentaryEditBar;