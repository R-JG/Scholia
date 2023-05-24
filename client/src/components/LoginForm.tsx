import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoggedInUser } from '../typeUtils/types';
import { dashboardRoute } from '../config';
import usersService from '../services/usersService';
import loginService from '../services/loginService';
import '../css/LoginForm.css';

interface Props {
    updateUser: (userData: LoggedInUser | null) => void
};

const LoginForm = ({
    updateUser
    }: Props) => {

    const [formMode, setFormMode] = useState<'login' | 'create'>('login');
    const [promptMessage, setPromptMessage] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<{ username: string, password: string }>({ 
        username: '', password: '' 
    });

    const navigate = useNavigate();

    const createUser = (username: string, password: string): void => {
        usersService.createUser({ username, password })
        .then(result => {
            if (result) {
                setPromptMessage(`User ${result.username} successfully created`);
            } else {
                setPromptMessage('Account creation unsuccessful');
            };
        });
    };

    const login = (username: string, password: string): void => {
        loginService.login({ username, password })
        .then(loggedInUser => {
            if (loggedInUser) {
                updateUser(loggedInUser);
                navigate(dashboardRoute);
            } else {
                setPromptMessage('Login unsuccessful');
            };
        });
    };

    const updateFormValues = (key: string, value: string): void => {
        setFormValues({ ...formValues, [key]: value });
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.currentTarget;
        updateFormValues(name, value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>):void => {
        e.preventDefault();
        if ((formValues.username === '') || (formValues.password === '')) return;
        if (formMode === 'login') login(formValues.username, formValues.password);
        if (formMode === 'create') createUser(formValues.username, formValues.password);
        setFormValues({ username: '', password: '' });
    };

    const handleFormModeButton = (): void => {
        (formMode === 'login') ? setFormMode('create') : setFormMode('login');
    };

    const handleClosePromptButton = (): void => setPromptMessage(null);

    return (
        <form className='LoginForm' onSubmit={handleSubmit}>
            {(formMode === 'create') && 
            <button 
                className='LoginForm--form-mode-button--login'
                type='button' 
                onClick={handleFormModeButton}> 
                🡄
            </button>}
            <h1 className='LoginForm--title'>
                {(formMode === 'login') ? 'Login' : 'Create Account'}
            </h1>
            {(formMode === 'login') && 
            <button 
                className='LoginForm--form-mode-button--create'
                type='button' 
                onClick={handleFormModeButton}> 
                Create Account
            </button>}
            <label 
                className='LoginForm--username-label' 
                htmlFor='LoginForm--username-input'
            >Username
            </label>
            <input 
                id='LoginForm--username-input' 
                className='LoginForm--username-input'
                name='username' 
                type='text' 
                value={formValues.username}
                onChange={handleInputChange}
            />
            <label 
                className='LoginForm--password-label' 
                htmlFor='LoginForm--password-input'
            >Password
            </label>
            <input 
                id='LoginForm--password-input' 
                className='LoginForm--password-input'
                name='password' 
                type='password' 
                value={formValues.password}
                onChange={handleInputChange}
            />
            <button className='LoginForm--submit-button'>
                Enter
            </button>
            {promptMessage && 
            <div className='LoginForm--prompt-message'>
                <button 
                    className='LoginForm--close-prompt-button'
                    type='button'
                    onClick={handleClosePromptButton}>
                    ×
                </button>
                <h4 className='LoginForm--prompt-message-text'>
                    {promptMessage}
                </h4>
            </div>}
        </form>
    );
};

export default LoginForm;