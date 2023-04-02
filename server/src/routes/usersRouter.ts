import { Router } from 'express';
import usersController from '../controllers/usersController';

const usersRouter = Router();

usersRouter.get('/', usersController.getAll);

usersRouter.get('/:id', usersController.getOne);

usersRouter.post('/', usersController.createOne);

export default usersRouter;