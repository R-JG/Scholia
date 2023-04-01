import app from './app';
import { PORT } from './serverUtils/config';
import { logInfo, logError } from './serverUtils/logger';
import database from './database/connectDatabase';

// Test:
try {
    database.sync({ force: false });
} catch (error) {
    logError(error);
};

app.listen(PORT, () => logInfo(`Starting server at port ${PORT}...`));