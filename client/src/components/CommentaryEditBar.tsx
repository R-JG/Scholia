import { LoggedInUser, Commentary, CommentarySection, PageSelectionCoordinates } from '../typeUtils/types';
import '../css/CommentaryEditBar.css';

interface Props {
    user: LoggedInUser | null,
    selectedCommentary: Commentary | null,
    selectedSection: { data: CommentarySection, index: number } | null,
    coordinateSelectMode: boolean,
    pageForSelection: number | null,
    yPercentCoordinateOne: number | null,
    yPercentCoordinateTwo: number | null,
    editTextMode: boolean,
    setCoordinateSelectMode: (boolean: boolean) => void,
    resetPercentCoordinates: () => void,
    // setSelectedSection: (section: { data: CommentarySection, index: number }) => void,
    addSectionToSelectedCommentary: (coordinates: PageSelectionCoordinates) => void,
    setEditTextMode: (boolean: boolean) => void,
    updateSelectedSectionText: (updatedText: string) => void
};

const CommentaryEditBar = ({ 
    user, 
    selectedCommentary, 
    selectedSection,
    coordinateSelectMode,
    pageForSelection,
    yPercentCoordinateOne,
    yPercentCoordinateTwo,
    editTextMode,
    setCoordinateSelectMode,
    resetPercentCoordinates,
    // setSelectedSection,
    addSectionToSelectedCommentary,
    setEditTextMode,
    updateSelectedSectionText
    }: Props) => {

    if (!user || !selectedCommentary || (user.id !== selectedCommentary.userId)
    ) return <div className='CommentaryEditBar'></div>;

    const sectionTextHasBeenEdited: boolean = selectedSection ? (selectedSection.data.text !==
        selectedCommentary.commentarySections.body[selectedSection.index].text
    ) : false;

    const handleAddSectionButton = (): void => {
        if (!coordinateSelectMode) {
            setCoordinateSelectMode(true);
        } else {
            if (pageForSelection && yPercentCoordinateOne && yPercentCoordinateTwo) {
                const coordinates: PageSelectionCoordinates = {
                    pageNumber: pageForSelection,
                    top: Math.min(yPercentCoordinateOne, yPercentCoordinateTwo),
                    bottom: Math.max(yPercentCoordinateOne, yPercentCoordinateTwo)
                };
                addSectionToSelectedCommentary(coordinates);
            };
            resetPercentCoordinates();
            setCoordinateSelectMode(false);
        };
    };

    const handleDiscardSectionEditButton = (): void => {
        if (!selectedSection) return;
        if (sectionTextHasBeenEdited) updateSelectedSectionText(
            selectedCommentary.commentarySections.body[selectedSection.index].text
        );
        setEditTextMode(false);
    };

    return (
        <div className='CommentaryEditBar'>
            <button 
                className='add-commentary-section-button'
                onClick={handleAddSectionButton}>
                {(!coordinateSelectMode) ? 'Add New Section' : '+'}
            </button>
            {!editTextMode && 
            (selectedCommentary.commentarySections.body.length > 0) &&
            <button 
                className='edit-section-button'
                onClick={() => setEditTextMode(true)}>
                Edit Commentary Section
            </button>}
            {sectionTextHasBeenEdited &&
            <div>
                <button 
                    className='save-section-edit-button'>
                    Save Changes
                </button>
                <button 
                    className='discard-section-edit-button'
                    onClick={handleDiscardSectionEditButton}>
                    Discard Changes
                </button>
            </div>}
        </div>
    );
};

export default CommentaryEditBar;