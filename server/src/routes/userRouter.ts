import { Router } from 'express';
import userController from '../controllers/userController';

const userRouter = Router();

userRouter.get('/', userController.getAll);

userRouter.get('/:id', userController.getOne);

userRouter.post('/', userController.createOne);

export default userRouter;