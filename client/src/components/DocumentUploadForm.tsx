import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { LoggedInUser, Group, GroupDocumentInfo } from '../typeUtils/types';
import { maxFileBytesSize } from '../config';
import groupDocumentsService from '../services/groupDocumentsService';
import ProgressBar from './ProgressBar';
import '../css/DocumentUploadForm.css';

interface Props {
    user: LoggedInUser | null,
    groupDocuments: GroupDocumentInfo[], 
    selectedGroup: Group | null, 
    setGroupDocuments: (groupDocuments: GroupDocumentInfo[]) => void, 
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void
};

const DocumentUploadForm = ({
    user, 
    groupDocuments, 
    selectedGroup, 
    setGroupDocuments, 
    setSelectedDocument
    }: Props) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [inputFile, setInputFile] = useState<File | null>(null);
    const [promptMessage, setPromptMessage] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);

    const fileInuptRef = useRef<HTMLInputElement>(null);

    const callbackUploadProgress = (newProgressValue: number | undefined): void => setUploadProgress(newProgressValue);

    const uploadDocument = (document: File, groupId: number): void => {
        if (!user) return;
        groupDocumentsService.uploadDocument(document, groupId, user.token, callbackUploadProgress)
        .then(addedDocumentInfo => {
            if (!addedDocumentInfo) return setUploadProgress(undefined);
            setGroupDocuments(groupDocuments.concat(addedDocumentInfo));
            setSelectedDocument(addedDocumentInfo);
            if (fileInuptRef.current) fileInuptRef.current.value = '';
            setUploadProgress(undefined);
            setIsExpanded(false);
        });
    };

    const handleExpandButton = (): void => setIsExpanded(true);

    const handleCancelButton = (): void => {
        setInputFile(null);
        if (fileInuptRef.current && (fileInuptRef.current.value !== '')) {
            fileInuptRef.current.value = '';
        };
        if (promptMessage) setPromptMessage(null);
        setIsExpanded(false);
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (!e.currentTarget.files || !e.currentTarget.files[0]) return;
        const [file] = e.currentTarget.files;
        if (file.size > maxFileBytesSize) {
            setPromptMessage(`maximum file size is ${maxFileBytesSize / 1000000} mb`);
            setInputFile(null);
            e.currentTarget.value = '';
            return;
        };
        if (promptMessage) setPromptMessage(null);
        setInputFile(file);
    };

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!inputFile || !selectedGroup) return;
        uploadDocument(inputFile, selectedGroup.id);
    };

    return (
        <div className='DocumentUploadForm'>
            {!isExpanded && 
            <button
                className='DocumentUploadForm--expand-button'
                onClick={handleExpandButton}>
                Add a document to the group
            </button>}
            {isExpanded && !uploadProgress && 
            <form 
                className='DocumentUploadForm--form'
                onSubmit={handleFormSubmit}>
                <input 
                    className='DocumentUploadForm--upload-input' 
                    ref={fileInuptRef}
                    type='file' 
                    accept='.pdf'
                    onChange={handleFileInputChange}
                />
                {promptMessage && 
                <span className='DocumentUploadForm--prompt-message'>
                    {promptMessage}
                </span>}
                {inputFile && 
                <button className='DocumentUploadForm--upload-button'>
                    Upload
                </button>}
                <button 
                    className='DocumentUploadForm--cancel-button'
                    type='button'
                    onClick={handleCancelButton}>
                    Cancel
                </button>
            </form>}
            {uploadProgress && 
            <ProgressBar 
                message={`Uploading ${inputFile?.name}`} 
                progressPercent={uploadProgress * 100} 
            />}
        </div>
    );
};

export default DocumentUploadForm;