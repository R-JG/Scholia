import express from 'express';
import associateModels from './database/models/associateModels';
import requestLogger from './middleware/requestLogger';
import unknownEndpoint from './middleware/unknownEndpoint';
import errorHandler from './middleware/errorHandler';
import authenticateUser from './middleware/authenticateUser';
import servePDFWorker from './middleware/servePDFWorker';
import usersRouter from './routes/usersRouter';
import loginRouter from './routes/loginRouter';
import groupsRouter from './routes/groupsRouter';
import groupDocumentsRouter from './routes/groupDocumentsRouter';
import commentariesRouter from './routes/commentariesRouter';

associateModels();

const app = express();

app.use(express.static('./build/client/dist'));
app.use(express.json());
app.use(requestLogger);

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/groups', authenticateUser, groupsRouter);
app.use('/api/v1/documents', authenticateUser, groupDocumentsRouter);
app.use('/api/v1/commentaries', authenticateUser, commentariesRouter);

app.get('/pdf.worker.js', servePDFWorker);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;