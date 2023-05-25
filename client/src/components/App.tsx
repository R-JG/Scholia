import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { 
    LoggedInUser, Group, GroupDocumentInfo, Commentary, CommentarySection, CommentaryInfo, 
    CommentaryEntry, CommentarySectionEntry, SelectedSection
} from '../typeUtils/types';
import { parseLoggedInUser } from '../typeUtils/validation';
import { homeRoute, dashboardRoute, commentaryToolRoute } from '../config';
import loginService from '../services/loginService';
import groupsService from '../services/groupsService';
import groupDocumentsService from '../services/groupDocumentsService';
import commentariesService from '../services/commentariesService';
import Home from './Home';
import Dashboard from './Dashboard';
import CommentaryTool from './CommentaryTool';
import '../css/App.css';

const App = () => {

    const [user, setUser] = useState<LoggedInUser | null>(null);
    const [userGroups, setUserGroups] = useState<Group[]>([]);
    const [userCommentaries, setUserCommentaries] = useState<CommentaryInfo[]>([]);
    const [groupDocuments, setGroupDocuments] = useState<GroupDocumentInfo[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [selectedDocument, setSelectedDocument] = useState<GroupDocumentInfo | null>(null);
    const [selectedCommentary, setSelectedCommentary] = useState<Commentary | null>(null);
    const [selectedSection, setSelectedSection] = useState<SelectedSection | null>(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (!storedUserData) return;
        const userData: LoggedInUser = parseLoggedInUser(JSON.parse(storedUserData));
        loginService.checkTokenValidity(userData.token).then(tokenIsValid => {
            if (tokenIsValid) {
                setUser(userData);
            } else {
                localStorage.removeItem('user');
            };
        });
    }, []);

    useEffect(() => {
        if (!user) return;
        groupsService.getGroupsByUser(user.token)
        .then(groups => setUserGroups(groups));
        commentariesService.getAllCommentaryInfoByUser(user.token)
        .then(userCommentaryInfo => setUserCommentaries(userCommentaryInfo));
    }, [user]);

    useEffect(() => {
        if (!user || (userGroups.length <= 0)) return;
        const groupIds: number[] = userGroups.map(group => group.id);
        groupDocumentsService.getAllDocumentInfoForGroups(groupIds, user.token)
        .then(groupDocumentInfo => setGroupDocuments(groupDocumentInfo));
    }, [userGroups]);

    const updateUser = (userData: LoggedInUser | null): void => {
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        };
        if (!userData) {
            localStorage.removeItem('user');
        };
        setUser(userData);
    };

    const logout = (): void => {
        updateUser(null);
        setSelectedSection(null);
        setSelectedCommentary(null);
        setSelectedDocument(null);
        setSelectedGroup(null);
        setUserGroups([]);
        setUserCommentaries([]);
        setGroupDocuments([]);
    };

    const createGroup = (groupName: string): void => {
        if (!user) return;
        groupsService.createGroup({ groupName }, user.token)
        .then(createdGroup => {
            if (createdGroup) setUserGroups(userGroups.concat(createdGroup));
        });
    };

    const joinGroup = (groupId: number): void => {
        if (!user) return;
        groupsService.joinGroupById(user.token, groupId)
        .then(joinedGroup => {
            if (!joinedGroup) return;
            setUserGroups(userGroups.concat(joinedGroup));
        });
    };

    const uploadDocument = (document: File, groupId: number): void => {
        if (!user) return;
        groupDocumentsService.addDocument(document, groupId, user.token)
        .then(addedDocumentInfo => {
            if (!addedDocumentInfo) return;
            setGroupDocuments(groupDocuments.concat(addedDocumentInfo));
        });
    };

    const getCommentaryForSelection = (commentaryId: number): void => {
        if (!user) return;
        commentariesService.getCommentaryById(user.token, commentaryId)
        .then(commentary => {
            if (!commentary) return;
            setSelectedCommentary(commentary);
        });
    };

    const createCommentary = async (documentId: number, commentaryName: string): Promise<boolean> => {
        if (!user) return false;
        const commentaryEntry: CommentaryEntry = { documentId, commentaryName };
        const createdCommentary: Commentary | null = await commentariesService
        .createCommentary(user.token, commentaryEntry);
        if (!createdCommentary) return false;
        const createdCommentaryInfo: CommentaryInfo = {
            id: createdCommentary.id, 
            userId: createdCommentary.userId, 
            documentId: createdCommentary.documentId, 
            commentaryName: createdCommentary.commentaryName, 
            author: user.username
        };
        setUserCommentaries(userCommentaries.concat(createdCommentaryInfo))
        setSelectedCommentary(createdCommentary);
        return true;
    };

    const addSectionToSelectedCommentary = async (
            commentaryId: number, pageNumber: number, 
            pageCoordinateTop: number, pageCoordinateBottom: number
        ): Promise<boolean> => {
        if (!user || !selectedCommentary) return false;
        const commentarySectionData: CommentarySectionEntry = {
            pageNumber, pageCoordinateTop, pageCoordinateBottom, text: ''
        };
        const createdSection = await commentariesService.createCommentarySection(
            user.token, commentaryId, commentarySectionData
        );
        if (!createdSection) return false;
        const updatedCommentarySections: CommentarySection[] = selectedCommentary.commentarySections
        .concat(createdSection)
        .sort((a, b) => 
            ((a.pageNumber < b.pageNumber) 
            || ((a.pageNumber === b.pageNumber) 
            && (a.pageCoordinateTop < b.pageCoordinateTop))) ? -1 : 1
        );
        const newSectionIndex: number = updatedCommentarySections.findIndex(section => 
            (section.id === createdSection.id)
        );
        setSelectedCommentary({ 
            ...selectedCommentary, 
            commentarySections: updatedCommentarySections
        });
        setSelectedSection({ data: createdSection, index: newSectionIndex });
        return true;
    };

    const updateSelectedSectionText = (updatedText: string): void => {
        if (!selectedSection) return;
        setSelectedSection({ 
            ...selectedSection, 
            data: { ...selectedSection.data, text: updatedText } 
        });
    }
    
    const saveSectionTextToCommentary = (commentarySection: CommentarySection): void => {
        if (!user || !selectedCommentary) return;
        const { id, commentaryId, ...sectionData } = commentarySection;
        commentariesService.updateCommentarySectionById(user.token, commentaryId, id, sectionData)
        .then(updatedSection => {
            if (!updatedSection) return;
            const updatedCommentarySections: CommentarySection[] = selectedCommentary.commentarySections
            .map(section => (section.id === updatedSection.id) ? updatedSection : section);
            setSelectedCommentary({ 
                ...selectedCommentary, 
                commentarySections: updatedCommentarySections
            });
        });
    };

    const deleteSelectedCommentarySection = (): void => {
        if (!user || !selectedCommentary || !selectedSection) return;
        const sectionId: number = selectedSection.data.id;
        commentariesService.deleteCommentarySectionById(user.token, selectedCommentary.id, sectionId)
        .then(sectionIsDeleted => {
            if (!sectionIsDeleted) return;
            const updatedCommentarySections: CommentarySection[] = selectedCommentary.commentarySections
            .filter(section => (section.id !== sectionId));
            setSelectedCommentary({
                ...selectedCommentary,
                commentarySections: updatedCommentarySections
            });
            setSelectedSection(null);
        });
    };

    return (
        <div className='App'>
            <BrowserRouter>
                <Routes>
                    <Route path={homeRoute} element={
                        (user) 
                        ? <Navigate replace to={dashboardRoute} /> 
                        : <Home 
                            user={user}
                            updateUser={updateUser}
                            logout={logout}
                        />
                    } />
                    <Route path={dashboardRoute} element={
                        (user) 
                        ? <Dashboard 
                            user={user} 
                            userGroups={userGroups}
                            userCommentaries={userCommentaries}
                            selectedDocument={selectedDocument}
                            selectedCommentary={selectedCommentary}
                            selectedSection={selectedSection}
                            selectedGroup={selectedGroup}
                            groupDocuments={groupDocuments}
                            logout={logout}
                            createGroup={createGroup}
                            joinGroup={joinGroup}
                            createCommentary={createCommentary}
                            setSelectedGroup={setSelectedGroup}
                            setSelectedDocument={setSelectedDocument}
                            uploadDocument={uploadDocument}
                            getCommentaryForSelection={getCommentaryForSelection}
                            setSelectedCommentary={setSelectedCommentary}
                            setSelectedSection={setSelectedSection}
                        /> 
                        : <Navigate replace to={homeRoute} />
                    } />
                    <Route path={commentaryToolRoute} element={
                        (selectedDocument) 
                        ? <CommentaryTool 
                            user={user}
                            selectedDocument={selectedDocument}
                            selectedCommentary={selectedCommentary}
                            selectedSection={selectedSection}
                            setSelectedCommentary={setSelectedCommentary}
                            setSelectedSection={setSelectedSection}
                            addSectionToSelectedCommentary={addSectionToSelectedCommentary}
                            deleteSelectedCommentarySection={deleteSelectedCommentarySection}
                            updateSelectedSectionText={updateSelectedSectionText}
                            saveSectionTextToCommentary={saveSectionTextToCommentary}
                        /> 
                        : <Navigate replace to={dashboardRoute} />
                    } />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;