import { useState, useEffect, useRef, FormEvent } from 'react';
import { debounceMilliseconds } from '../config';
import usersService from '../services/usersService';
import '../css/UserCreationForm.css';

interface Props {
    setCreateAccountMode: (mode: boolean) => void, 
    setMainStatusPrompt: (message: string) => void
};

const UserCreationForm = ({ 
    setCreateAccountMode, 
    setMainStatusPrompt 
    }: Props) => {

    const [usernameStatusPrompt, setUsernameStatusPrompt] = useState<string>('');
    const [passwordStatusPrompt, setPasswordStatusPrompt] = useState<string>('');
    const [usernameInputValue, setUsernameInputValue] = useState<string>('');
    const [passwordInputValue, setPasswordInputValue] = useState<string>('');
    const [passwordCheckInputValue, setPasswordCheckInputValue] = useState<string>('');

    const usernameInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const passwordCheckInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!usernameInputValue) {
            if (usernameStatusPrompt) setUsernameStatusPrompt('');
            return;
        };
        const checkIfUsernameIsTaken = () => {
            usersService.checkIfUserExists(usernameInputValue).then(usernameIsTaken => {
                const promptMessage: string = (usernameIsTaken) 
                ? 'username is taken' : 'username is available';
                setUsernameStatusPrompt(promptMessage);
            });
        };
        const checkDebounce = setTimeout(checkIfUsernameIsTaken, debounceMilliseconds);
        return () => clearTimeout(checkDebounce);
    }, [usernameInputValue]);

    const createUser = (username: string, password: string): void => {
        usersService.createUser({ username, password })
        .then(result => {
            if (result) {
                setMainStatusPrompt(`User ${result.username} successfully created`);
                setCreateAccountMode(false);
            } else {
                setMainStatusPrompt('Account creation unsuccessful');
            };
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!usernameInputValue) return usernameInputRef.current?.focus();
        if (!passwordInputValue) return passwordInputRef.current?.focus();
        if (!passwordCheckInputValue) return passwordCheckInputRef.current?.focus();
        if (passwordInputValue !== passwordCheckInputValue) {
            setPasswordStatusPrompt('passwords do not match');
            return;
        };
        createUser(usernameInputValue, passwordInputValue);
        setUsernameInputValue('');
        setPasswordInputValue('');
        setPasswordCheckInputValue('');
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
            <div className='UserCreationForm--username-input-container'>
                <input 
                    id='UserCreationForm--username-input' 
                    className='UserCreationForm--username-input'
                    type='text' 
                    ref={usernameInputRef}
                    value={usernameInputValue}
                    onChange={e => setUsernameInputValue(e.currentTarget.value)}
                />
                {usernameStatusPrompt && usernameInputValue && 
                <span className='UserCreationForm--username-prompt'>
                    {usernameStatusPrompt}
                </span>}
            </div>
            <label 
                className='UserCreationForm--password-label' 
                htmlFor='UserCreationForm--password-input'>
                Password
            </label>
            <input 
                id='UserCreationForm--password-input' 
                className='UserCreationForm--password-input'
                type='password' 
                ref={passwordInputRef}
                value={passwordInputValue}
                onChange={e => setPasswordInputValue(e.currentTarget.value)}
            />
            <label 
                className='UserCreationForm--password-check-label' 
                htmlFor='UserCreationForm--password-check-input'>
                Re-enter Password
            </label>
            <div className='UserCreationForm--password-check-input-container'>
                <input 
                    id='UserCreationForm--password-check-input' 
                    className='UserCreationForm--password-check-input'
                    type='password' 
                    ref={passwordCheckInputRef}
                    value={passwordCheckInputValue}
                    onChange={e => setPasswordCheckInputValue(e.currentTarget.value)}
                />
                {passwordStatusPrompt && 
                <span className='UserCreationForm--password-prompt'>
                    {passwordStatusPrompt}
                </span>}
            </div>
            <button className='UserCreationForm--submit-button'>
                Create
            </button>
        </form>
    );
};

export default UserCreationForm;