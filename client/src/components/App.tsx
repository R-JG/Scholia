import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { 
    LoggedInUser, Group, GroupDocumentInfo, Commentary, CommentarySection, CommentaryInfo, 
    CommentaryEntry, CommentarySectionEntry, SelectedSection
} from '../typeUtils/types';
import { parseLoggedInUser } from '../typeUtils/validation';
import { indexRoute, dashboardRoute, commentaryToolRoute } from '../config';
import loginService from '../services/loginService';
import groupsService from '../services/groupsService';
import groupDocumentsService from '../services/groupDocumentsService';
import commentariesService from '../services/commentariesService';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import CommentaryTool from './CommentaryTool';
import '../css/App.css';

const App = () => {

    const [user, setUser] = useState<LoggedInUser | null>(null);
    const [userGroups, setUserGroups] = useState<Group[]>([]);
    const [userCommentaries, setUserCommentaries] = useState<CommentaryInfo[]>([]);
    const [allDocumentsForGroups, setAllDocumentsForGroups] = useState<GroupDocumentInfo[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [selectedDocument, setSelectedDocument] = useState<GroupDocumentInfo | null>(null);
    const [selectedCommentary, setSelectedCommentary] = useState<Commentary | null>(null);
    const [selectedSection, setSelectedSection] = useState<SelectedSection | null>(null);
    const [groupStateIsInitialized, setGroupStateIsInitialized] = useState<boolean>(false);

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
        .then(groups => {
            setUserGroups(groups);
            setGroupStateIsInitialized(true);
            if (groups.length > 0) setSelectedGroup(groups[0]);
        });

        commentariesService.getAllCommentaryInfoByUser(user.token)
        .then(userCommentaryInfo => setUserCommentaries(userCommentaryInfo));
    }, [user]);

    useEffect(() => {
        if (!user || (userGroups.length === 0)) return;
        const groupIds: number[] = userGroups.map(group => group.id);
        groupDocumentsService.getAllDocumentInfoForGroups(groupIds, user.token)
        .then(groupDocumentInfo => setAllDocumentsForGroups(groupDocumentInfo));
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
        setAllDocumentsForGroups([]);
        setGroupStateIsInitialized(false);
    };

    const createGroup = (groupName: string): void => {
        if (!user) return;
        groupsService.createGroup({ groupName }, user.token)
        .then(createdGroup => {
            if (!createdGroup) return;
            setUserGroups(userGroups.concat(createdGroup));
            setSelectedGroup(createdGroup);
        });
    };

    const joinGroup = (groupId: number): void => {
        if (!user) return;
        groupsService.joinGroupById(user.token, groupId)
        .then(joinedGroup => {
            if (!joinedGroup) return;
            setUserGroups(userGroups.concat(joinedGroup));
            setSelectedGroup(joinedGroup);
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
                    <Route path={indexRoute} element={
                        (user) 
                        ? <Navigate replace to={dashboardRoute} /> 
                        : <LoginPage 
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
                            groupStateIsInitialized={groupStateIsInitialized}
                            userCommentaries={userCommentaries}
                            selectedDocument={selectedDocument}
                            selectedCommentary={selectedCommentary}
                            selectedSection={selectedSection}
                            selectedGroup={selectedGroup}
                            allDocumentsForGroups={allDocumentsForGroups}
                            logout={logout}
                            createGroup={createGroup}
                            joinGroup={joinGroup}
                            createCommentary={createCommentary}
                            setAllDocumentsForGroups={setAllDocumentsForGroups}
                            setSelectedGroup={setSelectedGroup}
                            setSelectedDocument={setSelectedDocument}
                            getCommentaryForSelection={getCommentaryForSelection}
                            setSelectedCommentary={setSelectedCommentary}
                            setSelectedSection={setSelectedSection}
                        /> 
                        : <Navigate replace to={indexRoute} />
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