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