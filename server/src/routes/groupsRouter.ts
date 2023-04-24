import { Router } from 'express';
import groupDocumentsRouter from './groupDocumentsRouter';
import groupsController from '../controllers/groupsController';

const groupsRouter = Router();

groupsRouter.post('/', groupsController.createOne);

groupsRouter.get('/', groupsController.getSomeByUser);

groupsRouter.post('/:groupId/documents', groupDocumentsRouter);

export default groupsRouter;