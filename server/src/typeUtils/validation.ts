import { 
    User, NewUser, UserEntry, Token, GroupEntry, CommentaryEntry, CommentarySectionEntry 
} from './types';

const isString = (params: unknown): params is string => {
    return ((typeof params === 'string') || (params instanceof String));
};

const isNumber = (params: unknown): params is number => {
    return ((typeof params === 'number') || (params instanceof Number));
};

const parseString = (params: unknown): string => {
    if (!isString(params)) {
        throw new Error(`value: ${params} is not a string`);
    };
    return params;
};

const parseNumber = (params: unknown): number => {
    if (!isNumber(params)) {
        throw new Error(`value: ${params} is not a number`);
    };
    return params;
};

export const parseQueryParams = (params: unknown): string[] => {
    if (!params || !(isString(params) || Array.isArray(params))) {
        throw new Error('missing or incorrectly formatted query parameters');
    };
    if (isString(params)) return [params];
    return params.map(element => parseString(element));
};

export const parseUser = (params: unknown): User => {
    if (!params || (typeof params !== 'object') 
    || !(('id' in params) && ('username' in params) && ('passwordHash' in params))) {
        throw new Error('missing or incorrectly formatted data for type User');
    };
    const user: User = {
        id: parseNumber(params.id),
        username: parseString(params.username),
        passwordHash: parseString(params.passwordHash)
    };
    return user;
};

export const parseNewUser = (params: unknown): NewUser => {
    if (!params || (typeof params !== 'object') 
    || !(('username' in params) && ('passwordHash' in params))) {
        throw new Error('missing or incorrectly formatted data for type NewUser');
    };
    const newUser: NewUser = {
        username: parseString(params.username),
        passwordHash: parseString(params.passwordHash)
    };
    return newUser;
};

export const parseUserEntry = (params: unknown): UserEntry => {
    if (!params || (typeof params !== 'object') 
    || !(('username' in params) && ('password' in params))) {
        throw new Error('missing or incorrectly formatted data for type UserEntry');
    };
    const userEntry: UserEntry = {
        username: parseString(params.username),
        password: parseString(params.password)
    };
    return userEntry;
};

export const parseToken = (params: unknown): Token => {
    if (!params || (typeof params !== 'object') || !('username' in params)) {
        throw new Error('missing or incorrectly formatted data for type Token');
    };
    const token: Token = {
        username: parseString(params.username)
    };
    return token;
};

export const parseGroupEntry = (params: unknown): GroupEntry => {
    if (!params || (typeof params !== 'object') || !('groupName' in params)) {
        throw new Error('missing or incorrectly formatted data for type GroupEntry');
    };
    const groupEntry: GroupEntry = {
        groupName: parseString(params.groupName)
    };
    return groupEntry;
};

export const parseCommentaryEntry = (params: unknown): CommentaryEntry => {
    if (!params || (typeof params !== 'object') 
    || !('documentId' in params) || !('commentaryName' in params)) {
        throw new Error('missing or incorrectly formatted data for type CommentaryEntry');
    };
    const commentaryEntry: CommentaryEntry = {
        documentId: parseNumber(params.documentId),
        commentaryName: parseString(params.commentaryName)
    };
    return commentaryEntry;
};

export const parseCommentarySectionEntry = (params: unknown): CommentarySectionEntry => {
    if (!params || (typeof params !== 'object') 
    || !('pageNumber' in params) || !('pageCoordinateTop' in params) 
    || !('pageCoordinateBottom' in params) || !('text' in params)) {
        throw new Error('missing or incorrectly formatted data for type CommentarySectionEntry');
    };
    const commentarySectionEntry: CommentarySectionEntry = {
        pageNumber: parseNumber(params.pageNumber),
        pageCoordinateTop: parseNumber(params.pageCoordinateTop),
        pageCoordinateBottom: parseNumber(params.pageCoordinateBottom),
        text: parseString(params.text)
    };
    return commentarySectionEntry;
};