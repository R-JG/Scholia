import { GroupDocumentInfo, CommentaryInfo, SelectedSection } from '../typeUtils/types';
import CommentarySelector from './CommentarySelector';

interface Props {
    documentsForGroup: GroupDocumentInfo[],
    selectedDocument: GroupDocumentInfo | null, 
    commentariesForDocument: CommentaryInfo[], 
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void, 
    getCommentaryForSelection: (commentaryId: number) => void, 
    setSelectedSection: (section: SelectedSection | null) => void
};

const DocumentCommentaryList = ({
    documentsForGroup, 
    selectedDocument,
    commentariesForDocument, 
    setSelectedDocument, 
    getCommentaryForSelection, 
    setSelectedSection
    }: Props) => {

    if (!selectedDocument) return <div className='DocumentCommentaryList'></div>;

    return (
        <div className='DocumentCommentaryList'>
            <h5>Commentaries: </h5>
            <div className='DocumentCommentaryList--commentaries-list'>
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
        </div>
    );
};

export default DocumentCommentaryList;