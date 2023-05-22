import { 
    CommentaryModel, CommentaryInfo, CommentaryEntry, CommentarySectionEntry, CommentarySectionModel 
} from '../../typeUtils/types';
import Commentary from '../models/Commentary';
import CommentarySection from '../models/CommentarySection';
import User from '../models/User';

const commentaryInfoAttributes: string[] = ['id', 'userId', 'documentId', 'commentaryName'];
const commentaryInfoAuthorAssociation: object = { model: User, attributes: [['username', 'author']] };
const getCommentaryInfoFromQuery = (queryResult: CommentaryModel[]): CommentaryInfo[] => {
    return queryResult.map(instance => ({ 
        id: instance.id, 
        userId: instance.userId, 
        documentId: instance.documentId, 
        commentaryName: instance.commentaryName, 
        author: instance.dataValues.User.dataValues.author
    }));
};

const verifyUserOwnsCommentary = async (
        userId: number, commentaryId: string | number
    ): Promise<boolean> => {
    const commentary: CommentaryModel | null = await Commentary.findByPk(commentaryId);
    return !(!commentary || (commentary.userId !== userId));
};

const getCommentaryInfoByUser = async (userId: string | number): Promise<CommentaryInfo[]> => {
    const commentaryData = await Commentary.findAll({ 
        where: { userId }, 
        attributes: commentaryInfoAttributes, 
        include: commentaryInfoAuthorAssociation 
    });
    const commentaryInfo: CommentaryInfo[] = getCommentaryInfoFromQuery(commentaryData);
    return commentaryInfo;
};

const getCommentaryInfoByDocument = async (documentId: string | number): Promise<CommentaryInfo[]> => {
    const commentaryData = await Commentary.findAll({ 
        where: { documentId }, 
        attributes: commentaryInfoAttributes, 
        include: commentaryInfoAuthorAssociation
    });
    const commentaryInfo: CommentaryInfo[] = getCommentaryInfoFromQuery(commentaryData);
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

const deleteCommentarySectionById = async (sectionId: string | number): Promise<number> => {
    const deleteResult = await CommentarySection.destroy({ where: { id: sectionId } });
    return deleteResult;
};

export default { 
    verifyUserOwnsCommentary,
    getCommentaryInfoByUser, 
    getCommentaryInfoByDocument, 
    getCommentaryById, 
    createCommentary, 
    createCommentarySection, 
    updateCommentarySectionById, 
    deleteCommentarySectionById
};