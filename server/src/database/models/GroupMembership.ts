import { DataTypes } from 'sequelize';
import { database } from '../connectDatabase';

const GroupMembership = database.define('GroupMembership', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'groups', key: 'id' }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    }},
    { tableName: 'group_memberships', underscored: true, timestamps: false }
);

export default GroupMembership;