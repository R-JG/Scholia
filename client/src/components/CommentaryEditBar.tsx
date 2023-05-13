import { useState, useEffect } from 'react';
import { LoggedInUser, Commentary, CommentarySection, SelectedSection } from '../typeUtils/types';
import '../css/CommentaryEditBar.css';

interface Props {
    user: LoggedInUser | null,
    selectedCommentary: Commentary | null,
    selectedSection: SelectedSection | null,
    coordinateSelectMode: boolean,
    pageForSelection: number | null,
    yPercentCoordinateOne: number | null,
    yPercentCoordinateTwo: number | null,
    editTextMode: boolean,
    setCoordinateSelectMode: (boolean: boolean) => void,
    resetPercentCoordinates: () => void,
    addSectionToSelectedCommentary: (
        commentaryId: number, 
        pageNumber: number, 
        pageCoordinateTop: number, 
        pageCoordinateBottom: number
    ) => void,
    setEditTextMode: (boolean: boolean) => void,
    updateSelectedSectionText: (updatedText: string) => void,
    saveSectionTextToCommentary: (commentarySection: CommentarySection) => void
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
    addSectionToSelectedCommentary,
    setEditTextMode,
    updateSelectedSectionText,
    saveSectionTextToCommentary
    }: Props) => {

    if (!user || !selectedCommentary || (user.id !== selectedCommentary.userId)
    ) return <div className='CommentaryEditBar'></div>;

    const [sectionTextHasBeenEdited, setSectionTextHasBeenEdited] = useState<boolean>(false);

    useEffect(() => {
        if (!selectedSection) return;
        const sectionInCommentary: CommentarySection | undefined = selectedCommentary.commentarySections
        .find(section => section.id === selectedSection.data.id);
        if (!sectionInCommentary) return;
        if (sectionInCommentary.text !== selectedSection.data.text) {
            setSectionTextHasBeenEdited(true)
        } else setSectionTextHasBeenEdited(false);
    }, [selectedSection]);

    const handleAddSectionButton = (): void => {
        if (!coordinateSelectMode) {
            setCoordinateSelectMode(true);
        } else {
            if (pageForSelection && yPercentCoordinateOne && yPercentCoordinateTwo) {
                const pageNumber: number = pageForSelection;
                const pageCoordinateTop: number = Math.min(
                    yPercentCoordinateOne, yPercentCoordinateTwo
                );
                const pageCoordinateBottom: number = Math.max(
                    yPercentCoordinateOne, yPercentCoordinateTwo
                );
                addSectionToSelectedCommentary(
                    selectedCommentary.id, pageNumber, pageCoordinateTop, pageCoordinateBottom
                );
            };
            resetPercentCoordinates();
            setCoordinateSelectMode(false);
        };
    };

    const handleSaveSectionEditButton = () => {
        if (!selectedSection) return;
        if (sectionTextHasBeenEdited) saveSectionTextToCommentary(selectedSection.data);
    };

    const handleDiscardSectionEditButton = (): void => {
        if (!selectedSection) return;
        if (sectionTextHasBeenEdited) updateSelectedSectionText(
            selectedCommentary.commentarySections[selectedSection.index].text
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
            (selectedCommentary.commentarySections.length > 0) &&
            <button 
                className='edit-section-button'
                onClick={() => setEditTextMode(true)}>
                Edit Commentary Section
            </button>}
            {sectionTextHasBeenEdited &&
            <div>
                <button 
                    className='save-section-edit-button'
                    onClick={handleSaveSectionEditButton}>
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