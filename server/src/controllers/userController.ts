import { Request, Response, NextFunction } from 'express';
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

const getOne = async (): Promise<void> => {};

const createOne = async (): Promise<void> => {};

export default { getAll, getOne, createOne };