import { Sequelize } from 'sequelize';
import { 
    POSTGRES_PORT, POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST 
} from '../serverUtils/config';

const database = new Sequelize(
    POSTGRES_DATABASE, 
    POSTGRES_USER, 
    POSTGRES_PASSWORD,
    {
        host: POSTGRES_HOST,
        port: POSTGRES_PORT,
        dialect: 'postgres'
    }
);

export default database;