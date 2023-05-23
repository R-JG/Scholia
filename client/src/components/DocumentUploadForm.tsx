import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { maxFileBytesSize } from '../config';
import { Group } from '../typeUtils/types';
import '../css/DocumentUploadForm.css';

interface Props {
    selectedGroup: Group | null, 
    uploadDocument: (document: File, groupId: number) => void
};

const DocumentUploadForm = ({
    selectedGroup, 
    uploadDocument
    }: Props) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [inputFile, setInputFile] = useState<File | null>(null);
    const [promptMessage, setPromptMessage] = useState<string | null>(null);

    const fileInuptRef = useRef<HTMLInputElement>(null);

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
        if (fileInuptRef.current) {
            fileInuptRef.current.value = '';
        };
    };

    return (
        <div className='DocumentUploadForm'>
            {!isExpanded && 
            <button
                className='DocumentUploadForm--expand-button'
                onClick={handleExpandButton}>
                Add a document to the group
            </button>}
            <form 
                className='DocumentUploadForm--form'
                style={isExpanded ? undefined : { display: 'none' }}
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
            </form>
        </div>
    );
};

export default DocumentUploadForm;