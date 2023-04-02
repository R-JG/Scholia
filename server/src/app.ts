import express from 'express';
import requestLogger from './middleware/requestLogger';
import unknownEndpoint from './middleware/unknownEndpoint';
import errorHandler from './middleware/errorHandler';
import usersRouter from './routes/usersRouter';

const app = express();

app.use(express.json());
app.use(requestLogger);

app.use('/api/v1/users', usersRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;