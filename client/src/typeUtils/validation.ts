import { 
    User, LoggedInUser, Group, GroupDocument, GroupDocumentInfo, CommentaryInfo, Commentary, CommentarySection 
} from './types';

const isString = (params: unknown): params is string => {
    return ((typeof params === 'string') || (params instanceof String));
};

const isNumber = (params: unknown): params is number => {
    return ((typeof params === 'number') || (params instanceof Number));
};

const parseString = (params: unknown): string => {
    if (!isString(params)) {
        throw new Error(`value: ${params} is not of type string`);
    };
    return params;
};

export const parseNumber = (params: unknown): number => {
    if (!isNumber(params)) {
        throw new Error(`value: ${params} is not of type number`);
    };
    return params;
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
    if (!params || (typeof params !== 'object') || !(('id' in params) && ('username' in params))) {
        throw new Error('missing or incorrectly formatted data for type User');
    };
    const user: User = {
        id: parseNumber(params.id),
        username: parseString(params.username)
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
    || !(('id' in params) && ('username' in params) && ('token' in params))) {
        throw new Error('missing or incorrectly formatted data for type LoggedInUser');
    };
    const loggedInUser: LoggedInUser = {
        id: parseNumber(params.id),
        username: parseString(params.username),
        token: parseString(params.token)
    };
    return loggedInUser;
};

export const parseGroup = (params: unknown): Group => {
    if (!params || (typeof params !== 'object') 
    || !(('id' in params) && ('groupName' in params))) {
        throw new Error('missing or incorrectly formatted data for type Group');
    };
    const group: Group = {
        id: parseNumber(params.id),
        groupName: parseString(params.groupName)
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
        id: parseNumber(params.id),
        groupId: parseNumber(params.groupId),
        documentName: parseString(params.documentName)
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

export const parseCommentaryInfo = (params: unknown): CommentaryInfo => {
    if (!params || (typeof params !== 'object') 
    || !('id' in params) || !('userId' in params) || !('documentId' in params)  
    || !('commentaryName' in params) || !('author' in params)) {
        throw new Error('missing or incorrectly formatted data for type CommentaryInfo');
    };
    const commentaryInfo: CommentaryInfo = {
        id: parseNumber(params.id),
        userId: parseNumber(params.userId),
        documentId: parseNumber(params.documentId),
        commentaryName: parseString(params.commentaryName),
        author: parseString(params.author)
    };
    return commentaryInfo;
};

export const parseCommentaryInfoArray = (params: unknown): CommentaryInfo[] => {
    if (!params || !Array.isArray(params)) {
        throw new Error('missing or incorrectly formatted data for CommentaryInfo array');
    };
    return params.map(element => parseCommentaryInfo(element));
};

export const parseCommentarySection = (params: unknown): CommentarySection => {
    if (!params || (typeof params !== 'object') 
    || !('id' in params) || !('commentaryId' in params) || !('pageNumber' in params) 
    || !('pageCoordinateTop' in params) || !('pageCoordinateBottom' in params) || !('text' in params)) {
        throw new Error('missing or incorrectly formatted data for type CommentarySection');
    };
    const commentarySection: CommentarySection = {
        id: parseNumber(params.id),
        commentaryId: parseNumber(params.commentaryId),
        pageNumber: parseNumber(params.pageNumber),
        pageCoordinateTop: parseNumber(params.pageCoordinateTop),
        pageCoordinateBottom: parseNumber(params.pageCoordinateBottom),
        text: parseString(params.text)
    };
    return commentarySection;
};

export const parseCommentarySectionArray = (params: unknown): CommentarySection[] => {
    if (!params || !Array.isArray(params)) {
        throw new Error('missing or incorrectly formatted data for CommentarySection array');
    };
    return params.map(element => parseCommentarySection(element));
};

export const parseCommentary = (params: unknown): Commentary => {
    if (!params || (typeof params !== 'object') || !('id' in params) 
    || !('userId' in params) || !('documentId' in params) || !('commentaryName' in params) 
    || !('commentarySections' in params)) {
        throw new Error('missing or incorrectly formatted data for type Commentary');
    };
    const commentary: Commentary = {
        id: parseNumber(params.id),
        userId: parseNumber(params.userId),
        documentId: parseNumber(params.documentId),
        commentaryName: parseString(params.commentaryName),
        commentarySections: parseCommentarySectionArray(params.commentarySections)
    };
    return commentary;
};