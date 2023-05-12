import { DataTypes } from 'sequelize';
import { CommentaryModel } from '../../typeUtils/types';
import { database } from '../connectDatabase';

const Commentary = database.define<CommentaryModel>('Commentary', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    documentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'group_documents', key: 'id' }
    },
    commentaryName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    introduction: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    conclusion: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, { tableName: 'commentaries', underscored: true, timestamps: false });

export default Commentary;