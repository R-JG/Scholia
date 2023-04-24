import express from 'express';
import requestLogger from './middleware/requestLogger';
import unknownEndpoint from './middleware/unknownEndpoint';
import errorHandler from './middleware/errorHandler';
import authenticateUser from './middleware/authenticateUser';
import usersRouter from './routes/usersRouter';
import loginRouter from './routes/loginRouter';
import groupsRouter from './routes/groupsRouter';

const app = express();

app.use(express.static('./build/client/dist'));
app.use(express.json());
app.use(requestLogger);

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/groups', authenticateUser, groupsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;