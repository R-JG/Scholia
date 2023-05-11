import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { 
    LoggedInUser, Group, GroupDocumentInfo, Commentary, CommentarySection, CommentaryInfo, CommentaryEntry, CommentarySectionEntry 
} from '../typeUtils/types';
import { parseLoggedInUser } from '../typeUtils/validation';
import { homeRoute, dashboardRoute, commentaryToolRoute } from '../routesConfig';
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
            const groupIds: number[] = groups.map(group => group.id);
            return groupDocumentsService.getAllDocumentInfoForGroups(groupIds, user.token);
        }).then(groupDocumentInfo => setGroupDocuments(groupDocumentInfo));
    }, [user]);

    const updateUser = (userData: LoggedInUser | null): void => {
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        };
        if (!userData) {
            localStorage.removeItem('user');
        };
        setUser(userData);
    };

    const createGroup = (groupName: string): void => {
        if (!user) return;
        groupsService.createGroup({ groupName }, user.token).then(createdGroup => {
            if (createdGroup) setUserGroups(userGroups.concat(createdGroup));
        });
    };

    const uploadDocument = (document: File, groupId: number): void => {
        if (!user) return;
        groupDocumentsService.addDocument(document, groupId, user.token).then(addedDocumentInfo => {
            if (!addedDocumentInfo) return;
            setGroupDocuments(groupDocuments.concat(addedDocumentInfo));
        });
    };

    const createCommentary = (documentId: number, commentaryName: string): void => {
        if (!user) return;
        const commentaryEntry: CommentaryEntry = { documentId, commentaryName };
        commentariesService.createCommentary(user.token, commentaryEntry)
        .then(createdCommentary => {
            if (!createdCommentary) return;
            const createdCommentaryInfo: CommentaryInfo = {
                id: createdCommentary.id,
                userId: createdCommentary.userId,
                documentId: createdCommentary.documentId,
                commentaryName: createdCommentary.commentaryName
            };
            setUserCommentaries(userCommentaries.concat(createdCommentaryInfo))
            setSelectedCommentary(createdCommentary);
        });
    };

    const addSectionToSelectedCommentary = (
            commentaryId: number, 
            pageNumber: number, 
            pageCoordinateTop: number, 
            pageCoordinateBottom: number
        ): void => {
        if (!user || !selectedCommentary) return;
        const commentarySectionData: CommentarySectionEntry = {
            pageNumber, pageCoordinateTop, pageCoordinateBottom, text: ''
        };
        commentariesService.createCommentarySection(user.token, commentaryId, commentarySectionData)
        .then(createdSection => {
            if (!createdSection) return;
            const updatedCommentarySections: CommentarySection[] = selectedCommentary.commentarySections
            .concat(createdSection).sort((a, b) => 
                ((a.pageNumber < b.pageNumber) || ((a.pageNumber === b.pageNumber) 
                && (a.pageCoordinateTop < b.pageCoordinateTop))) ? -1 : 1
            );
            setSelectedCommentary({ 
                ...selectedCommentary, 
                commentarySections: updatedCommentarySections
            });
        });
    };
    
    const updateCommentarySectionText = (commentarySection: CommentarySection): void => {
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

    return (
        <div className='App'>
            <BrowserRouter>
                <Routes>
                    <Route path={homeRoute} element={
                        <Home 
                            user={user}
                            updateUser={updateUser}
                        />
                    } />
                    <Route path={dashboardRoute} element={
                        (user) 
                        ? <Dashboard 
                            user={user} 
                            userGroups={userGroups}
                            selectedGroup={selectedGroup}
                            groupDocuments={groupDocuments}
                            updateUser={updateUser}
                            createGroup={createGroup}
                            setSelectedGroup={setSelectedGroup}
                            setSelectedDocument={setSelectedDocument}
                            uploadDocument={uploadDocument}
                        /> 
                        : <Navigate replace to={homeRoute} />
                    } />
                    <Route path={commentaryToolRoute} element={
                        (selectedDocument) 
                        ? <CommentaryTool 
                            user={user}
                            selectedDocument={selectedDocument}
                            selectedCommentary={selectedCommentary}
                            createCommentary={createCommentary}
                            addSectionToSelectedCommentary={addSectionToSelectedCommentary}
                        /> 
                        : <Navigate replace to={dashboardRoute} />
                    } />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;