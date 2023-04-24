import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoggedInUser, Group, GroupDocument, GroupDocumentInfo } from '../typeUtils/types';
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
    const [documents, setDocuments] = useState<(GroupDocument | GroupDocumentInfo)[]>([]);

    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            const userData: LoggedInUser = parseLoggedInUser(JSON.parse(storedUserData));
            setUser(userData);
        };
    }, []);

    useEffect(() => {
        if (!user) return;
        groupsService.getGroupsByUser(user.token).then(groups => 
            setUserGroups(groups)
        );
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
        groupDocumentsService.addDocument(document, groupId, user.token).then(addedDocument => {
            if (!addedDocument) return;
            const groupDocument: GroupDocument = {
                ...addedDocument,
                file: document
            };
            setDocuments(documents.concat(groupDocument));
            localStorage.setItem('documents', JSON.stringify(documents));
        });
    };

    console.log(documents);

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