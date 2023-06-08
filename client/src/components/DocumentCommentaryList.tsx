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

    if (!user || !selectedDocument) return <div className='DocumentCommentaryList inactive'></div>;

    if ((userCommentariesForDocument.length === 0) && (groupCommentariesForDocument.length === 0)) {
        return (
        <div className='DocumentCommentaryList'>
            <h5>There are currently no commentaries for this document.</h5>
        </div>);
    };

    return (
        <div className='DocumentCommentaryList'>
            <div className='DocumentCommentaryList--user-commentaries-section'>
                <h5 className='DocumentCommentaryList--user-commentaries-title'>
                    {(userCommentariesForDocument.length > 0) 
                    ? 'Your commentaries:' 
                    : 'You currently have no commentaries written for this document.'}
                </h5>
                <div className='DocumentCommentaryList--user-commentaries-list'>
                    {userCommentariesForDocument.map(commentaryInfo => 
                    <CommentarySelector 
                        key={commentaryInfo.id}
                        commentaryInfo={commentaryInfo}
                        documentsForGroup={documentsForGroup}
                        selectedDocument={selectedDocument}
                        setSelectedDocument={setSelectedDocument}
                        getCommentaryForSelection={getCommentaryForSelection}
                        setSelectedSection={setSelectedSection}
                    />)}
                </div>
            </div>
            <div className='DocumentCommentaryList--group-commentaries-section'>
                <h5 className='DocumentCommentaryList--group-commentaries-title'>
                    {(groupCommentariesForDocument.length > 0) 
                    ? 'Other members\' commentaries:' 
                    : 'There are currently no commentaries written by other members for this document.'}
                </h5>
                <div className='DocumentCommentaryList--group-commentaries-list'>
                    {groupCommentariesForDocument.map(commentaryInfo => 
                    <CommentarySelector 
                        key={commentaryInfo.id}
                        commentaryInfo={commentaryInfo}
                        documentsForGroup={documentsForGroup}
                        selectedDocument={selectedDocument}
                        setSelectedDocument={setSelectedDocument}
                        getCommentaryForSelection={getCommentaryForSelection}
                        setSelectedSection={setSelectedSection}
                    />)}
                </div>
            </div>
        </div>
    );
};

export default DocumentCommentaryList;