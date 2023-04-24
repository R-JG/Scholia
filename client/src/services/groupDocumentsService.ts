import axios from 'axios';
import { GroupDocumentInfo } from '../typeUtils/types';
import { parseGroupDocumentInfo } from '../typeUtils/validation';

const baseUrl: string = '/api/v1/groups';

const addDocument = async (
        document: File, groupId: number, token: string
    ): Promise<GroupDocumentInfo | null> => {
    try {
        const formData = new FormData();
        formData.append('file', document);
        const response = await axios.post(
            `${baseUrl}/${groupId}/documents`,
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

export default { addDocument };