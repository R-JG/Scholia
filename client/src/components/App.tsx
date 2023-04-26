import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoggedInUser, Group, GroupDocument, GroupDocumentState } from '../typeUtils/types';
import { parseLoggedInUser } from '../typeUtils/validation';
import { homeRoute, dashboardRoute } from '../routesConfig';
import groupsService from '../services/groupsService';
import groupDocumentsService from '../services/groupDocumentsService';
import Home from './Home';
import Dashboard from './Dashboard';
import '../css/App.css';

const App = () => {

    const [user, setUser] = useState<LoggedInUser | null>(null);
    const [userGroups, setUserGroups] = useState<Group[]>([]);
    const [groupDocuments, setGroupDocuments] = useState<GroupDocumentState>([]);

    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            const userData: LoggedInUser = parseLoggedInUser(JSON.parse(storedUserData));
            setUser(userData);
        };
    }, []);

    useEffect(() => {
        if (!user) return;
        groupsService.getGroupsByUser(user.token)
        .then(groups => {
            setUserGroups(groups);
            const groupIds: number[] = groups.map(group => group.id);
            return groupDocumentsService.getAllDocumentsForGroups(groupIds, user.token);
        }).then(groupDocumentsInfo => console.log(groupDocumentsInfo));
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
            const newGroupDocument: GroupDocument = {
                ...addedDocumentInfo,
                file: document
            };
            setGroupDocuments(groupDocuments.map(group => {
                return (group.groupId === addedDocumentInfo.groupId) 
                    ? { 
                        groupId: group.groupId, 
                        documents: group.documents.concat(newGroupDocument) 
                    } 
                    : group
            }));
            const storageDocuments: string = JSON.stringify(groupDocuments);
            localStorage.setItem('group-documents', storageDocuments);
        });
    };

    console.log(groupDocuments);

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
                            updateUser={updateUser}
                            createGroup={createGroup}
                            uploadDocument={uploadDocument}
                        /> 
                        : <Navigate replace to={homeRoute} />
                    } />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;