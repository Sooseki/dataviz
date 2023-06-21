"use client"
import { ChangeEvent, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import InputText from '@/components/input-text';
import SubmitButton from '@/components/submit-button';

const Login: React.FC = () => {
    const { logIn } = useAuth();
    const [email, setEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    
    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };
    
    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserPassword(event.target.value);
    };

    if (!logIn) return null;
    
    const handleSubmit = () => logIn(email, userPassword);

    return (
        <>
            <form className='login-container'>
                <img className='logo' src="/perfguardian-text-and-logo.svg" alt='perfguardian-text-and-logo' />
                <InputText label="email" value={email} onChange={handleEmailChange} />
                <InputText label="password" value={userPassword} onChange={handlePasswordChange} />
                <SubmitButton text="Submit" onClick={handleSubmit} />
                <div className='login-miscellaneous-services'>
                    <span>
                        You don't have an account ?
                        <Link className='miscellaneous-services-link' href="/register">  Sign up</Link>
                    </span>
                    <Link className='miscellaneous-services-link' href="/password-request">Forgot your password ?</Link>
                </div>
            </form>
        </>
    );
};

export default Login;
