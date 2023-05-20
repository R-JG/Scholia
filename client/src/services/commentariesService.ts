import axios from 'axios';
import { 
    Commentary, CommentaryInfo, CommentaryEntry, CommentarySectionEntry, CommentarySection 
} from '../typeUtils/types';
import { parseCommentaryInfoArray, parseCommentary, parseCommentarySection } from '../typeUtils/validation';

const baseUrl: string = '/api/v1/commentaries';

const getAllCommentaryInfoByUser = async (token: string): Promise<CommentaryInfo[]> => {
    try {
        const response = await axios.get(
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

const getAllCommentaryInfoByDocument = async (
        token: string, documentId: number
    ): Promise<CommentaryInfo[]> => {
    try {
        const response = await axios.get(
            `${baseUrl}/info/document/${documentId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const commentaryInfoForDocument: CommentaryInfo[] = parseCommentaryInfoArray(response.data);
        return commentaryInfoForDocument;
    } catch (error) {
        console.error(error);
        return [];
    };
};

const getCommentaryById = async (
        token: string, commentaryId: number
    ): Promise<Commentary | null> => {
    try {
        const response = await axios.get(
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
        const response = await axios.post(
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
        const response = await axios.post(
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
        const response = await axios.put(
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

export default { 
    getAllCommentaryInfoByUser, 
    getAllCommentaryInfoByDocument, 
    getCommentaryById, 
    createCommentary, 
    createCommentarySection, 
    updateCommentarySectionById
};