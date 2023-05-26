import { Request, Response, NextFunction } from 'express';
import { UserEntry, NewUser, UserModel } from '../typeUtils/types';
import { parseUserEntry } from '../typeUtils/validation';
import { createPasswordHash } from '../serverUtils/encryption';
import usersService from '../database/services/usersService';

const getAllWhereUsernameMatches = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const searchTerm: string = request.params.searchTerm;
        const searchResult: UserModel[] = await usersService.getAllWhereUsernameMatches(searchTerm);
        response.json(searchResult.map(user => ({ username: user.username })));
    } catch (error) {
        next(error);
    };
};

const verifyIfUserExists = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const username: string = request.params.username;
        const user: UserModel | null = await usersService.getOneByUsername(username);
        if (user) response.json(true);
        if (!user) response.json(false);
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
        const createdUser: UserModel = await usersService.createOne(newUser);
        response.json({ username: createdUser.username });
    } catch (error) {
        next(error);
    };
};

export default { getAllWhereUsernameMatches, verifyIfUserExists, createOne };