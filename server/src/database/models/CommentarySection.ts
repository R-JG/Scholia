import { DataTypes } from 'sequelize';
import { CommentarySectionModel } from '../../typeUtils/types';
import { database } from '../connectDatabase';

const CommentarySection = database.define<CommentarySectionModel>('CommentarySection', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    commentaryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'commentaries', key: 'id' }
    },
    pageNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pageCoordinateTop: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    pageCoordinateBottom: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, { tableName: 'commentary_sections', underscored: true, timestamps: false });

export default CommentarySection;