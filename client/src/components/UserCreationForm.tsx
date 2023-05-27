import { useState, useEffect, FormEvent } from 'react';
import { debounceMilliseconds } from '../config';
import usersService from '../services/usersService';
import '../css/UserCreationForm.css';

interface Props {
    setMainStatusPrompt: (message: string) => void
};

const UserCreationForm = ({ setMainStatusPrompt }: Props) => {

    const [usernameStatusPrompt, setUsernameStatusPrompt] = useState<string>('');
    const [passwordStatusPrompt, setPasswordStatusPrompt] = useState<string>('');
    const [usernameInput, setUsernameInput] = useState<string>('');
    const [passwordInput, setPasswordInput] = useState<string>('');
    const [passwordCheckInput, setPasswordCheckInput] = useState<string>('');

    useEffect(() => {
        if (!usernameInput) {
            if (usernameStatusPrompt) setUsernameStatusPrompt('');
            return;
        };
        const checkIfUsernameIsTaken = () => {
            usersService.checkIfUserExists(usernameInput).then(usernameIsTaken => {
                const promptMessage: string = (usernameIsTaken) 
                ? 'username is taken' : 'username is available';
                setUsernameStatusPrompt(promptMessage);
            });
        };
        const checkDebounce: number = setTimeout(checkIfUsernameIsTaken, debounceMilliseconds);
        return () => clearTimeout(checkDebounce);
    }, [usernameInput]);

    const createUser = (username: string, password: string): void => {
        usersService.createUser({ username, password })
        .then(result => {
            if (result) {
                setMainStatusPrompt(`User ${result.username} successfully created`);
            } else {
                setMainStatusPrompt('Account creation unsuccessful');
            };
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!usernameInput || !passwordInput || !passwordCheckInput) return;
        if (passwordInput !== passwordCheckInput) {
            setPasswordStatusPrompt('Passwords do not match');
            return;
        };
        createUser(usernameInput, passwordInput);
        setUsernameInput('');
        setPasswordInput('');
        setPasswordCheckInput('');
        setPasswordStatusPrompt('');
    };

    return (
        <form className='UserCreationForm' onSubmit={handleSubmit}>
            <h1 className='UserCreationForm--title'>Create Account</h1>
            <label 
                className='UserCreationForm--username-label' 
                htmlFor='UserCreationForm--username-input'>
                Username
            </label>
            <input 
                id='UserCreationForm--username-input' 
                className='UserCreationForm--username-input'
                type='text' 
                value={usernameInput}
                onChange={e => setUsernameInput(e.currentTarget.value)}
            />
            {usernameStatusPrompt && usernameInput && 
            <span className='UserCreationForm--username-prompt'>
                {usernameStatusPrompt}
            </span>}
            <label 
                className='UserCreationForm--password-label' 
                htmlFor='UserCreationForm--password-input'>
                Password
            </label>
            <input 
                id='UserCreationForm--password-input' 
                className='UserCreationForm--password-input'
                type='password' 
                value={passwordInput}
                onChange={e => setPasswordInput(e.currentTarget.value)}
            />
            <label 
                className='UserCreationForm--password-check-label' 
                htmlFor='UserCreationForm--password-check-input'>
                Re-enter Password
            </label>
            <input 
                id='UserCreationForm--password-check-input' 
                className='UserCreationForm--password-check-input'
                type='password' 
                value={passwordCheckInput}
                onChange={e => setPasswordCheckInput(e.currentTarget.value)}
            />
            {passwordStatusPrompt && 
            <span className='UserCreationForm--password-prompt'>
                {passwordStatusPrompt}
            </span>}
            <button className='UserCreationForm--submit-button'>
                Create
            </button>
        </form>
    );
};

export default UserCreationForm;