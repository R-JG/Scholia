import { useState } from 'react';
import { GroupDocumentInfo, CommentaryInfo, SelectedSection } from '../typeUtils/types';
import CommentaryCreationForm from './CommentaryCreationForm';
import CommentarySelector from './CommentarySelector';

interface Props {
    documentsForGroup: GroupDocumentInfo[],
    selectedDocument: GroupDocumentInfo | null, 
    commentariesForDocument: CommentaryInfo[], 
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void, 
    createCommentary: (documentId: number, commentaryName: string) => void, 
    getCommentaryForSelection: (commentaryId: number) => void, 
    setSelectedSection: (section: SelectedSection | null) => void
};

const DocumentCommentaryFeature = ({
    documentsForGroup, 
    selectedDocument,
    commentariesForDocument, 
    setSelectedDocument, 
    createCommentary, 
    getCommentaryForSelection, 
    setSelectedSection
    }: Props) => {

    if (!selectedDocument) return <div className='DocumentCommentaryFeature'></div>;

    const [createCommentaryMode, setCreateCommentaryMode] = useState<boolean>(false);

    return (
        <div className='DocumentCommentaryFeature'>
            <h5>Commentaries: </h5>
            <div className='DocumentCommentaryFeature--commentaries-list'>
                {commentariesForDocument.map(commentaryInfo => 
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
            <button 
                className='DocumentCommentaryFeature--create-commentary-button'
                onClick={() => setCreateCommentaryMode(!createCommentaryMode)}>
                {createCommentaryMode ? 'Cancel' : 'Create Commentary'}
            </button>
            {createCommentaryMode && 
            <CommentaryCreationForm 
                documentInfo={selectedDocument}
                createCommentary={createCommentary}
            />}
        </div>
    );
};

export default DocumentCommentaryFeature;