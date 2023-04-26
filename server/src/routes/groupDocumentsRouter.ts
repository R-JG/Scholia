import { Router } from 'express';
import upload from '../middleware/uploadFile';
import groupDocumentsController from '../controllers/groupDocumentsController';

const groupDocumentsRouter = Router();

groupDocumentsRouter.post('/groups/:groupId', upload.single('file'), groupDocumentsController.createOne);

groupDocumentsRouter.get('/groups', groupDocumentsController.getAllDocumentInfoByGroup);

groupDocumentsRouter.get('/:documentId', groupDocumentsController.getSingleDocumentInfo);

export default groupDocumentsRouter;