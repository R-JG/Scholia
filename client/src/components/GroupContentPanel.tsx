import { useState, FormEvent, ChangeEvent } from 'react';

interface Props {
    uploadDocument: (document: File) => void
};

const GroupContentPanel = ({ uploadDocument }: Props) => {

    const [inputFile, setInputFile] = useState<File | null>(null);

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (!e.currentTarget.files || !e.currentTarget.files[0]) return;
        setInputFile(e.currentTarget.files[0]);
    };    

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!inputFile) return;
        uploadDocument(inputFile);
    };

    return (
        <div className='GroupContentPanel'>
            <div className='group-documents-section'>
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