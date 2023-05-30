import axiosInstance from './axiosConfig';
import { 
    Commentary, CommentaryInfo, CommentaryEntry, CommentarySectionEntry, CommentarySection 
} from '../typeUtils/types';
import { 
    parseCommentaryInfoArray, parseCommentary, parseCommentarySection, parseNumber 
} from '../typeUtils/validation';

const baseUrl: string = '/api/v1/commentaries';

const getAllCommentaryInfoByUser = async (token: string): Promise<CommentaryInfo[]> => {
    try {
        const response = await axiosInstance.get(
            `${baseUrl}/info`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const userCommentaryInfo: CommentaryInfo[] = parseCommentaryInfoArray(response.data);
        return userCommentaryInfo;
    } catch (error) {
        console.error(error);
        return [];
    };
};

const getAllCommentaryInfoForDocuments = async (
        token: string, documentIds: number[]
    ): Promise<CommentaryInfo[]> => {
    try {
        if (documentIds.length === 0) {
            console.log('document id query parameters are empty');
            return [];
        };
        const queryParams: string = `?documentId=${documentIds.join('&documentId=')}`;
        const response = await axiosInstance.get(
            `${baseUrl}/info/documents${queryParams}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const commentaryInfoForDocuments: CommentaryInfo[] = parseCommentaryInfoArray(response.data);
        return commentaryInfoForDocuments;
    } catch (error) {
        console.error(error);
        return [];
    };
};

const getCommentaryById = async (
        token: string, commentaryId: number
    ): Promise<Commentary | null> => {
    try {
        const response = await axiosInstance.get(
            `${baseUrl}/${commentaryId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const commentary: Commentary = parseCommentary(response.data);
        return commentary;
    } catch (error) {
        console.error(error);
        return null;
    };
};

const createCommentary = async (
        token: string, commentaryData: CommentaryEntry
    ): Promise<Commentary | null> => {
    try {
        const response = await axiosInstance.post(
            baseUrl,
            commentaryData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const createdCommentary: Commentary = parseCommentary(response.data);
        return createdCommentary;
    } catch (error) {
        console.error(error);
        return null;
    };
};

const createCommentarySection = async (
        token: string, commentaryId: number, sectionData: CommentarySectionEntry
    ): Promise<CommentarySection | null> => {
    try {
        const response = await axiosInstance.post(
            `${baseUrl}/${commentaryId}/sections`,
            sectionData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const createdSection: CommentarySection = parseCommentarySection(response.data);
        return createdSection;
    } catch (error) {
        console.error(error);
        return null;
    };
};

const updateCommentarySectionById = async (
        token: string, commentaryId: number, sectionId: number, sectionData: CommentarySectionEntry
    ): Promise<CommentarySection | null> => {
    try {
        const response = await axiosInstance.put(
            `${baseUrl}/${commentaryId}/sections/${sectionId}`,
            sectionData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const updatedSection: CommentarySection = parseCommentarySection(response.data);
        return updatedSection;
    } catch (error) {
        console.error(error);
        return null;
    };
};

const deleteCommentarySectionById = async (
        token: string, commentaryId: number, sectionId: number
    ): Promise<boolean> => {
    try {
        const response = await axiosInstance.delete(
            `${baseUrl}/${commentaryId}/sections/${sectionId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const amountDeleted: number = parseNumber(response.data);
        const sectionIsDeleted: boolean = (amountDeleted > 0);
        return sectionIsDeleted;
    } catch (error) {
        console.error(error);
        return false;
    };
};

export default { 
    getAllCommentaryInfoByUser, 
    getAllCommentaryInfoForDocuments, 
    getCommentaryById, 
    createCommentary, 
    createCommentarySection, 
    updateCommentarySectionById, 
    deleteCommentarySectionById
};