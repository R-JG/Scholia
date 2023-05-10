export interface UserEntry {
    username: string,
    password: string
};

export interface User {
    id: number,
    username: string
};

export interface LoggedInUser {
    id: number,
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

/*
*** Old Commentary Types:

export interface PageSelectionCoordinates {
    pageNumber: number,
    top: number,
    bottom: number
};

export interface CommentarySection {
    coordinates: PageSelectionCoordinates,
    text: string
};

export interface CommentarySections {
    introduction?: string,
    body: CommentarySection[],
    conclusion?: string
};

export interface Commentary {
    id: number,
    userId: number,
    name: string,
    commentarySections: CommentarySections
};
*/

export interface CommentarySection {
    id: number,
    commentaryId: number,
    pageNumber: number,
    pageCoordinateTop: number,
    pageCoordinateBottom: number,
    text: string
};

export type CommentarySectionEntry = Omit<CommentarySection, 'id' | 'commentaryId'>;

export interface Commentary {
    id: number,
    userId: number,
    commentaryName: string,
    commentarySections: CommentarySection[],
    introduction?: string,
    conclusion?: string
};

export type CommentaryEntry = Omit<Commentary, 'id' | 'userId' | 'introduction' | 'conclusion' | 'commentarySections'>;

export type CommentaryInfo = Pick<Commentary, 'id' | 'userId' | 'commentaryName'>;