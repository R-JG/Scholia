import { DataTypes } from 'sequelize';
import { database } from '../connectDatabase';

const User = database.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    }},
    { tableName: 'users', timestamps: false }
);

export default User;