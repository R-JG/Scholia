import { Router } from 'express';
import groupsController from '../controllers/groupsController';

const groupsRouter = Router();

groupsRouter.get('/', groupsController.getGroupsForUser);

groupsRouter.get('/search/:searchTerm', groupsController.getGroupsByName);

groupsRouter.post('/', groupsController.createOne);

export default groupsRouter;