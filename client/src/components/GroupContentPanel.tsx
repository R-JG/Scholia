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
    const previousSelectionHadYTranslate = useRef<boolean>(false);
    const translateLeftRemAmount = -20.5;
    const translateDownRemAmount = 27;
    const documentListColumnAmount = 3;
    const selectedDocumentIndex = ((selectedDocument && (selectedDocument.groupId === selectedGroup.id)) 
        ? documentsForGroup.findIndex(document => (document.id === selectedDocument.id)) : null
    );
    
    useEffect(() => {
        if (documentsForGroup.length === 0) return;
        const documentIds: number[] = documentsForGroup.map(document => document.id);
        commentariesService.getAllCommentaryInfoForDocuments(user.token, documentIds)
        .then(commentaries => setAllDocumentCommentaries(commentaries));
    }, []);

    const filterCommentariesByDocument = (commentaries: CommentaryInfo[], documentId: number) => (
        commentaries.filter(commentary => (commentary.documentId === documentId))
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
    
    const getDocumentSelectorTranslateStyle = (documentIndex: number): { translate: string } => {
        const isSelectionIndex = (documentIndex === selectedDocumentIndex);

        const createTranslateStyle = (setY: 'translateY' | 'baseY'): { translate: string } => ({
            translate: 
                `${isSelectionIndex ? ((getGridColumnStart(documentIndex) - 1) * translateLeftRemAmount) : 0}rem 
                 ${(setY === 'translateY') ? translateDownRemAmount : 0}rem`
        });

        if (selectedDocumentIndex === null) return createTranslateStyle('baseY');

        const currentIndexRow = getGridRowStart(documentIndex);
        const selectionRow = getGridRowStart(selectedDocumentIndex);

        if (currentIndexRow === selectionRow) {
            if (rowOfPreviousSelection.current) {
                if (selectionRow === rowOfPreviousSelection.current) {
                    if (previousSelectionHadYTranslate.current) {
                        return createTranslateStyle(isSelectionIndex ? 'baseY' : 'translateY');
                    } else return createTranslateStyle(isSelectionIndex ? 'translateY' : 'baseY');
                };
                if (selectionRow < rowOfPreviousSelection.current) {
                    return createTranslateStyle(isSelectionIndex ? 'baseY' : 'translateY');
                };
                if (selectionRow > rowOfPreviousSelection.current) {
                    // if below and the very last row with only one doc, then a gap will be created above...
                    // I could add an exception for this situation where all docs are translated, which would create a gap at the top...
                    return createTranslateStyle(isSelectionIndex ? 'translateY' : 'baseY');
                };
            } else return createTranslateStyle(isSelectionIndex ? 'baseY' : 'translateY');
        };
        if (currentIndexRow < selectionRow) return createTranslateStyle('baseY');
        if (currentIndexRow > selectionRow) return createTranslateStyle('translateY');
        return createTranslateStyle('baseY');
    };

    const recordSelectionStyleInfo = (gridRow: number, hadYTranslate: boolean) => {
        rowOfPreviousSelection.current = gridRow;
        previousSelectionHadYTranslate.current = hadYTranslate;
    };

    const getDocumentSelectorStyles = (): (GridStyles & { translate: string })[] => {
        const styleArray = documentsForGroup.map((_document, index) => ({
            ...getDocumentSelectorGridStyle(index),
            ...getDocumentSelectorTranslateStyle(index)
        }));
        styleArray.forEach((style, index) => {
            if (index === selectedDocumentIndex) {
                const yTranslateValue = style.translate.split(/\s+/)[1].match(/\d+(?:\.\d)?/);
                const selectionHadYTranslate = (yTranslateValue ? (yTranslateValue[0] !== '0') : false);
                recordSelectionStyleInfo(style.gridRowStart, selectionHadYTranslate);
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