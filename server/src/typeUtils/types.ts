import { Model } from 'sequelize';

export interface User {
    id: number,
    username: string,
    passwordHash: string
};

export type NewUser = Omit<User, 'id'>;

export interface UserEntry {
    username: string,
    password: string
};

export interface UserModel extends User, Model {};

export interface Token {
    username: string,
};

export interface Group {
    id: number,
    groupName: string
};

export type NewGroup = Omit<Group, 'id'>;

export interface GroupEntry {
    groupName: string
};

export interface GroupModel extends Group, Model {};

export interface GroupMembership {
    id: number,
    groupId: number,
    userId: number
};

export type NewGroupMembership = Omit<GroupMembership, 'id'>;

export interface GroupMembershipModel extends GroupMembership, Model {};