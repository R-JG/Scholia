import app from './app';
import { PORT } from './serverUtils/config';
import { logInfo } from './serverUtils/logger';

app.listen(PORT, () => logInfo(`Starting server at port ${PORT}...`));