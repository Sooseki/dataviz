"use client"
import { useAuth } from '@/context/AuthContext';
import InputText from '@/components/input-text';
import SubmitButton from '@/components/submit-button';
import { ChangeEvent, useState } from 'react';
import axios from 'axios';

const Register: React.FC = () => {
    const { user } = useAuth();
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

    const handleSubmit = () => {
        async () => {
            try {
                const response = await axios.post('', {
                    //Just to test, remove email when done testing.
                    username: username,
                    password: userPassword,
                    mail: userMail,
                    company: userCompany
                });
                console.log('Response:', response.data);
            } catch (error) {
                console.error('An error occurred during form submission:', error);
            }
        };
    };

    return (
        <>
            <form className='register-container'>
                <img className='logo' src="/perfguardian-text-and-logo.svg" alt='perfguardian-text-and-logo' />
                <InputText label="username" value={username} onChange={handleNameChange} />
                <InputText label="password" value={userPassword} onChange={handlePasswordChange} />
                <InputText label="email" value={userMail} onChange={handleUsermailChange} />
                <InputText label="company" value={userCompany} onChange={handleCompanyChange} />
                <SubmitButton text="Submit" onClick={handleSubmit} />
            </form>
        </>
    );
};

export default Register;