import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { 
    DATABASE_URI, DATABASE_PORT, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST 
} from '../serverUtils/config';
import { logInfo, logError } from '../serverUtils/logger';

export const database: Sequelize = (DATABASE_URI 
    ? new Sequelize(DATABASE_URI)
    : new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
        host: DATABASE_HOST,
        port: DATABASE_PORT,
        dialect: 'postgres'
    })
);

const runMigrations = async () => {
    const migrator = new Umzug({
        migrations: {
            glob: 'build/server/database/migrations/*.js',
        },
        storage: new SequelizeStorage({
            sequelize: database,
            tableName: 'migrations'
        }),
        context: database.getQueryInterface(),
        logger: console
    });
    const migrations = await migrator.up();
    logInfo('Migrations are up to date', { 
        files: migrations.map(migration => migration.name) 
    });
};

export const connectDatabase = async () => {
    try {
        await database.authenticate();
        await runMigrations();
        logInfo('Database is connected');
    } catch (error) {
        logInfo('Could not connect to the database');
        logError(error);
        process.exit(1);
    };
};