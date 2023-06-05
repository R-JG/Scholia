import { useState, useEffect, useRef } from 'react';
import { 
    LoggedInUser, Group, GroupDocumentInfo, Commentary, SelectedSection, CommentaryInfo 
} from '../typeUtils/types';
import commentariesService from '../services/commentariesService';
import DocumentUploadForm from './DocumentUploadForm';
import DocumentSelector from './DocumentSelector';
import '../css/GroupContentPanel.css';

interface GridStyles { 
    gridColumnStart: number, 
    gridColumnEnd: number, 
    gridRowStart: number, 
    gridRowEnd: number
};

interface Props {
    user: LoggedInUser | null,
    userCommentaries: CommentaryInfo[], 
    groupDocuments: GroupDocumentInfo[], 
    selectedGroup: Group | null, 
    documentsForGroup: GroupDocumentInfo[],
    selectedDocument: GroupDocumentInfo | null, 
    selectedCommentary: Commentary | null,
    selectedSection: SelectedSection | null,
    setGroupDocuments: (groupDocuments: GroupDocumentInfo[]) => void, 
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void,
    createCommentary: (documentId: number, commentaryName: string) => Promise<boolean>, 
    getCommentaryForSelection: (commentaryId: number) => void, 
    setSelectedCommentary: (commentary: Commentary | null) => void, 
    setSelectedSection: (section: SelectedSection | null) => void
};

const GroupContentPanel = ({ 
    user,
    userCommentaries, 
    groupDocuments, 
    selectedGroup, 
    documentsForGroup, 
    selectedDocument, 
    selectedCommentary,
    selectedSection, 
    setGroupDocuments, 
    setSelectedDocument,
    createCommentary, 
    getCommentaryForSelection, 
    setSelectedCommentary, 
    setSelectedSection
    }: Props) => {
    
    if (!user || !selectedGroup) return <div className='GroupContentPanel inactive'></div>;

    const [allDocumentCommentaries, setAllDocumentCommentaries] = useState<CommentaryInfo[]>([]);

    const documentListRef = useRef<HTMLDivElement>(null);
    const rowOfPreviousSelection = useRef<number | null>(null);
    const previousSelectionWasTranslated = useRef<boolean>(false);
    
    const documentListColumnAmount = 3;
    /*
    const selectedDocumentIndex = ((selectedDocument && (selectedDocument.groupId === selectedGroup.id)) 
        ? documentsForGroup.findIndex(document => (document.id === selectedDocument.id)) : null
    );
    */
    
    useEffect(() => {
        if (documentsForGroup.length === 0) return;
        const documentIds: number[] = documentsForGroup.map(document => document.id);
        commentariesService.getAllCommentaryInfoForDocuments(user.token, documentIds)
        .then(commentaries => setAllDocumentCommentaries(commentaries));
    }, []);

    const filterCommentariesByDocument = (commentaries: CommentaryInfo[], documentId: number) => (
        commentaries.filter(commentary => (commentary.documentId === documentId))
    );
    
    const getSelectedDocumentIndex = () => (
        (selectedDocument && (selectedDocument.groupId === selectedGroup.id)) 
        ? documentsForGroup.findIndex(document => (document.id === selectedDocument.id)) : null
    );

    const getGridColumnStart = (index: number): number => ((index % documentListColumnAmount) + 1);

    const getGridRowStart = (index: number): number => Math.ceil((index + 1) / documentListColumnAmount);

    const getDocumentSelectorGridStyle = (documentIndex: number): GridStyles => {
        const gridColumnStart = getGridColumnStart(documentIndex);
        const gridColumnEnd = (gridColumnStart + 1);
        const gridRowStart = getGridRowStart(documentIndex);
        const gridRowEnd = (gridRowStart + 1);
        return { gridColumnStart, gridColumnEnd, gridRowStart, gridRowEnd };
    };
    
    const getDocumentSelectorPositionStyle = (documentIndex: number): { translate: string } => {

        const normalPosition = { translate: 'none' };
        const translatedPosition = { translate: '0 27rem' };

        const selectedDocumentIndex = getSelectedDocumentIndex();

        if (selectedDocumentIndex === null) return normalPosition;

        const currentIndexRow = getGridRowStart(documentIndex);
        const selectionRow = getGridRowStart(selectedDocumentIndex);

        const isSelectionIndex = (documentIndex === selectedDocumentIndex);

        /*
        const translateLeftRemAmount = -20.5;
        const translateDownRemAmount = 27;

        const createTranslateStyle = (setY: 'translateY' | 'resetY'): { translate: string } => ({
            translate: 
                `${isSelectionIndex ? ((getGridColumnStart(documentIndex) - 1) * translateLeftRemAmount) : 0}rem 
                 ${(setY === 'translateY') ? translateDownRemAmount : 0}rem`
        });
        */

        if (currentIndexRow === selectionRow) {
            if (rowOfPreviousSelection.current) {
                if (selectionRow === rowOfPreviousSelection.current) {
                    if (previousSelectionWasTranslated.current) {
                        return isSelectionIndex ? normalPosition : translatedPosition;
                    } else return isSelectionIndex ? translatedPosition : normalPosition;
                };
                if (selectionRow < rowOfPreviousSelection.current) {
                    return isSelectionIndex ? normalPosition : translatedPosition;
                };
                if (selectionRow > rowOfPreviousSelection.current) {
                    // if below and the very last row with only one doc, then a gap will be created above...
                    // I could add an exception for this situation where all docs are translated, which would create a gap at the top...
                    return isSelectionIndex ? translatedPosition : normalPosition;
                };
            } else return isSelectionIndex ? normalPosition : translatedPosition;
        };
        if (currentIndexRow < selectionRow) return normalPosition;
        if (currentIndexRow > selectionRow) return translatedPosition;
        return normalPosition;
    };

    const recordSelectionStyleInfo = (gridRow: number, wasTranslated: boolean) => {
        rowOfPreviousSelection.current = gridRow;
        previousSelectionWasTranslated.current = wasTranslated;
    };

    const getDocumentSelectorStyles = (): (GridStyles & { translate: string })[] => {
        const styleArray = documentsForGroup.map((_document, index) => ({
            ...getDocumentSelectorGridStyle(index),
            ...getDocumentSelectorPositionStyle(index)
        }));
        const selectedDocumentIndex = getSelectedDocumentIndex();
        styleArray.forEach((style, index) => {
            if (index === selectedDocumentIndex) {
                recordSelectionStyleInfo(style.gridRowStart, (style.translate !== 'none'));
            };
        });
        return styleArray;
    };

    const documentSelectorStyles = getDocumentSelectorStyles();

    return (
        <div className='GroupContentPanel'>
            <div className='GroupContentPanel--group-documents-section'>
                <DocumentUploadForm 
                    user={user}
                    groupDocuments={groupDocuments}
                    selectedGroup={selectedGroup}
                    setGroupDocuments={setGroupDocuments}
                    setSelectedDocument={setSelectedDocument}
                />
                <div className='GroupContentPanel--group-documents-list' ref={documentListRef}>
                    {documentsForGroup.map((documentInfo, index) => 
                    <DocumentSelector 
                        key={documentInfo.id}
                        user={user}
                        documentInfo={documentInfo}
                        style={documentSelectorStyles[index]}
                        isSelected={documentInfo.id == selectedDocument?.id}
                        documentsForGroup={documentsForGroup}
                        userCommentariesForDocument={
                            filterCommentariesByDocument(userCommentaries, documentInfo.id)
                        }
                        groupCommentariesForDocument={
                            filterCommentariesByDocument(allDocumentCommentaries, documentInfo.id)
                        }
                        selectedDocument={selectedDocument}
                        selectedCommentary={selectedCommentary}
                        selectedSection={selectedSection}
                        setSelectedDocument={setSelectedDocument}
                        setSelectedCommentary={setSelectedCommentary}
                        setSelectedSection={setSelectedSection}
                        createCommentary={createCommentary}
                        getCommentaryForSelection={getCommentaryForSelection}
                    />)}
                </div>
                {(documentsForGroup.length === 0) && 
                <h4 className='GroupContentPanel--no-documents-message'>
                    This group currently has no documents
                </h4>}
            </div>
        </div>
    );
};

export default GroupContentPanel;