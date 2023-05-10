import { DataTypes } from 'sequelize';
import { GroupDocumentModel } from '../../typeUtils/types';
import { database } from '../connectDatabase';
import Group from './Group';

const GroupDocument = database.define<GroupDocumentModel>('GroupDocument', {
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
    documentName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { tableName: 'group_documents', underscored: true, timestamps: false });

GroupDocument.belongsTo(Group);

export default GroupDocument;