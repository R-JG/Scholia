import { 
    CommentaryModel, CommentaryInfo, CommentaryEntry, CommentarySectionEntry, CommentarySectionModel 
} from '../../typeUtils/types';
import Commentary from '../models/Commentary';
import CommentarySection from '../models/CommentarySection';

const commentaryInfoAttributes: string[] = ['id', 'userId', 'documentId', 'commentaryName'];

const verifyUserOwnsCommentary = async (
        userId: number, commentaryId: string | number
    ): Promise<boolean> => {
    const commentary: CommentaryModel | null = await Commentary.findByPk(commentaryId);
    return !(!commentary || (commentary.userId !== userId));
};

const getCommentaryInfoByUser = async (userId: string | number): Promise<CommentaryInfo[]> => {
    const commentaryInfo: CommentaryInfo[] = await Commentary.findAll({ 
        where: { userId }, 
        attributes: commentaryInfoAttributes 
    });
    return commentaryInfo;
};

const getCommentaryInfoByDocument = async (documentId: string | number): Promise<CommentaryInfo[]> => {
    const commentaryInfo: CommentaryInfo[] = await Commentary.findAll({ 
        where: { documentId }, 
        attributes: commentaryInfoAttributes 
    });
    return commentaryInfo;
};

const getCommentaryById = async (commentaryId: string | number): Promise<CommentaryModel | null> => {
    return await Commentary.findByPk(commentaryId, { 
        include: { 
            model: CommentarySection, 
            as: 'commentarySections',
            separate: true,
            order: [['pageNumber', 'ASC'], ['pageCoordinateTop', 'ASC']] 
        }
    });
};

const createCommentary = async (
        newCommentaryData: CommentaryEntry, userId: string | number
    ): Promise<CommentaryModel> => {
    return await Commentary.create({ ...newCommentaryData, userId });
};

const createCommentarySection = async (
        commentaryId:  string | number, newCommentarySection: CommentarySectionEntry
    ): Promise<CommentarySectionModel> => {
    return await CommentarySection.create({ ...newCommentarySection, commentaryId });
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
    verifyUserOwnsCommentary,
    getCommentaryInfoByUser, 
    getCommentaryInfoByDocument, 
    getCommentaryById, 
    createCommentary, 
    createCommentarySection, 
    updateCommentarySectionById
};