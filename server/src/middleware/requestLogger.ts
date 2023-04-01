import { Request, Response, NextFunction } from 'express';
import { logInfo } from '../serverUtils/logger';

const requestLogger = (
    request: Request, _response: Response, next: NextFunction
): void => {
logInfo('------- Request -------');
logInfo('Method: ', request.method);
logInfo('Path: ', request.path);
logInfo('Body: ', request.body);
logInfo('-----------------------');
next();
};

export default requestLogger;