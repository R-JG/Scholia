import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { 
    POSTGRES_PORT, POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST 
} from '../serverUtils/config';
import { logInfo, logError } from '../serverUtils/logger';

export const database = new Sequelize(
    POSTGRES_DATABASE, 
    POSTGRES_USER, 
    POSTGRES_PASSWORD,
    {
        host: POSTGRES_HOST,
        port: POSTGRES_PORT,
        dialect: 'postgres'
    }
);

const runMigrations = async () => {
    const migrator = new Umzug({
        migrations: {
            glob: 'src/database/migrations/*.ts',
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
    };
};