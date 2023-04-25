import { Request, Response, NextFunction } from 'express';
import { Token, UserModel } from '../typeUtils/types';
import { parseToken } from '../typeUtils/validation';
import { verifyToken } from '../serverUtils/encryption';
import usersService from '../database/services/usersService';

const authenticateUser = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    const authorization: string | undefined = request.get('authorization');
    if (!(authorization && authorization.startsWith('Bearer '))) {
        response.status(401).json({ error: 'authentication missing' });
        return;
    };
    try {
        const requestToken: string = authorization.replace('Bearer ', '');
        const decodedToken: Token = parseToken(verifyToken(requestToken));
        const authenticatedUser: UserModel | null = await usersService.getOneByUsername(
            decodedToken.username
        );
        if (!authenticatedUser) {
            response.status(401).json({ error: 'authentication failed' });
            return;
        };
        response.locals.authenticatedUser = authenticatedUser;
        next();
    } catch (error) {
        response.status(401).json({ error: 'authentication failed' });
    };
};

export default authenticateUser;