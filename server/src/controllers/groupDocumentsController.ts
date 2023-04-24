import { Request, Response, NextFunction } from 'express';

const createOne = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void>  => {
    try {
        // const groupId: string = request.params.groupId;
        if (request.file) {

        };
        response.json({ id: 1, groupId: 1, name: 'test' } );
    } catch (error) {
        next(error);
    };
};

export default { createOne };