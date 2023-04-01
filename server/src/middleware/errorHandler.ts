import { Request, Response, NextFunction } from 'express';
import { logError } from '../serverUtils/logger';

const errorHandler = (
        error: any, _request: Request, response: Response, next: NextFunction
    ) : void=> {
    logError(error);
    response.status(400).json({ error: error.message });
    next(error);
};

export default errorHandler;