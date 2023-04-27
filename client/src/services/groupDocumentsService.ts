import axios from 'axios';
import { GroupDocumentInfo } from '../typeUtils/types';
import { parseGroupDocumentInfo, parseGroupDocumentInfoArray } from '../typeUtils/validation';

const baseUrl: string = '/api/v1/documents';

const addDocument = async (
        document: File, groupId: number, token: string
    ): Promise<GroupDocumentInfo | null> => {
    try {
        const formData = new FormData();
        formData.append('file', document);
        const response = await axios.post(
            `${baseUrl}/groups/${groupId}`,
            formData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const addedDocumentInfo: GroupDocumentInfo = parseGroupDocumentInfo(response.data);
        return addedDocumentInfo;        
    } catch (error) {
        console.error(error);
        return null;
    };
};

const getAllDocumentsForGroups = async (
        groupIds: number[], token: string
    ): Promise<GroupDocumentInfo[]> => {
    try {
        const queryParams: string = `?groupId=${groupIds.join('&groupId=')}`;
        const response = await axios.get(
            `${baseUrl}/groups${queryParams}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const groupDocuments: GroupDocumentInfo[] = parseGroupDocumentInfoArray(response.data);
        return groupDocuments;
    } catch (error) {
        console.error(error);
        return [];
    };
};

export default { addDocument, getAllDocumentsForGroups };