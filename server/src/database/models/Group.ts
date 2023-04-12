import { DataTypes } from 'sequelize';
import { GroupModel } from '../../typeUtils/types';
import { database } from '../connectDatabase';

const Group = database.define<GroupModel>('Group', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    groupName: {
        type: DataTypes.STRING,
        allowNull: false
    }},
    { tableName: 'groups', underscored: true, timestamps: false }
);

export default Group;