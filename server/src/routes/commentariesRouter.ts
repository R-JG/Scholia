import { Router } from 'express';
import commentariesController from '../controllers/commentariesController';

const commentariesRouter = Router();

commentariesRouter.get('/info', commentariesController.getAllCommentaryInfoByUser);

commentariesRouter.get('/info/document/:documentId', commentariesController.getAllCommentaryInfoByDocument);

commentariesRouter.get('/:commentaryId', commentariesController.getCommentaryById);

commentariesRouter.post('/', commentariesController.createCommentary);

commentariesRouter.post('/:commentaryId/sections', commentariesController.createCommentarySection);

commentariesRouter.put('/:commentaryId/sections/:sectionId', commentariesController.updateCommentarySectionById);

export default commentariesRouter;