import { Request, Response, NextFunction } from 'express';
import { PDF_WORKER_FILE_PATH } from '../serverUtils/config';

const servePDFWorker = (
        _request: Request, response: Response, next: NextFunction
    ): void => {
    try {
        response.setHeader('Content-Type', 'application/javascript');
        response.sendFile(PDF_WORKER_FILE_PATH);
    } catch (error) {
        next(error);
    };
};

export default servePDFWorker;