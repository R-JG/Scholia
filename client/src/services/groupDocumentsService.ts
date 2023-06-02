import axiosInstance from './axiosConfig';
import { GroupDocumentInfo } from '../typeUtils/types';
import { parseGroupDocumentInfo, parseGroupDocumentInfoArray, parseBlob } from '../typeUtils/validation';

const baseUrl: string = '/api/v1/documents';

const uploadDocument = async (
        document: File, 
        groupId: number, 
        token: string, 
        uploadProgressCallback: (progress: number | undefined) => void
    ): Promise<GroupDocumentInfo | null> => {
    try {
        const formData = new FormData();
        formData.append('file', document);
        const response = await axiosInstance.post(
            `${baseUrl}/groups/${groupId}`,
            formData,
            { headers: { Authorization: `Bearer ${token}` }, 
            onUploadProgress: (progressEvent) => uploadProgressCallback(progressEvent.progress)}
        );
        const addedDocumentInfo: GroupDocumentInfo = parseGroupDocumentInfo(response.data);
        return addedDocumentInfo;        
    } catch (error) {
        console.error(error);
        return null;
    };
};

const downloadDocument = async (
        documentId: number, 
        token: string, 
        downloadProgressCallback: (progress: number | undefined) => void
    ): Promise<Blob | null> => {
    try {
        const response = await axiosInstance.get(
            `${baseUrl}/${documentId}/file`,
            { headers: { Authorization: `Bearer ${token}` }, 
            responseType: 'blob', 
            onDownloadProgress: (progressEvent) => downloadProgressCallback(progressEvent.progress) }
        );
        const documentBlob = parseBlob(response.data);
        return documentBlob;
    } catch (error) {
        console.error(error);
        return null;
    };
};

const getAllDocumentInfoForGroups = async (
        groupIds: number[], token: string
    ): Promise<GroupDocumentInfo[]> => {
    try {
        if (groupIds.length === 0) {
            console.log('group id query parameters are empty');
            return [];
        };
        const queryParams: string = `?groupId=${groupIds.join('&groupId=')}`;
        const response = await axiosInstance.get(
            `${baseUrl}/info/groups${queryParams}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const groupDocuments: GroupDocumentInfo[] = parseGroupDocumentInfoArray(response.data);
        return groupDocuments;
    } catch (error) {
        console.error(error);
        return [];
    };
};

const downloadDocumentThumbnail = async (documentId: number, token: string): Promise<Blob | null> => {
    try {
        const response = await axiosInstance.get(
            `${baseUrl}/${documentId}/thumbnail`,
            { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' } 
        );
        const thumbnailDocumentBlob = parseBlob(response.data);
        return thumbnailDocumentBlob;
    } catch (error) {
        console.error(error);
        return null;
    };
};

export default { 
    uploadDocument, 
    downloadDocument, 
    getAllDocumentInfoForGroups, 
    downloadDocumentThumbnail 
};