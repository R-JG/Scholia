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

export interface CommentarySection {
    id: number,
    commentaryId: number,
    pageNumber: number,
    pageCoordinateTop: number,
    pageCoordinateBottom: number,
    text: string
};

export type SectionCoordinates = Pick<CommentarySection, 'pageNumber' | 'pageCoordinateTop' | 'pageCoordinateBottom'>;

export type CommentarySectionEntry = Omit<CommentarySection, 'id' | 'commentaryId'>;

export interface SelectedSection {
    data: CommentarySection, 
    index: number
};

export interface Commentary {
    id: number,
    userId: number,
    documentId: number,
    commentaryName: string,
    commentarySections: CommentarySection[],
    introduction?: string,
    conclusion?: string
};

export type CommentaryEntry = Omit<Commentary, 'id' | 'userId' | 'introduction' | 'conclusion' | 'commentarySections'>;

export interface CommentaryInfo extends 
Pick<Commentary, 'id' | 'userId' | 'documentId' | 'commentaryName'> 
{ author: string };

export type PageDirection = 'before-initial' | 'after-initial';

export type NavDirection = 'previous' | 'next';