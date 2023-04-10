import { DataTypes } from 'sequelize';
import { database } from '../connectDatabase';

const Document = database.define('Document', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: false
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'groups', key: 'id' }
    }},
    { tableName: 'documents', underscored: true, timestamps: false }
);

export default Document;