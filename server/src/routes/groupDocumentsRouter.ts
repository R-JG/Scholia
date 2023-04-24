import { Router } from 'express';
import upload from '../middleware/uploadFile';
import groupDocumentsController from '../controllers/groupDocumentsController';

const groupDocumentsRouter = Router();

groupDocumentsRouter.post('/', upload.single('file'), groupDocumentsController.createOne);

export default groupDocumentsRouter;