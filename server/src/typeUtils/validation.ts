import { User, NewUser, UserEntry } from './types';

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

export const parseUser = (params: unknown): User => {
    if (!params || (typeof params !== 'object')) {
        throw new Error('missing or incorrectly formatted data for type User');
    };
    if (!(('id' in params) 
    && ('username' in params) 
    && ('passwordHash' in params))) {
        throw new Error('some properties are missing for type User');
    };
    const user: User = {
        id: parseNumberProp(params.id),
        username: parseStringProp(params.username),
        passwordHash: parseStringProp(params.passwordHash)
    };
    return user;
};

export const parseNewUser = (params: unknown): NewUser => {
    if (!params || (typeof params !== 'object')) {
        throw new Error('missing or incorrectly formatted data for type NewUser');
    };
    if (!(('username' in params) 
    && ('passwordHash' in params))) {
        throw new Error('some properties are missing for type NewUser');
    };
    const newUser: NewUser = {
        username: parseStringProp(params.username),
        passwordHash: parseStringProp(params.passwordHash)
    };
    return newUser;
};

export const parseUserEntry = (params: unknown): UserEntry => {
    if (!params || (typeof params !== 'object')) {
        throw new Error('missing or incorrectly formatted data for type UserEntry');
    };
    if (!(('username' in params) 
    && ('password' in params))) {
        throw new Error('some properties are missing for type UserEntry');
    };
    const userEntry: UserEntry = {
        username: parseStringProp(params.username),
        password: parseStringProp(params.password)
    };
    return userEntry;
};