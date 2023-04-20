import { Router } from 'express';
import groupsController from '../controllers/groupsController';

const groupsRouter = Router();

groupsRouter.post('/', groupsController.createOne);

groupsRouter.get('/', groupsController.getSomeByUser);

export default groupsRouter;