import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserToken } from '../typeUtils/types';
import { homeRoute, dashboardRoute } from '../routesConfig';
import Home from './Home';
import Dashboard from './Dashboard';
import '../css/App.css';

const App = () => {

    const [user, setUser] = useState<UserToken | null>(null);

    console.log(user);

    return (
        <div className='App'>
            <BrowserRouter>
                <Routes>
                    <Route path={homeRoute} element={
                        <Home 
                            user={user}
                            setUser={setUser}
                        />
                    } />
                    <Route path={dashboardRoute} element={
                        (user) ? <Dashboard /> : <Navigate replace to={homeRoute} />
                    } />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;