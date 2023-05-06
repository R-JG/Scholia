import { Commentary } from '../typeUtils/types';
import '../css/CommentaryNavigator.css';

interface Props {
    selectedCommentary: Commentary | null,
};

const CommentaryNavigator = ({ selectedCommentary }: Props) => {

    if (!selectedCommentary) return <div className='CommentaryNavigator'></div>;

    return (
        <div className='CommentaryNavigator'>
            <div className='commentary-section-display'>
                {selectedCommentary.commentarySections.body.map(_section => 
                <div className='commentary-section-icon'></div>)}
            </div>
        </div>
    );
};

export default CommentaryNavigator;