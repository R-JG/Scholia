import { DataTypes } from 'sequelize';
import { UserModel } from '../../typeUtils/types';
import { database } from '../connectDatabase';
import GroupMembership from './GroupMembership';
import Group from './Group';

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

User.belongsToMany(Group, { through: GroupMembership });

export default User;