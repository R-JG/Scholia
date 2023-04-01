import express from 'express';
import requestLogger from './middleware/requestLogger';
import unknownEndpoint from './middleware/unknownEndpoint';

const app = express();

app.use(express.json());
app.use(requestLogger);



app.use(unknownEndpoint);

export default app;