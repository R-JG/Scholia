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

export interface GroupDocument {
    id: number,
    groupId: number | string,
    documentName: string,
    filePath: string
};

export type NewGroupDocument = Omit<GroupDocument, 'id'>;

export type GroupDocumentInfo = Omit<GroupDocument, 'filePath'>;

export interface GroupDocumentModel extends GroupDocument, Model {};

export interface CommentarySection {
    id: number,
    commentaryId: number,
    pageNumber: number,
    pageCoordinateTop: number,
    pageCoordinateBottom: number,
    text: string
};

export type CommentarySectionEntry = Omit<CommentarySection, 'id' | 'commentaryId'>;

export interface CommentarySectionModel extends CommentarySection, Model {};

export interface Commentary {
    id: number,
    userId: number,
    documentId: number,
    commentaryName: string,
    commentarySections: CommentarySection[],
    introduction?: string,
    conclusion?: string
};

export type CommentaryEntry = Omit<Commentary, 'id' | 'userId' | 'introduction' | 'conclusion' | 'commentarySections'>;

export interface CommentaryModel extends Commentary, Model {}; 

export type CommentaryInfo = Pick<Commentary, 'id' | 'userId' | 'commentaryName'>;