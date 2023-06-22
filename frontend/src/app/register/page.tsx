"use client"
import { ChangeEvent, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import InputText from '@/components/InputText';
import SubmitButton from '@/components/button/SubmitButton';

const Register: React.FC = () => {
    const { signUp } = useAuth();
    const [username, setUsername] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userMail, setUserMail] = useState('');
    const [userCompany, setUserCompany] = useState('');

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserPassword(event.target.value);
    };

    const handleUsermailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserMail(event.target.value);
    }; 
    
    const handleCompanyChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserCompany(event.target.value);
    };

    if (!signUp) {
        return null;
    }

    const handleSubmit = () => signUp(userMail, userPassword, username, userCompany);

    return (
        <>
            <form onSubmit={handleSubmit} className='register-container' method='POST'>
                <img className='logo' src="/perfguardian-text-and-logo.svg" alt='perfguardian-text-and-logo' />
                <InputText type='text' name='username' label="username" value={username} onChange={handleNameChange} />
                <InputText type='password' name='password' label="password" value={userPassword} onChange={handlePasswordChange} />
                <InputText type='email' name='email' label="email" value={userMail} onChange={handleUsermailChange} />
                <InputText type='company' name='company' label="company" value={userCompany} onChange={handleCompanyChange} />
                <SubmitButton text="Submit" />
            </form>
        </>
    );
};

export default Register;