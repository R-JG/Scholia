import { 
    CommentaryModel, CommentaryInfo, CommentaryEntry, CommentarySectionEntry, CommentarySectionModel 
} from '../../typeUtils/types';
import Commentary from '../models/Commentary';
import CommentarySection from '../models/CommentarySection';

const getInfoByUser = async (userId: number): Promise<CommentaryInfo[]> => {
    const commentaryInfo: CommentaryInfo[] = await Commentary.findAll({ 
        where: { userId }, 
        attributes: ['id', 'userId', 'commentaryName'] 
    });
    return commentaryInfo;
};

const getCommentaryById = async (commentaryId: string | number): Promise<CommentaryModel | null> => {
    return await Commentary.findByPk(commentaryId);
};

const createCommentary = async (newCommentaryData: CommentaryEntry, userId: string | number) => {
    return await Commentary.create({ ...newCommentaryData, userId });
};

const createCommentarySection = async (
        newCommentarySection: CommentarySectionEntry
    ): Promise<CommentarySectionModel> => {
    return await CommentarySection.create(newCommentarySection);
};

const updateCommentarySectionById = async (
        sectionId: string | number, sectionUpdateData: CommentarySectionEntry
    ): Promise<CommentarySectionModel> => {
    const [_numAffected, updatedRows] = await CommentarySection.update(
        sectionUpdateData, 
        { where: { id: sectionId }, returning: true }
    );
    return updatedRows[0];
};

export default { 
    getInfoByUser, 
    getCommentaryById, 
    createCommentary, 
    createCommentarySection, 
    updateCommentarySectionById
};