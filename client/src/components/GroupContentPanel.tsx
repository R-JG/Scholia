import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { LoggedInUser, Group, GroupDocumentInfo, Commentary } from '../typeUtils/types';
import DocumentSelector from './DocumentSelector';

interface Props {
    user: LoggedInUser | null,
    selectedGroup: Group | null,
    documentsOfGroup: GroupDocumentInfo[],
    selectedCommentary: Commentary | null,
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void,
    uploadDocument: (document: File, groupId: number) => void,
    setSelectedCommentary: (commentary: Commentary | null) => void
};

const GroupContentPanel = ({ 
    user,
    selectedGroup, 
    documentsOfGroup, 
    selectedCommentary,
    setSelectedDocument,
    uploadDocument,
    setSelectedCommentary
    }: Props) => {
    
    if (!user || !selectedGroup) return <div className='GroupContentPanel'></div>;

    const [inputFile, setInputFile] = useState<File | null>(null);

    const fileInuptRef = useRef<HTMLInputElement>(null);

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (!e.currentTarget.files || !e.currentTarget.files[0]) return;
        setInputFile(e.currentTarget.files[0]);
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
        <div className='GroupContentPanel'>
            <div className='group-documents-section'>
                <div className='group-documents-list'>
                    {documentsOfGroup.map(document => 
                    <DocumentSelector 
                        documentInfo={document}
                        selectedCommentary={selectedCommentary}
                        setSelectedDocument={setSelectedDocument}
                        setSelectedCommentary={setSelectedCommentary}
                    />)}
                </div>
                <form 
                    className='form--document-upload'
                    onSubmit={handleFormSubmit}>
                    <input 
                        className='input--document-upload' 
                        ref={fileInuptRef}
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