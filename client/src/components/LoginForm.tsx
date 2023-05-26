import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoggedInUser } from '../typeUtils/types';
import { dashboardRoute } from '../config';
import loginService from '../services/loginService';
import '../css/LoginForm.css';

interface Props {
    setMainStatusPrompt: (message: string) => void, 
    updateUser: (userData: LoggedInUser | null) => void
};

const LoginForm = ({
    setMainStatusPrompt, 
    updateUser
    }: Props) => {

    const [formValues, setFormValues] = useState({ username: '', password: '' });

    const navigate = useNavigate();

    const login = (username: string, password: string): void => {
        loginService.login({ username, password })
        .then(loggedInUser => {
            if (loggedInUser) {
                updateUser(loggedInUser);
                navigate(dashboardRoute);
            } else {
                setMainStatusPrompt('Login unsuccessful');
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

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if ((formValues.username === '') || (formValues.password === '')) return;
        login(formValues.username, formValues.password);
        setFormValues({ username: '', password: '' });
    };

    return (
        <form className='LoginForm' onSubmit={handleSubmit}>
            <h1 className='LoginForm--title'>Login</h1>
            <label 
                className='LoginForm--username-label' 
                htmlFor='LoginForm--username-input'>
                Username
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
                htmlFor='LoginForm--password-input'>
                Password
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
        </form>
    );
};

export default LoginForm;