import { Request, Response, NextFunction } from 'express';
import { UserEntry, UserModel } from '../typeUtils/types';
import { parseUserEntry } from '../typeUtils/validation';
import { comparePasswordHash, createToken } from '../serverUtils/encryption';
import userService from '../database/services/usersService';

const login = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const userEntry: UserEntry = parseUserEntry(request.body);
        const userInDb: UserModel | null = await userService.getOneByUsername(userEntry.username);
        if (!userInDb) {
            response.status(401).json({ error: 'username not found' });
            return;
        };
        const passwordMatches: boolean = await comparePasswordHash(
            userEntry.password, userInDb.passwordHash
        );
        if (!passwordMatches) {
            response.status(401).json({ error: 'incorrect password' });
            return;
        };
        const token: string = createToken({ username: userInDb.username });
        response.json({ token, username: userInDb.username });
    } catch (error) {
        next(error);
    };
};

const checkTokenValidity = async (
        _request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        if (!response.locals.authenticatedUser) {
            response.json({ error: 'user authentication unsuccessful' });
            return;
        };
        response.send('valid');
    } catch (error) {
        next(error);
    };
};

export default { login, checkTokenValidity };