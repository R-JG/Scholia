import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserToken } from '../typeUtils/types';
import { dashboardRoute } from '../routesConfig';
import usersService from '../services/usersService';
import loginService from '../services/loginService';
import '../css/LoginForm.css';

interface Props {
    updateUser: (userData: UserToken | null) => void
};

const LoginForm = ({
    updateUser
}: Props) => {

    const [formMode, setFormMode] = useState<'login' | 'create'>('login');
    const [formValues, setFormValues] = useState<{ username: string, password: string }>({ 
        username: '', password: '' 
    });

    const navigate = useNavigate();

    const createUser = (username: string, password: string): void => {
        usersService.createUser({ username, password });
    };

    const login = (username: string, password: string): void => {
        loginService.login({ username, password }).then(userToken => {
            updateUser(userToken);
            navigate(dashboardRoute);
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

    return (
        <form className='LoginForm' onSubmit={handleSubmit}>
            <h1 className='login-form--title'>
                {(formMode === 'login') ? 'Login' : 'Create Account'}
            </h1>
            <button 
                className='login-form--mode-button'
                type='button' 
                onClick={handleFormModeButton}
            > {(formMode === 'login') ? 'Create Account' : 'Login'}
            </button>
            <label 
                className='login-form--username-label' 
                htmlFor='login-form--username-input'
            >Username
            </label>
            <input 
                id='login-form--username-input' 
                name='username' 
                type='text' 
                value={formValues.username}
                onChange={handleInputChange}
            />
            <label 
                className='login-form--password-label' 
                htmlFor='login-form--password-input'
            >Password
            </label>
            <input 
                id='login-form--password-input' 
                name='password' 
                type='password' 
                value={formValues.password}
                onChange={handleInputChange}
            />
            <button className='login-form--submit-button'>
                Enter
            </button>
        </form>
    );
};

export default LoginForm;