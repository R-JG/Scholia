import { Commentary, CommentarySection, SelectedSection } from '../typeUtils/types';
import '../css/SelectionBoxContainer.css';

interface Props {
    pageNumber: number,
    selectedCommentary: Commentary | null,
    selectedSection: SelectedSection | null,
    coordinateSelectMode: boolean,
    pageForSelection: number | null,
    userIsSelecting: boolean,
    yPercentCoordinateOne: number | null,
    yPercentCoordinateTwo: number | null,
    yPixelCoordinateOne: number | null,
    yPixelCoordinateTwo: number | null,
    editTextMode: boolean,
    setEditTextMode: (boolean: boolean) => void, 
    setSelectedSection: (section: SelectedSection) => void
};

const SelectionBoxContainer = ({ 
    pageNumber, 
    selectedCommentary, 
    selectedSection, 
    coordinateSelectMode,
    pageForSelection, 
    userIsSelecting,
    yPercentCoordinateOne,
    yPercentCoordinateTwo,
    yPixelCoordinateOne,
    yPixelCoordinateTwo, 
    editTextMode, 
    setEditTextMode, 
    setSelectedSection
    }: Props) => {

    const createBoxStyleForActiveSelection = (): object | undefined => {
        if (userIsSelecting) {
            const activeSelectionStyle = (!yPixelCoordinateOne || !yPixelCoordinateTwo) 
            ? { display: 'none' } 
            : { 
                top: `${Math.min(yPixelCoordinateOne, yPixelCoordinateTwo)}px`,
                height: `${Math.abs(yPixelCoordinateOne - yPixelCoordinateTwo)}px`,
                borderColor: 'transparent'
            };
            return activeSelectionStyle;
        } else if (yPercentCoordinateOne && yPercentCoordinateTwo) {
            const selectionResultStyle = {
                top: `${Math.min(yPercentCoordinateOne, yPercentCoordinateTwo)}%`,
                height: `${Math.abs(yPercentCoordinateOne - yPercentCoordinateTwo)}%`,
            };
            return selectionResultStyle;
        } else return;
    };

    const createBoxStyleForCommentarySection = (
            pageCoordinateTop: number, pageCoordinateBottom: number
        ): object => {
        return { 
            top: `${pageCoordinateTop}%`, 
            height: `${pageCoordinateBottom - pageCoordinateTop}%` 
        };
    };

    const handleSelectionBoxClick = (section: CommentarySection, index: number): void => {
        if (coordinateSelectMode) return;
        if (editTextMode) setEditTextMode(false);
        setSelectedSection({ data: section, index });
    };

    return (
        <div className='SelectionBoxContainer'>
            {(coordinateSelectMode && (pageForSelection === pageNumber)) && 
            <div 
                className='selection-box--active-selection' 
                style={createBoxStyleForActiveSelection()}>
            </div>}
            {selectedCommentary && 
            selectedCommentary.commentarySections.map((section, index) =>
            (section.pageNumber === pageNumber) ? 
            <div 
                key={section.id}
                className={`selection-box--commentary-section 
                    ${(selectedSection && (section.id === selectedSection.data.id))
                    ? 'selected' : 'unselected'}`} 
                data-coordinate-top={section.pageCoordinateTop}
                style={createBoxStyleForCommentarySection(
                    section.pageCoordinateTop, section.pageCoordinateBottom
                )}
                onClick={() => handleSelectionBoxClick(section, index)}>
            </div> : undefined)}
        </div>
    );
};

export default SelectionBoxContainer;