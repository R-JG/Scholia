import { DataTypes } from 'sequelize';
import { UserModel } from '../../typeUtils/types';
import { database } from '../connectDatabase';

const User = database.define<UserModel>('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    }},
    { tableName: 'users', underscored: true, timestamps: false }
);

export default User;