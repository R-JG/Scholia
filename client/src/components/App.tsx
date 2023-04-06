import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserToken } from '../typeUtils/types';
import Home from './Home';
import Dashboard from './Dashboard';

const App = () => {

    const [user, setUser] = useState<UserToken | null>(null);

    console.log(user);

    return (
        <BrowserRouter>
            <div className='App'>
                <Routes>
                    <Route path='/' element={
                        <Home setUser={setUser} />
                    } />
                    <Route path='/dashboard' element={
                        <Dashboard />
                    } />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;