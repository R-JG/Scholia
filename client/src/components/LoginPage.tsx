import { useState } from 'react';
import { LoggedInUser } from '../typeUtils/types';
import LoginForm from './LoginForm';
import UserCreationForm from './UserCreationForm';
import Header from './Header';
import '../css/LoginPage.css';

interface Props {
    user: LoggedInUser | null,
    updateUser: (userData: LoggedInUser | null) => void,
    logout: () => void
};

const LoginPage = ({ 
    user, 
    updateUser, 
    logout
    }: Props) => {

    const [mainStatusPrompt, setMainStatusPrompt] = useState<string>('');
    const [createAccountMode, setCreateAccountMode] = useState<boolean>(false);

    return (
        <div className='LoginPage'>
            <Header 
                user={user} 
                logout={logout} 
            />
            <button 
                className='LoginPage--switch-forms-button'
                onClick={() => setCreateAccountMode(!createAccountMode)}>
                {createAccountMode ? 'Return to login' : 'Create account'}
            </button>
            {!user && !createAccountMode && 
            <LoginForm 
                setMainStatusPrompt={setMainStatusPrompt}
                updateUser={updateUser}
            />}
            {createAccountMode && 
            <UserCreationForm 
                setCreateAccountMode={setCreateAccountMode}
                setMainStatusPrompt={setMainStatusPrompt}
            />}
            {mainStatusPrompt && 
            <div className='LoginPage--prompt'>
                <h4 className='LoginPage--prompt-text'>
                    {mainStatusPrompt}
                </h4>
                <button 
                    className='LoginPage--close-prompt-button'
                    onClick={() => setMainStatusPrompt('')}>
                    🞪
                </button>
            </div>}
        </div>
    );
};

export default LoginPage;