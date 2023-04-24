import { Request, Response, NextFunction } from 'express';

const createOne = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void>  => {
    try {
        console.log(request.file);
        response.json({ id: 1, groupId: 1, name: 'test' } );
    } catch (error) {
        next(error);
    };
};

export default { createOne };