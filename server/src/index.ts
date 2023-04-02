import app from './app';
import { PORT } from './serverUtils/config';
import { logInfo } from './serverUtils/logger';
import { connectDatabase } from './database/connectDatabase';

const startServer = async () => {
    await connectDatabase();
    app.listen(PORT, () => logInfo(`Starting server at port ${PORT}...`));
};

startServer();