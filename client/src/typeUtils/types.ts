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

export interface GroupDocument {
    id: number,
    groupId: number,
    documentName: string,
    file: File
};

export type GroupDocumentInfo = Omit<GroupDocument, 'file'>;

interface GroupDocumentStateElement {
    groupId: number,
    documents: (GroupDocument | GroupDocumentInfo)[]
};

export type GroupDocumentState = GroupDocumentStateElement[];