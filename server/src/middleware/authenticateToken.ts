import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../serverUtils/encryption';

const authenticateToken = (
        request: Request, response: Response, next: NextFunction
    ): void => {
    const authorization: string | undefined = request.get('authorization');
    if (!(authorization && authorization.startsWith('Bearer '))) {
        response.status(401).json({ error: 'authentication missing' });
        return;
    };
    try {
        const requestToken: string = authorization.replace('Bearer ', '');
        const decodedToken = verifyToken(requestToken);
        response.locals.decodedToken = decodedToken;
        next();
    } catch (error) {
        response.status(401).json({ error: 'authentication failed' });
    };
};

export default authenticateToken;