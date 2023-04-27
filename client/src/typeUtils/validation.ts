import { User, LoggedInUser, Group, GroupDocument, GroupDocumentInfo } from './types';

const isString = (params: unknown): params is string => {
    return ((typeof params === 'string') || (params instanceof String));
};

const isNumber = (params: unknown): params is number => {
    return ((typeof params === 'number') || (params instanceof Number));
};

const parseStringProp = (prop: unknown): string => {
    if (!isString(prop)) {
        throw new Error(`property ${prop} is not of type string`);
    };
    return prop;
};

const parseNumberProp = (prop: unknown): number => {
    if (!isNumber(prop)) {
        throw new Error(`property ${prop} is not of type number`);
    };
    return prop;
};

const parseFile = (params: unknown): File => {
    if (!params || !(params instanceof File)) {
        throw new Error('missing or incorrectly formatted data for type File');
    };
    return params;
};

export const parseBlob = (params: unknown): Blob => {
    if (!params || !(params instanceof Blob)) {
        throw new Error('missing or incorrectly formatted data for type Blob');
    };
    return params;
};

export const parseUser = (params: unknown): User => {
    if (!params || (typeof params !== 'object') || !('username' in params)) {
        throw new Error('missing or incorrectly formatted data for type User');
    };
    const user: User = {
        username: parseStringProp(params.username)
    };
    return user;
};

export const parseUserArray = (params: unknown): User[] => {
    if (!params || !Array.isArray(params)) {
        throw new Error('missing or incorrectly formatted data for type User[]');
    };
    const userArray: User[] = params.map(element => parseUser(element));
    return userArray;
};

export const parseLoggedInUser = (params: unknown): LoggedInUser => {
    if (!params || (typeof params !== 'object') 
    || !(('username' in params) && ('token' in params))) {
        throw new Error('missing or incorrectly formatted data for type LoggedInUser');
    };
    const loggedInUser: LoggedInUser = {
        username: parseStringProp(params.username),
        token: parseStringProp(params.token)
    };
    return loggedInUser;
};

export const parseGroup = (params: unknown): Group => {
    if (!params || (typeof params !== 'object') 
    || !(('id' in params) && ('groupName' in params))) {
        throw new Error('missing or incorrectly formatted data for type Group');
    };
    const group: Group = {
        id: parseNumberProp(params.id),
        groupName: parseStringProp(params.groupName)
    };
    return group;
};

export const parseGroupArray = (params: unknown): Group[] => {
    if (!params || !Array.isArray(params)) {
        throw new Error('missing or incorrectly formatted data for Group array');
    };
    return params.map(element => parseGroup(element));
};

export const parseGroupDocumentInfo = (params: unknown): GroupDocumentInfo => {
    if (!params || (typeof params !== 'object') 
    || !(('id' in params) && ('groupId' in params) && ('documentName' in params))) {
        throw new Error('missing or incorrectly formatted data for GroupDocument info');
    };
    const groupDocumentInfo: GroupDocumentInfo = {
        id: parseNumberProp(params.id),
        groupId: parseNumberProp(params.groupId),
        documentName: parseStringProp(params.documentName)
    };
    return groupDocumentInfo;
};

export const parseGroupDocumentInfoArray = (params: unknown): GroupDocumentInfo[] => {
    if (!params || !Array.isArray(params)) {
        throw new Error('missing or incorrectly formatted data for GroupDocumentInfo array');
    };
    return params.map(element => parseGroupDocumentInfo(element));
};

export const parseGroupDocument = (params: unknown): GroupDocument => {
    if (!params || (typeof params !== 'object') 
    || !('file' in params)) {
        throw new Error('missing or incorrectly formatted data for type GroupDocument');
    };
    const groupDocument: GroupDocument = {
        ...parseGroupDocumentInfo(params),
        file: parseFile(params.file)
    };
    return groupDocument;
};