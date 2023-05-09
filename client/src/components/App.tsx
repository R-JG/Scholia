import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoggedInUser, Group, GroupDocumentInfo, Commentary, PageSelectionCoordinates, CommentarySection } from '../typeUtils/types';
import { parseLoggedInUser } from '../typeUtils/validation';
import { homeRoute, dashboardRoute, commentaryToolRoute } from '../routesConfig';
import loginService from '../services/loginService';
import groupsService from '../services/groupsService';
import groupDocumentsService from '../services/groupDocumentsService';
import Home from './Home';
import Dashboard from './Dashboard';
import CommentaryTool from './CommentaryTool';
import '../css/App.css';

const App = () => {

    const [user, setUser] = useState<LoggedInUser | null>(null);
    const [userGroups, setUserGroups] = useState<Group[]>([]);
    const [groupDocuments, setGroupDocuments] = useState<GroupDocumentInfo[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [selectedDocument, setSelectedDocument] = useState<GroupDocumentInfo | null>(null);
    const [selectedCommentary, setSelectedCommentary] = useState<Commentary | null>(
        {
            id: 1,
            userId: 1,
            name: 'test',
            commentarySections: { body: [] }
        }
    );

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
            return groupDocumentsService.getAllDocumentsForGroups(groupIds, user.token);
        }).then(groupDocuments => setGroupDocuments(groupDocuments));
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

    const addSectionToSelectedCommentary = (coordinates: PageSelectionCoordinates): void => {
        if (!selectedCommentary) return;
        const updatedCommentaryBody: CommentarySection[] = selectedCommentary.commentarySections.body
        .concat(
            { coordinates, text: '' }
        ).sort((a, b) => 
            ((a.coordinates.pageNumber < b.coordinates.pageNumber) 
            || ((a.coordinates.pageNumber === b.coordinates.pageNumber) 
            && (a.coordinates.yTop < b.coordinates.yTop))) ? -1 : 1
        );
        setSelectedCommentary({ 
            ...selectedCommentary, 
            commentarySections: {
                ...selectedCommentary.commentarySections,
                body: updatedCommentaryBody
            }
        });
    };
    /*
    const updateSelectedCommentaryText = (text: string, sectionIndex: number): void => {
        if (!selectedCommentary) return;
        const updatedCommentaryBody: CommentarySection[] = selectedCommentary.commentarySections.body
        .map((section, index) => 
            (index === sectionIndex) ? { ...section, text } : section
        );
        setSelectedCommentary({ 
            ...selectedCommentary, 
            commentarySections: {
                ...selectedCommentary.commentarySections,
                body: updatedCommentaryBody
            }
        });
    };
    */

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