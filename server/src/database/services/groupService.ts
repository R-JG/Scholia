import { NewGroup, GroupModel, NewGroupMembership } from '../../typeUtils/types';
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

export default { createOne };