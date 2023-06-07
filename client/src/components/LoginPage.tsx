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
            <main className='LoginPage--main'>
                <div className='LoginPage--info-section'>
                    <hr className='LoginPage--paragraph-hr' />
                    <p className='LoginPage--info-paragraph first'>
                        Scholia is a platform for writing commentaries in a collaborative, group based environment.
                    </p>
                    <p className='LoginPage--info-paragraph second'>
                        This project is inspired by the pedagogical tradition of commentary writing, which flourished through the Classical, Medieval, and Early-Modern periods. The aim of Scholia is to reimagine this in the context of contemporary web technology.
                    </p>
                    <p className='LoginPage--info-paragraph third'>
                        In Scholia, all content is centered around groups; documents are uploaded to groups and shared in common among their members. Group members may then create commentaries for these documents, or read those created by other members.
                    </p>
                </div>
                <div className='LoginPage--form-section'>
                    <div className='LoginPage--form-options'>
                        <span className='LoginPage--form-note'>
                            Accounts are for testing purposes only.
                        </span>
                        <span className='LoginPage--form-note'>
                            Please do not include any personal information.
                        </span>
                        <button 
                            className='LoginPage--switch-forms-button'
                            onClick={() => setCreateAccountMode(!createAccountMode)}>
                            {createAccountMode ? 'Return to login' : 'Create account'}
                        </button>
                    </div>
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
            </main>
        </div>
    );
};

export default LoginPage;