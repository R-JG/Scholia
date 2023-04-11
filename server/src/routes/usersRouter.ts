import { Router } from 'express';
import authenticateUser from '../middleware/authenticateUser';
import usersController from '../controllers/usersController';

const usersRouter = Router();

// usersRouter.get('/', usersController.getAll);

// usersRouter.get('/:id', usersController.getOne);

usersRouter.get('/search/:searchTerm', authenticateUser, usersController.getSomeByUsername);

usersRouter.post('/', usersController.createOne);

// usersRouter.delete('/:id', usersController.deleteOne);

export default usersRouter;