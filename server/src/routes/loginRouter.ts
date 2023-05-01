import { Router } from 'express';
import loginController from '../controllers/loginController';
import authenticateUser from '../middleware/authenticateUser';

const loginRouter = Router();

loginRouter.post('/', loginController.login);

loginRouter.get('/', authenticateUser, loginController.checkTokenValidity);

export default loginRouter;