import { Request, Response, NextFunction } from 'express';
import { UserEntry, NewUser, UserModel } from '../typeUtils/types';
import { parseUserEntry } from '../typeUtils/validation';
import { createPasswordHash } from '../serverUtils/encryption';
import userService from '../database/services/userService';

const getAll = async (
        _request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const allUsers: UserModel[] = await userService.getAll();
        response.json(allUsers);
    } catch (error) {
        next(error);
    };
};

const getOne = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const user: UserModel | null = await userService.getOneById(request.params.id);
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
        const createdUser: UserModel = await userService.createOne(newUser);
        response.json({ username: createdUser.username });
    } catch (error) {
        next(error);
    };
};

const deleteOne = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const deleteResult: number = await userService.deleteOne(request.params.id);
        response.json(deleteResult);
    } catch (error) {
        next(error);
    };
};

const getSomeByUsername = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const searchTerm: string = request.params.searchTerm;
        const searchResult = await userService.getSomeByUsername(searchTerm);
        response.json(searchResult);
    } catch (error) {
        next(error);
    };
};

export default { getAll, getOne, createOne, deleteOne, getSomeByUsername };