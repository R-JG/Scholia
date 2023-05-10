import { Request, Response, NextFunction } from 'express';
import { 
    UserModel, CommentaryInfo, CommentaryModel, CommentaryEntry, CommentarySectionEntry, CommentarySectionModel 
} from '../typeUtils/types';
import { parseCommentaryEntry, parseCommentarySectionEntry } from '../typeUtils/validation';
import commentariesService from '../database/services/commentariesService';

const getAllCommentaryInfoByUser = async (
        _request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const authenticatedUser: UserModel = response.locals.authenticatedUser;
        const commentaryInfo: CommentaryInfo[] = await commentariesService
        .getCommentaryInfoByUser(authenticatedUser.id);
        response.json(commentaryInfo);
    } catch (error) {
        next(error);
    };
};

const getCommentaryById = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const commentaryId: string = request.params.commentaryId;
        const commentary: CommentaryModel | null = await commentariesService
        .getCommentaryById(commentaryId);
        if (!commentary) {
            response.status(404).json({ error: 'commentary not found' });
            return;
        };
        response.json(commentary);
    } catch (error) {
        next(error);
    };
};

const createCommentary = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const authenticatedUser: UserModel = response.locals.authenticatedUser;
        const newCommentaryData: CommentaryEntry = parseCommentaryEntry(request.body);
        const createdCommentary: CommentaryModel = await commentariesService
        .createCommentary(newCommentaryData, authenticatedUser.id);
        response.json({ ...createdCommentary, commentarySections: [] });
    } catch (error) {
        next(error);
    };
};

const createCommentarySection = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const authenticatedUser: UserModel = response.locals.authenticatedUser;
        const commentaryId: string = request.params.commentaryId;
        const userOwnsCommentary: boolean = await commentariesService
        .verifyUserOwnsCommentary(authenticatedUser.id, commentaryId);
        if (!userOwnsCommentary) {
            response.status(403).json({ error: 'user does not have write access to this commentary' });
            return;
        };
        const newCommentarySection: CommentarySectionEntry = parseCommentarySectionEntry(request.body);
        const createdCommentarySection: CommentarySectionModel = await commentariesService
        .createCommentarySection(commentaryId, newCommentarySection);
        response.json(createdCommentarySection);
    } catch (error) {
        next(error);
    };
};

const updateCommentarySectionById = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const authenticatedUser: UserModel = response.locals.authenticatedUser;
        const commentaryId: string = request.params.commentaryId;
        const userOwnsCommentary: boolean = await commentariesService
        .verifyUserOwnsCommentary(authenticatedUser.id, commentaryId);
        if (!userOwnsCommentary) {
            response.status(403).json({ error: 'user does not have write access to this commentary' });
            return;
        };
        const sectionId: string = request.params.sectionId;
        const sectionUpdateData: CommentarySectionEntry = parseCommentarySectionEntry(request.body);
        const updatedSection: CommentarySectionModel = await commentariesService
        .updateCommentarySectionById(sectionId, sectionUpdateData);
        response.json(updatedSection);
    } catch (error) {
        next(error);
    };
};

export default { 
    getAllCommentaryInfoByUser, 
    getCommentaryById, 
    createCommentary, 
    createCommentarySection, 
    updateCommentarySectionById
};