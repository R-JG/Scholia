/*
import { Request, Response, NextFunction } from 'express';
import { GroupEntry } from '../typeUtils/types';
import { parseGroupEntry } from '../typeUtils/validation';

const createOne = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    
    try {
        const groupEntry: GroupEntry = parseGroupEntry(request.body);
    } catch (error) {
        next(error);
    };
};

export default { createOne }
*/