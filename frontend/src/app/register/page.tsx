"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import InputText from "@/components/InputText";
import SubmitButton from "@/components/button/SubmitButton";
import Image from "next/image";

const Register: React.FC = () => {
    const { signUp } = useAuth();
    const [username, setUsername] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userMail, setUserMail] = useState("");
    const [userCompany, setUserCompany] = useState("");


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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => { 
        e.preventDefault(); 
        signUp(userMail, userPassword, username, userCompany);
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className='register-container' method='POST'>
                <Image className="logo" src="/perfguardian-text-and-logo.svg" alt="perfguardian-text-and-logo" width="30" height="30" />
                <InputText placeholder="E.g: Donkey Kong" type='text' name='username' label="username" value={username} onChange={handleNameChange} />
                <InputText placeholder="*****" type='password' name='password' label="password" value={userPassword} onChange={handlePasswordChange} />
                <InputText placeholder="Donkey@kong.com" type='email' name='email' label="email" value={userMail} onChange={handleUsermailChange} />
                <InputText placeholder="Nintendo" type='company' name='company' label="company" value={userCompany} onChange={handleCompanyChange} />
                <SubmitButton text="Submit" />
            </form>
        </div>
    );
};

export default Register;