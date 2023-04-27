import { useState, FormEvent, ChangeEvent } from 'react';
import { Group, GroupDocumentInfo } from '../typeUtils/types';

interface Props {
    selectedGroup: Group | null,
    selectedGroupDocuments: GroupDocumentInfo[],
    uploadDocument: (document: File, groupId: number) => void
};

const GroupContentPanel = ({ 
    selectedGroup, 
    selectedGroupDocuments, 
    uploadDocument }: Props) => {
    
    if (!selectedGroup) return <div className='GroupContentPanel'></div>;

    const [inputFile, setInputFile] = useState<File | null>(null);

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (!e.currentTarget.files || !e.currentTarget.files[0]) return;
        setInputFile(e.currentTarget.files[0]);
    };    

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!inputFile || !selectedGroup) return;
        uploadDocument(inputFile, selectedGroup.id);
    };

    return (
        <div className='GroupContentPanel'>
            <div className='group-documents-section'>
                <div className='group-documents-list'>
                    {selectedGroupDocuments.map(groupDocument => 
                    <h4>{groupDocument.documentName}</h4>)}
                </div>
                <form 
                    className='form--document-upload'
                    onSubmit={handleFormSubmit}>
                    <input 
                        className='input--document-upload' 
                        type='file' 
                        accept='.pdf'
                        onChange={handleFileInputChange}
                    />
                    <button className='button--upload-document'>
                        Upload
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GroupContentPanel;