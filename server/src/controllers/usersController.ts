import { Request, Response, NextFunction } from 'express';
import { UserEntry, NewUser } from '../typeUtils/types';
import { parseUserEntry } from '../typeUtils/validation';
import { createPasswordHash } from '../serverUtils/encryption';
import userService from '../database/services/userService';

const getAll = async (
        _request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const allUsers = await userService.getAll();
        response.json(allUsers);
    } catch (error) {
        next(error);
    };
};

const getOne = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const user = await userService.getOne(request.params.id);
        response.json(user);
    } catch (error) {
        next(error);
    };
};

const createOne = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const newUserEntry: UserEntry = parseUserEntry(request.body);
        const passwordHash: string = await createPasswordHash(newUserEntry.password);
        const newUser: NewUser = {
            username: newUserEntry.username,
            passwordHash
        };
        const createdUser = await userService.createOne(newUser);
        response.json(createdUser);
    } catch (error) {
        next(error);
    };
};

export default { getAll, getOne, createOne };