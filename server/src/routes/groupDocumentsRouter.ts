import { Router } from 'express';
import upload from '../middleware/uploadFile';
import groupDocumentsController from '../controllers/groupDocumentsController';

const groupDocumentsRouter = Router();

groupDocumentsRouter.post('/group/:groupId', upload.single('file'), groupDocumentsController.createOne);

groupDocumentsRouter.get('/group/:groupId', groupDocumentsController.getAllDocumentInfo);

groupDocumentsRouter.get('/:documentId', groupDocumentsController.getSingleDocumentInfo);

export default groupDocumentsRouter;