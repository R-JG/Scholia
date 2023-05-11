import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { 
    LoggedInUser, Group, GroupDocumentInfo, Commentary, CommentarySection, CommentaryInfo, 
    CommentaryEntry, CommentarySectionEntry, SelectedSection
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
        .then(groups => {
            setUserGroups(groups);
            const groupIds: number[] = groups.map(group => group.id);
            return groupDocumentsService.getAllDocumentInfoForGroups(groupIds, user.token);
        }).then(groupDocumentInfo => setGroupDocuments(groupDocumentInfo));
        commentariesService.getAllCommentaryInfoByUser(user.token)
        .then(userCommentaryInfo => setUserCommentaries(userCommentaryInfo));
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
            commentaryId: number, pageNumber: number, 
            pageCoordinateTop: number, pageCoordinateBottom: number
        ): void => {
        if (!user || !selectedCommentary) return;
        const commentarySectionData: CommentarySectionEntry = {
            pageNumber, pageCoordinateTop, pageCoordinateBottom, text: ''
        };
        commentariesService.createCommentarySection(user.token, commentaryId, commentarySectionData)
        .then(createdSection => {
            if (!createdSection) return;
            const newSectionIndex: number = 1 + selectedCommentary.commentarySections.findIndex(section => 
                ((section.pageNumber < createdSection.pageNumber) 
                || ((section.pageNumber === createdSection.pageNumber) 
                && (section.pageCoordinateTop < createdSection.pageCoordinateTop)))
            );
            const updatedCommentarySections: CommentarySection[] = selectedCommentary.commentarySections
            .reduce((acc: CommentarySection[], section: CommentarySection, index: number) => {
                if (index === newSectionIndex) return acc.concat(createdSection, section);
                return acc.concat(section);
            }, []);
            setSelectedCommentary({ 
                ...selectedCommentary, 
                commentarySections: updatedCommentarySections
            });
            setSelectedSection({ data: createdSection, index: newSectionIndex });
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
                            selectedSection={selectedSection}
                            setSelectedSection={setSelectedSection}
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