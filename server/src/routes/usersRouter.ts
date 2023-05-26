import { Router } from 'express';
import authenticateUser from '../middleware/authenticateUser';
import usersController from '../controllers/usersController';

const usersRouter = Router();

usersRouter.get('/search/:searchTerm', authenticateUser, usersController.getAllWhereUsernameMatches);

usersRouter.get('/verify/:username', usersController.verifyIfUserExists);

usersRouter.post('/', usersController.createOne);

export default usersRouter;