import { Request, Response, NextFunction } from 'express';
import { UserModel, GroupEntry, GroupModel } from '../typeUtils/types';
import { parseGroupEntry } from '../typeUtils/validation';
import groupsService from '../database/services/groupsService';

const createOne = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const authenticatedUser: UserModel = response.locals.authenticatedUser;
        const groupEntry: GroupEntry = parseGroupEntry(request.body);
        const createdGroup: GroupModel = await groupsService.createOne(
            groupEntry, authenticatedUser.id
        );
        response.json(createdGroup);
    } catch (error) {
        next(error);
    };
};

const getSomeByUser = async (
        _request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const authenticatedUser: UserModel = response.locals.authenticatedUser;
        const groups: GroupModel[] = await groupsService.getSomeByUser(authenticatedUser.id);
        response.json(groups);
    } catch (error) {
        next(error);
    };
};

export default { createOne, getSomeByUser }