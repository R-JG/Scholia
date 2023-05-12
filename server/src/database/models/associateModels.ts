import User from './User';
import Group from './Group';
import GroupMembership from './GroupMembership';
import GroupDocument from './GroupDocument';
import Commentary from './Commentary';
import CommentarySection from './CommentarySection';

const associateModels = () => {
    
    User.belongsToMany(Group, { through: GroupMembership });
    Group.belongsToMany(User, { through: GroupMembership });

    User.hasMany(Commentary, {
        sourceKey: 'id',
        foreignKey: 'userId',
        as: 'commentaries'
    });
    Commentary.belongsTo(User, { 
        targetKey: 'id',
        foreignKey: 'userId'
    });
    
    Group.hasMany(GroupDocument, {
        sourceKey: 'id',
        foreignKey: 'groupId',
        as: 'groupDocuments'
    });
    GroupDocument.belongsTo(Group, { 
        targetKey: 'id',
        foreignKey: 'groupId'
    });

    Commentary.hasMany(CommentarySection, {
        sourceKey: 'id',
        foreignKey: 'commentaryId',
        as: 'commentarySections'
    });
    CommentarySection.belongsTo(Commentary, { 
        targetKey: 'id',
        foreignKey: 'commentaryId'
    });
};

export default associateModels;