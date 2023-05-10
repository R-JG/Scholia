import { DataTypes } from 'sequelize';
import { CommentaryModel } from '../../typeUtils/types';
import { database } from '../connectDatabase';
import CommentarySection from './CommentarySection';
import User from './User';

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

Commentary.belongsTo(User);

Commentary.hasMany(CommentarySection);

export default Commentary;