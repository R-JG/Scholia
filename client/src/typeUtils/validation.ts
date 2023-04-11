import { User, UserToken } from './types';

const isString = (params: unknown): params is string => {
    return ((typeof params === 'string') || (params instanceof String));
};

const parseStringProp = (prop: unknown): string => {
    if (!isString(prop)) {
        throw new Error(`property ${prop} is not of type string`);
    };
    return prop;
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

export const parseUserToken = (params: unknown): UserToken => {
    if (!params || (typeof params !== 'object') 
    || !(('username' in params) && ('token' in params))) {
        throw new Error('missing or incorrectly formatted data for type UserToken');
    };
    const userToken: UserToken = {
        username: parseStringProp(params.username),
        token: parseStringProp(params.token)
    };
    return userToken;
};