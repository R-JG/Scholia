export interface UserEntry {
    username: string,
    password: string
};

export interface User {
    username: string
};

export interface LoggedInUser {
    username: string,
    token: string
};

export interface GroupEntry {
    groupName: string
};

export interface Group {
    id: number,
    groupName: string
};