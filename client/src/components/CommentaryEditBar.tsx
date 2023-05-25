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
    setSelectedSection: (section: SelectedSection | null) => void,
    setCoordinateSelectMode: (boolean: boolean) => void,
    resetSelectionCoordinates: () => void,
    addSectionToSelectedCommentary: (
        commentaryId: number, 
        pageNumber: number, 
        pageCoordinateTop: number, 
        pageCoordinateBottom: number
    ) => Promise<boolean>,
    deleteSelectedCommentarySection: () => void, 
    setEditTextMode: (boolean: boolean) => void,
    saveSectionTextToCommentary: (commentarySection: CommentarySection) => void, 
    cancelSectionTextEdit: () => void
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
    setSelectedSection, 
    setCoordinateSelectMode,
    resetSelectionCoordinates,
    addSectionToSelectedCommentary,
    deleteSelectedCommentarySection, 
    setEditTextMode,
    saveSectionTextToCommentary, 
    cancelSectionTextEdit
    }: Props) => {

    if (!user || !selectedCommentary || (user.id !== selectedCommentary.userId)
    ) return <div className='CommentaryEditBar inactive'></div>;

    const [sectionTextHasBeenEdited, setSectionTextHasBeenEdited] = useState<boolean>(false);

    useEffect(() => {
        if (!selectedSection) return;
        const sectionInCommentary: CommentarySection | undefined = selectedCommentary.commentarySections
        .find(section => section.id === selectedSection.data.id);
        if (!sectionInCommentary) return;
        if (sectionInCommentary.text !== selectedSection.data.text) {
            setSectionTextHasBeenEdited(true)
        } else setSectionTextHasBeenEdited(false);
    }, [selectedCommentary, selectedSection]);

    const handleAddNewSectionButton = (): void => {
        setSelectedSection(null);
        setCoordinateSelectMode(true);
    };

    const handleSaveNewSectionButton = (): void => {
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
            ).then(sectionHasBeenAdded => {
                if (!sectionHasBeenAdded) return;
                resetSelectionCoordinates();
                setCoordinateSelectMode(false);
                setEditTextMode(true);
            });
        };
    };

    const handleDiscardNewSectionButton = (): void => {
        resetSelectionCoordinates();
        setCoordinateSelectMode(false);
    };

    const handleSaveSectionEditButton = (): void => {
        if (!selectedSection) return;
        if (sectionTextHasBeenEdited) saveSectionTextToCommentary(selectedSection.data);
        setEditTextMode(false);
    };

    const handleDiscardSectionEditButton = (): void => {
        cancelSectionTextEdit();
    };

    const handleDeleteSectionButton = (): void => {
        if (!selectedCommentary || !selectedSection) return;
        deleteSelectedCommentarySection();
        setEditTextMode(false);
    };

    return (
        <div className='CommentaryEditBar'>
            <div className='CommentaryEditBar--add-new-section-container'>
                {!coordinateSelectMode && !editTextMode &&
                <button 
                    className='CommentaryEditBar--add-new-section-button'
                    onClick={handleAddNewSectionButton}>
                    Add New Section
                </button>}
                {coordinateSelectMode && 
                <div>
                    <p className='CommentaryEditBar--coordinate-select-message'>
                        Click and drag to make a selection
                    </p>
                    {yPercentCoordinateOne && yPercentCoordinateTwo &&
                    <button 
                        className='CommentaryEditBar--save-new-section-button'
                        onClick={handleSaveNewSectionButton}>
                        Add
                    </button>}
                    <button
                        className='CommentaryEditBar--discard-new-section-button'
                        onClick={handleDiscardNewSectionButton}>
                        Cancel
                    </button>
                </div>}
            </div>
            <div className='CommentaryEditBar--edit-section-container'>
                {(selectedCommentary.commentarySections.length > 0) 
                && selectedSection && !sectionTextHasBeenEdited &&
                <button 
                    className='CommentaryEditBar--edit-section-button'
                    onClick={() => setEditTextMode(!editTextMode)}>
                    {!editTextMode ? 'Edit Commentary Section' : 'Cancel Edit'}
                </button>}
                {editTextMode && sectionTextHasBeenEdited &&
                <div>
                    <button 
                        className='CommentaryEditBar--save-edited-section-button'
                        onClick={handleSaveSectionEditButton}>
                        Save Changes
                    </button>
                    <button 
                        className='CommentaryEditBar--discard-edited-section-button'
                        onClick={handleDiscardSectionEditButton}>
                        Discard Changes
                    </button>
                </div>}
                {editTextMode && 
                <button
                    className='CommentaryEditBar--delete-section-button'
                    onClick={handleDeleteSectionButton}>
                    Delete Section
                </button>}
            </div>
        </div>
    );
};

export default CommentaryEditBar;