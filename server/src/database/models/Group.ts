import { DataTypes } from 'sequelize';
import { database } from '../connectDatabase';

const Group = database.define('Group', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }},
    { tableName: 'groups', underscored: true, timestamps: false }
);

export default Group;