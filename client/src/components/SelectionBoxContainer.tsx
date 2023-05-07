import { Commentary, CommentarySection, PageSelectionCoordinates } from '../typeUtils/types';
import '../css/SelectionBoxContainer.css';

interface Props {
    pageNumber: number,
    selectedCommentary: Commentary | null,
    coordinateSelectMode: boolean,
    pageForSelection: number | null,
    userIsSelecting: boolean,
    yPercentCoordinateOne: number | null,
    yPercentCoordinateTwo: number | null,
    yPixelCoordinateOne: number,
    yPixelCoordinateTwo: number,
    setSelectedSection: (section: { section: CommentarySection, index: number }) => void
};

const SelectionBoxContainer = ({ 
    pageNumber, 
    selectedCommentary, 
    coordinateSelectMode,
    pageForSelection, 
    userIsSelecting,
    yPercentCoordinateOne,
    yPercentCoordinateTwo,
    yPixelCoordinateOne,
    yPixelCoordinateTwo,
    setSelectedSection
    }: Props) => {

    const createBoxStyleForSelecting = (): object | undefined => {
        if (userIsSelecting) {
            return (yPixelCoordinateTwo === 0) ? { display: 'none' } : { 
                top: `${Math.min(yPixelCoordinateOne, yPixelCoordinateTwo)}px`,
                height: `${Math.abs(yPixelCoordinateOne - yPixelCoordinateTwo)}px`,
                borderColor: 'transparent'
            };
        } else if (yPercentCoordinateOne && yPercentCoordinateTwo) {
            return {
                top: `${Math.min(yPercentCoordinateOne, yPercentCoordinateTwo)}%`,
                height: `${Math.abs(yPercentCoordinateOne - yPercentCoordinateTwo)}%`,
            };
        } else return;
    };

    const createBoxStyleForCommentary = (coordinates: PageSelectionCoordinates): object => {
        return { 
            top: `${coordinates.yTop}%`, 
            height: `${coordinates.yBottom - coordinates.yTop}%` 
        };
    };

    const handleSelectionBoxClick = (section: CommentarySection, index: number): void => {
        setSelectedSection({ section, index });
    };

    return (
        <div className='SelectionBoxContainer'>
            {(coordinateSelectMode && (pageForSelection === pageNumber)) && 
            <div 
                className='selection-box--active-selection' 
                style={createBoxStyleForSelecting()}>
            </div>}
            {selectedCommentary && 
            selectedCommentary.commentarySections.body.map((section, index) =>
                (section.coordinates.pageNumber === pageNumber) ? 
                <div 
                    className='selection-box--commentary-section' 
                    data-coordinate-top={section.coordinates.yTop}
                    style={createBoxStyleForCommentary(section.coordinates)}
                    onClick={() => handleSelectionBoxClick(section, index)}>
                </div> : undefined
            )}
        </div>
    );
};

export default SelectionBoxContainer;