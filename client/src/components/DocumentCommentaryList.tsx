import { LoggedInUser, GroupDocumentInfo, CommentaryInfo, SelectedSection } from '../typeUtils/types';
import CommentarySelector from './CommentarySelector';
import '../css/DocumentCommentaryList.css';

interface Props {
    user: LoggedInUser | null, 
    documentsForGroup: GroupDocumentInfo[],
    selectedDocument: GroupDocumentInfo | null, 
    userCommentariesForDocument: CommentaryInfo[], 
    groupCommentariesForDocument: CommentaryInfo[], 
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void, 
    getCommentaryForSelection: (commentaryId: number) => void, 
    setSelectedSection: (section: SelectedSection | null) => void
};

const DocumentCommentaryList = ({
    user, 
    documentsForGroup, 
    selectedDocument,
    userCommentariesForDocument, 
    groupCommentariesForDocument,  
    setSelectedDocument, 
    getCommentaryForSelection, 
    setSelectedSection
    }: Props) => {

    if (!user || !selectedDocument) return <div className='DocumentCommentaryList'></div>;

    return (
        <div className='DocumentCommentaryList'>
            <div className='DocumentCommentaryList--user-commentaries-section'>
                <h5>Your Commentaries: </h5>
                <div className='DocumentCommentaryList--user-commentaries-list'>
                    {userCommentariesForDocument.map(commentaryInfo => 
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
            <div className='DocumentCommentaryList--group-commentaries-section'>
                <h5>Other Members' Commentaries: </h5>
                <div className='DocumentCommentaryList--group-commentaries-list'>
                    {groupCommentariesForDocument.map(commentaryInfo => 
                    (commentaryInfo.userId !== user.id) ?
                    <CommentarySelector 
                        key={commentaryInfo.id}
                        commentaryInfo={commentaryInfo}
                        groupDocuments={documentsForGroup}
                        selectedDocument={selectedDocument}
                        setSelectedDocument={setSelectedDocument}
                        getCommentaryForSelection={getCommentaryForSelection}
                        setSelectedSection={setSelectedSection}
                    /> : undefined)}
                </div>
            </div>
        </div>
    );
};

export default DocumentCommentaryList;