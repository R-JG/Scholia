import { Router } from 'express';
import commentariesController from '../controllers/commentariesController';

const commentariesRouter = Router();

commentariesRouter.get('/info', commentariesController.getAllCommentaryInfoByUser);

commentariesRouter.get('/info/documents', commentariesController.getAllCommentaryInfoForDocuments);

commentariesRouter.get('/:commentaryId', commentariesController.getCommentaryById);

commentariesRouter.post('/', commentariesController.createCommentary);

commentariesRouter.post('/:commentaryId/sections', commentariesController.createCommentarySection);

commentariesRouter.put('/:commentaryId/sections/:sectionId', commentariesController.updateCommentarySectionById);

commentariesRouter.delete('/:commentaryId/sections/:sectionId', commentariesController.deleteCommentarySectionById);

export default commentariesRouter;