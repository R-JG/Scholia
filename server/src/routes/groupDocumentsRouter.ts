import { Router } from 'express';
import upload from '../middleware/uploadFile';
import groupDocumentsController from '../controllers/groupDocumentsController';

const groupDocumentsRouter = Router();

groupDocumentsRouter.post('/groups/:groupId', upload.single('file'), groupDocumentsController.createOne);

groupDocumentsRouter.get('/info/groups', groupDocumentsController.getAllDocumentInfoByGroup);

groupDocumentsRouter.get('/info/:documentId', groupDocumentsController.getSingleDocumentInfo);

groupDocumentsRouter.get('/:documentId/file', groupDocumentsController.getSingleDocumentFile);

groupDocumentsRouter.get('/:documentId/thumbnail', groupDocumentsController.getSingleDocumentThumbnail);

export default groupDocumentsRouter;