import { Request, Response, NextFunction } from 'express';
import { UserEntry, NewUser, UserModel } from '../typeUtils/types';
import { parseUserEntry } from '../typeUtils/validation';
import { createPasswordHash } from '../serverUtils/encryption';
import usersService from '../database/services/usersService';

/*
const getAll = async (
        _request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const allUsers: UserModel[] = await usersService.getAll();
        response.json(allUsers);
    } catch (error) {
        next(error);
    };
};

const getOne = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const user: UserModel | null = await usersService.getOneById(request.params.id);
        response.json(user);
    } catch (error) {
        next(error);
    };
};
*/

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

/*
const deleteOne = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const deleteResult: number = await usersService.deleteOne(request.params.id);
        response.json(deleteResult);
    } catch (error) {
        next(error);
    };
};
*/

const getSomeByUsername = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const searchTerm: string = request.params.searchTerm;
        const searchResult: UserModel[] = await usersService.getSomeByUsername(searchTerm);
        response.json(searchResult.map(user => ({ username: user.username })));
    } catch (error) {
        next(error);
    };
};

export default { createOne, getSomeByUsername };