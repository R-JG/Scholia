import { DataTypes } from 'sequelize';
import { GroupModel } from '../../typeUtils/types';
import { database } from '../connectDatabase';
import GroupDocument from './GroupDocument';
import GroupMembership from './GroupMembership';
import User from './User';

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
    }
}, { tableName: 'groups', underscored: true, timestamps: false });

Group.belongsToMany(User, { through: GroupMembership });

Group.hasMany(GroupDocument);

export default Group;