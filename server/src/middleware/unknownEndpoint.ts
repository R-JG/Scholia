import { Request, Response } from 'express';

const unknownEndpoint = (_request: Request, response: Response): void => {
    response.redirect('/');
};

export default unknownEndpoint;