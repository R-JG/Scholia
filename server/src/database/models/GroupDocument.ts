import { DataTypes } from 'sequelize';
import { database } from '../connectDatabase';

const GroupDocument = database.define('GroupDocument', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: false
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'groups', key: 'id' }
    },
    documentName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false
    }},
    { tableName: 'group_documents', underscored: true, timestamps: false }
);

export default GroupDocument;