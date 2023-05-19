import { Router } from 'express';
import groupsController from '../controllers/groupsController';

const groupsRouter = Router();

groupsRouter.get('/', groupsController.getGroupsForUser);

groupsRouter.get('/search/:searchTerm', groupsController.getGroupsByName);

groupsRouter.post('/', groupsController.createOne);

groupsRouter.post('/join/:groupId', groupsController.joinGroupById);

export default groupsRouter;