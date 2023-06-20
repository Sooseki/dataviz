"use client"
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faCoffee, faFolder } from '@fortawesome/free-solid-svg-icons';
import InputText from '@/components/input-text';
import SubmitButton from '@/components/submit-button';
import { ChangeEvent, useState } from 'react';
import axios from 'axios';

const Login: React.FC = () => {
    const { user } = useAuth();
    const [username, setUsername] = useState('');
    const [userPassword, setUserPassword] = useState('');
    
    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserPassword(event.target.value);
    };

    const handleSubmit = () => {
        async () => {
            try {
                const response = await axios.post('', {
                    //Just to test, remove email when done testing.
                    email: username,
                    password: userPassword,
                });
                console.log('Response:', response.data);
            } catch (error) {
                console.error('An error occurred during form submission:', error);
            }
        };
    };

    return (
        <>
            <form className='login-container'>
                <img className='logo' src="/perfguardian-text-and-logo.svg" alt='perfguardian-text-and-logo' />
                <InputText label="username" value={username} onChange={handleNameChange} />
                <InputText label="password" value={userPassword} onChange={handlePasswordChange} />
                <SubmitButton text="Submit" onClick={handleSubmit} />
                <div className='login-miscellaneous-services'>
                    <span>
                        You don't have an account ?
                        <Link className='miscellaneous-services-link' href={"/register"}>  Sign up</Link>
                    </span>
                    <Link className='miscellaneous-services-link' href={"/password-request"}>Forgot your password ?</Link>
                </div>
            </form>
        </>
    );
};

export default Login;
