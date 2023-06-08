import { useState, useEffect, useRef } from 'react';
import { 
    LoggedInUser, Group, GroupDocumentInfo, Commentary, SelectedSection, CommentaryInfo 
} from '../typeUtils/types';
import commentariesService from '../services/commentariesService';
import DocumentUploadForm from './DocumentUploadForm';
import DocumentSelector from './DocumentSelector';
import '../css/GroupContentPanel.css';

interface GridStyle { 
    gridColumnStart: number, 
    gridColumnEnd: number, 
    gridRowStart: number, 
    gridRowEnd: number
};
interface TranslateStyle { translate: string };
interface DocumentSelectorStyle extends GridStyle, TranslateStyle {};

interface Props {
    user: LoggedInUser | null,
    group: Group, 
    displayStyle: { display: string }, 
    userCommentaries: CommentaryInfo[], 
    allDocumentsForGroups: GroupDocumentInfo[], 
    selectedGroup: Group | null, 
    selectedDocument: GroupDocumentInfo | null, 
    selectedCommentary: Commentary | null,
    selectedSection: SelectedSection | null,
    setAllDocumentsForGroups: (groupDocuments: GroupDocumentInfo[]) => void, 
    setSelectedDocument: (documentInfo: GroupDocumentInfo) => void,
    createCommentary: (documentId: number, commentaryName: string) => Promise<boolean>, 
    getCommentaryForSelection: (commentaryId: number) => void, 
    setSelectedCommentary: (commentary: Commentary | null) => void, 
    setSelectedSection: (section: SelectedSection | null) => void
};

const GroupContentPanel = ({ 
    user,
    group, 
    displayStyle, 
    userCommentaries, 
    allDocumentsForGroups, 
    selectedGroup, 
    selectedDocument, 
    selectedCommentary,
    selectedSection, 
    setAllDocumentsForGroups, 
    setSelectedDocument,
    createCommentary, 
    getCommentaryForSelection, 
    setSelectedCommentary, 
    setSelectedSection
    }: Props) => {
    
    if (!user) return <div className='GroupContentPanel inactive'></div>;

    const [documentsForGroup, setDocumentsForGroup] = useState<GroupDocumentInfo[]>([]);
    const [allDocumentCommentaries, setAllDocumentCommentaries] = useState<CommentaryInfo[]>([]);
    const [previousSelectionRow, setPreviousSelectionRow] = useState<number | null>(null);
    const [previousSelectionHadYTranslate, setPreviousSelectionHadYTranslate] = useState<boolean>(false);
    const [documentSelectorStyles, setDocumentSelectorStyles] = useState<DocumentSelectorStyle[]>([]);

    const documentListRef = useRef<HTMLDivElement>(null);

    const gridColumnAmount = 3;
    const gridColumnRemSize = 17;
    const gridRowRemSize = 23.5;
    const gridGapRemSize = 2;

    useEffect(() => {
        if (previousSelectionRow) setPreviousSelectionRow(null);
        if (previousSelectionHadYTranslate) setPreviousSelectionHadYTranslate(false);
    }, [selectedGroup]);

    useEffect(() => {
        setDocumentsForGroup(allDocumentsForGroups
        .filter(document => (document.groupId === group.id)));
    }, [allDocumentsForGroups]);

    useEffect(() => {
        if (documentsForGroup.length === 0) return;
        const documentIds: number[] = documentsForGroup.map(document => document.id);
        commentariesService.getAllCommentaryInfoForDocuments(user.token, documentIds)
        .then(commentaries => setAllDocumentCommentaries(commentaries));
    }, [documentsForGroup]);

    useEffect(() => {
        const selectedDocumentIndex = ((selectedDocument && selectedGroup && 
            (selectedDocument.groupId === selectedGroup.id)) ? documentsForGroup
            .findIndex(document => (document.id === selectedDocument.id)) : null
        );
        setDocumentSelectorStyles(getDocumentSelectorStyles(selectedDocumentIndex));
    }, [documentsForGroup, selectedDocument]);

    const filterCommentariesByDocument = (
            commentaries: CommentaryInfo[], documentId: number
        ): CommentaryInfo[] => (
        commentaries.filter(commentary => (commentary.documentId === documentId))
    );

    const getGridColumnStart = (index: number): number => ((index % gridColumnAmount) + 1);

    const getGridRowStart = (index: number): number => Math.ceil((index + 1) / gridColumnAmount);

    const getDocumentSelectorGridStyle = (documentIndex: number): GridStyle => {
        const gridColumnStart = getGridColumnStart(documentIndex);
        const gridColumnEnd = (gridColumnStart + 1);
        const gridRowStart = getGridRowStart(documentIndex);
        const gridRowEnd = (gridRowStart + 1);
        return { gridColumnStart, gridColumnEnd, gridRowStart, gridRowEnd };
    };
    
    const getDocumentSelectorTranslateStyle = (
            documentIndex: number, selectedDocumentIndex: number | null
        ): TranslateStyle => {
        const isSelectionIndex = (documentIndex === selectedDocumentIndex);
        const createTranslateStyle = (setY: 'translateY' | 'baseY'): TranslateStyle => ({
            translate: 
                `${isSelectionIndex ? ((getGridColumnStart(documentIndex) - 1) 
                    * (-(gridColumnRemSize + gridGapRemSize))) : 0}rem 
                 ${(setY === 'translateY') ? (gridRowRemSize + gridGapRemSize) : 0}rem`
        });
        if (selectedDocumentIndex === null) return createTranslateStyle('baseY');
        if ((documentIndex === (documentsForGroup.length - 1)) && isSelectionIndex
            && (getGridColumnStart(documentIndex) === 1)) {
            return createTranslateStyle('baseY');
        };
        const currentIndexRow = getGridRowStart(documentIndex);
        const selectionRow = getGridRowStart(selectedDocumentIndex);
        if (currentIndexRow === selectionRow) {
            if (previousSelectionRow) {
                if (selectionRow === previousSelectionRow) {
                    if (previousSelectionHadYTranslate) {
                        return createTranslateStyle(isSelectionIndex ? 'baseY' : 'translateY');
                    } else return createTranslateStyle(isSelectionIndex ? 'translateY' : 'baseY');
                };
                if (selectionRow < previousSelectionRow) {
                    return createTranslateStyle(isSelectionIndex ? 'baseY' : 'translateY');
                };
                if (selectionRow > previousSelectionRow) {
                    return createTranslateStyle(isSelectionIndex ? 'translateY' : 'baseY');
                };
            } else return createTranslateStyle(isSelectionIndex ? 'baseY' : 'translateY');
        };
        if (currentIndexRow < selectionRow) return createTranslateStyle('baseY');
        if (currentIndexRow > selectionRow) return createTranslateStyle('translateY');
        return createTranslateStyle('baseY');
    };

    const recordSelectionStyleInfo = (gridRow: number, hasYTranslate: boolean): void => {
        setPreviousSelectionRow(gridRow);
        setPreviousSelectionHadYTranslate(hasYTranslate);
    };

    const getDocumentSelectorStyles = (selectedDocumentIndex: number | null): DocumentSelectorStyle[] => {
        const styleArray = documentsForGroup.map((_document, index) => ({
            ...getDocumentSelectorGridStyle(index),
            ...getDocumentSelectorTranslateStyle(index, selectedDocumentIndex)
        }));
        styleArray.forEach((style, index) => {
            if (index === selectedDocumentIndex) {
                const yTranslateValue = style.translate.split(/\s+/)[1].match(/(?:\.)?\d+(?:\.\d+)?/);
                const selectionHadYTranslate = (yTranslateValue ? (yTranslateValue[0] !== '0') : false);
                recordSelectionStyleInfo(style.gridRowStart, selectionHadYTranslate);
            };
        });
        return styleArray;
    };

    return (
        <div className='GroupContentPanel' style={displayStyle}>
            <div className='GroupContentPanel--group-documents-section'>
                <DocumentUploadForm 
                    user={user}
                    allDocumentsForGroups={allDocumentsForGroups}
                    selectedGroup={selectedGroup}
                    setAllDocumentsForGroups={setAllDocumentsForGroups}
                    setSelectedDocument={setSelectedDocument}
                />
                <div 
                    className='GroupContentPanel--group-documents-list' 
                    ref={documentListRef}
                    style={{ 
                        gridAutoColumns: `${gridColumnRemSize}rem`, 
                        gridAutoRows: `${gridRowRemSize}rem`, 
                        gap: `${gridGapRemSize}rem` 
                    }}>
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