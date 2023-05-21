import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { 
    LoggedInUser, Group, GroupDocumentInfo, Commentary, SelectedSection, CommentaryInfo 
} from '../typeUtils/types';
import commentariesService from '../services/commentariesService';
import DocumentSelector from './DocumentSelector';
import CommentarySelector from './CommentarySelector';
import '../css/GroupContentPanel.css';

interface Props {
    user: LoggedInUser | null,
    selectedGroup: Group | null,
    documentsForGroup: GroupDocumentInfo[],
    selectedDocument: GroupDocumentInfo | null, 
    selectedCommentary: Commentary | null,
    selectedSection: SelectedSection | null,
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void,
    uploadDocument: (document: File, groupId: number) => void, 
    createCommentary: (documentId: number, commentaryName: string) => void, 
    getCommentaryForSelection: (commentaryId: number) => void, 
    setSelectedCommentary: (commentary: Commentary | null) => void, 
    setSelectedSection: (section: SelectedSection | null) => void
};

const GroupContentPanel = ({ 
    user,
    selectedGroup, 
    documentsForGroup, 
    selectedDocument, 
    selectedCommentary,
    selectedSection, 
    setSelectedDocument,
    uploadDocument,
    createCommentary, 
    getCommentaryForSelection, 
    setSelectedCommentary, 
    setSelectedSection
    }: Props) => {
    
    if (!user || !selectedGroup) return <div className='GroupContentPanel'></div>;

    const [inputFile, setInputFile] = useState<File | null>(null);
    const [commentaryList, setCommentaryList] = useState<CommentaryInfo[]>([]);

    const fileInuptRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!selectedDocument) return;
        commentariesService.getAllCommentaryInfoByDocument(user.token, selectedDocument.id)
        .then(commentaryInfo => setCommentaryList(commentaryInfo));
    }, [selectedDocument]);

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
            <div className='GroupContentPanel--group-documents-section'>
                <div className='GroupContentPanel--group-documents-list'>
                    {documentsForGroup.map(document => 
                    <DocumentSelector 
                        key={document.id}
                        isSelected={document.id == selectedDocument?.id}
                        documentInfo={document}
                        selectedCommentary={selectedCommentary}
                        selectedSection={selectedSection}
                        createCommentary={createCommentary}
                        setSelectedDocument={setSelectedDocument}
                        setSelectedCommentary={setSelectedCommentary}
                        setSelectedSection={setSelectedSection}
                    />)}
                </div>
                <div className='GroupContentPanel--document-commentaries-list'>
                    {commentaryList.map(commentaryInfo => 
                    <CommentarySelector 
                        key={commentaryInfo.id}
                        commentaryInfo={commentaryInfo}
                        groupDocuments={documentsForGroup}
                        selectedDocument={selectedDocument}
                        setSelectedDocument={setSelectedDocument}
                        getCommentaryForSelection={getCommentaryForSelection}
                        setSelectedSection={setSelectedSection}
                    />)}
                </div>
                <form 
                    className='GroupContentPanel--document-upload-form'
                    onSubmit={handleFormSubmit}>
                    <input 
                        className='GroupContentPanel--document-upload-input' 
                        ref={fileInuptRef}
                        type='file' 
                        accept='.pdf'
                        onChange={handleFileInputChange}
                    />
                    <button className='GroupContentPanel--document-upload-button'>
                        Upload
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GroupContentPanel;