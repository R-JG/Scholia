import { Op } from 'sequelize';
import { NewGroup, GroupModel, NewGroupMembership, GroupMembershipModel } from '../../typeUtils/types';
import Group from '../models/Group';
import GroupMembership from '../models/GroupMembership';

const createOne = async (newGroupData: NewGroup, userId: number): Promise<GroupModel> => {
    const createdGroup = await Group.create(newGroupData);
    const membershipData: NewGroupMembership = {
        groupId: createdGroup.id,
        userId
    };
    await GroupMembership.create(membershipData);
    return createdGroup;
};

const getSomeByUser = async (userId: number): Promise<GroupModel[]> => {
    const groupMemberships: GroupMembershipModel[] = await GroupMembership.findAll(
        { where: { userId } }
    );
    const groupIdArray: number[] = groupMemberships.map(membership => membership.groupId);
    const groups: GroupModel[] = await Group.findAll({ where: { id: { [Op.in]: groupIdArray } } });
    return groups;
};

export default { createOne, getSomeByUser };