import { Request, Response } from 'express';

const unknownEndpoint = (_request: Request, response: Response): void => {
    response.status(404).json({ error: 'unknown endpoint' });
};

export default unknownEndpoint;