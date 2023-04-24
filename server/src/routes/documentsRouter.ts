import { Router } from 'express';
import upload from '../middleware/uploadFile';
import documentsController from '../controllers/documentsController';

const documentsRouter = Router();

documentsRouter.post('/', upload.single('file'), documentsController.createOne);

export default documentsRouter;