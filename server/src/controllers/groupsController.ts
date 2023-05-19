import { Request, Response, NextFunction } from 'express';
import { UserModel, GroupEntry, GroupModel } from '../typeUtils/types';
import { parseGroupEntry } from '../typeUtils/validation';
import groupsService from '../database/services/groupsService';

const getGroupsForUser = async (
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

const getGroupsByName = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void>  => {
    try {
        const searchTerm: string = request.params.searchTerm;
        const groups: GroupModel[] = await groupsService.getSomeByName(searchTerm);
        response.json(groups);
    } catch (error) {
        next(error);
    };
};

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

const joinGroupById = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const authenticatedUser: UserModel = response.locals.authenticatedUser;
        const groupId: string = request.params.groupId;
        const joinedGroup: GroupModel | null = await groupsService.addGroupMembership(
            authenticatedUser.id, groupId
        );
        if (!joinedGroup) {
            response.status(404).json({ error: 'group not found' });
            return;
        };
        response.json(joinedGroup);
    } catch (error) {
        next(error);
    };
};

export default { getGroupsForUser, getGroupsByName, createOne, joinGroupById }