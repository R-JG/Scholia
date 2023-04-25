import { Request, Response, NextFunction } from 'express';
import { UserModel, NewGroupDocument, GroupDocumentInfo } from '../typeUtils/types';
import groupDocumentsService from '../database/services/groupDocumentsService';
import groupsService from '../database/services/groupsService';

const createOne = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void>  => {
    try {
        if (!request.file) {
            response.status(500).json({ error: 'error in processing file' });
            return;
        };
        const authenticatedUser: UserModel = response.locals.authenticatedUser;
        const groupId: string = request.params.groupId;
        const groupMemberIds: number[] = await groupsService.getAllMemberIds(groupId);
        const userIsMember: boolean = groupMemberIds.includes(authenticatedUser.id);
        if (!userIsMember) {
            response.status(403).json({ 
                error: 'user does not have sufficient membership to add a document to this group' 
            });
        };
        const newDocument: NewGroupDocument = {
            groupId,
            documentName: request.file.originalname,
            filePath: request.file.path
        };
        const addedDocument = await groupDocumentsService.createOne(newDocument);
        const addedDocumentInfo: GroupDocumentInfo = {
            id: addedDocument.id,
            groupId: addedDocument.groupId,
            documentName: addedDocument.documentName
        };
        response.json(addedDocumentInfo);
    } catch (error) {
        next(error);
    };
};

export default { createOne };