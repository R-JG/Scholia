import { CreatedUser, UserToken } from './types';

const isString = (params: unknown): params is string => {
    return ((typeof params === 'string') || (params instanceof String));
};

const parseStringProp = (prop: unknown): string => {
    if (!isString(prop)) {
        throw new Error(`property ${prop} is not of type string`);
    };
    return prop;
};

export const parseCreatedUser = (params: unknown): CreatedUser => {
    if (!params || (typeof params !== 'object')) {
        throw new Error('missing or incorrectly formatted data for type CreatedUser');
    };
    if (!('username' in params)) {
        throw new Error('some properties are missing for type CreatedUser');
    };
    const createdUser: CreatedUser = {
        username: parseStringProp(params.username)
    };
    return createdUser;
};

export const parseUserToken = (params: unknown): UserToken => {
    if (!params || (typeof params !== 'object')) {
        throw new Error('missing or incorrectly formatted data for type UserToken');
    };
    if (!(('username' in params) && ('token' in params))) {
        throw new Error('some properties are missing for type UserToken');
    };
    const userToken: UserToken = {
        username: parseStringProp(params.username),
        token: parseStringProp(params.token)
    };
    return userToken;
};