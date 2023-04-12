import { Request, Response, NextFunction } from 'express';
import { UserModel, GroupEntry, GroupModel } from '../typeUtils/types';
import { parseGroupEntry } from '../typeUtils/validation';
import groupService from '../database/services/groupService';

const createOne = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const authenticatedUser: UserModel = response.locals.authenticatedUser;
        const groupEntry: GroupEntry = parseGroupEntry(request.body);
        const createdGroup: GroupModel = await groupService.createOne(
            groupEntry, authenticatedUser.id
        );
        response.json({ groupName: createdGroup.groupName });
    } catch (error) {
        next(error);
    };
};

export default { createOne }