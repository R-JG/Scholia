import axios from 'axios';
import { GroupDocumentInfo } from '../typeUtils/types';
import { parseGroupDocumentInfo } from '../typeUtils/validation';

const baseUrl: string = '/api/v1/documents';

const addDocument = async (document: File, token: string): Promise<GroupDocumentInfo | null> => {
    try {
        const formData = new FormData();
        formData.append('file', document);
        const response = await axios.post(
            baseUrl,
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