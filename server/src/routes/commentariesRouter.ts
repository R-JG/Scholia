import { Router } from 'express';
import commentariesController from '../controllers/commentariesController';

const commentariesRouter = Router();

commentariesRouter.get('/info', commentariesController.getAllCommentaryInfoByUser);

commentariesRouter.get('/:commentaryId', commentariesController.getCommentaryById);

commentariesRouter.post('/', commentariesController.createCommentary);

commentariesRouter.post('/sections', commentariesController.createCommentarySection);

commentariesRouter.put('/sections/:sectionId', commentariesController.updateCommentarySectionById);

export default commentariesRouter;