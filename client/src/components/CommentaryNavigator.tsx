import { Commentary, CommentarySection, PageSelectionCoordinates } from '../typeUtils/types';
import '../css/CommentaryNavigator.css';

interface Props {
    selectedCommentary: Commentary | null,
    setSelectedSection: (section: CommentarySection) => void,
    jumpToSelection: (coordinates: PageSelectionCoordinates) => void
};

const CommentaryNavigator = ({ selectedCommentary, setSelectedSection, jumpToSelection }: Props) => {

    if (!selectedCommentary) return <div className='CommentaryNavigator'></div>;

    return (
        <div className='CommentaryNavigator'>
            <div className='commentary-section-display'>
                {selectedCommentary.commentarySections.body.map(section => 
                <div 
                    className='commentary-section-icon' 
                    onClick={() => {
                        setSelectedSection(section);
                        jumpToSelection(section.coordinates);
                    }}>
                </div>)}
            </div>
        </div>
    );
};

export default CommentaryNavigator;