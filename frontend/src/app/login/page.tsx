"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import InputText from "@/components/InputText";
import SubmitButton from "@/components/button/SubmitButton";
import Image from "next/image";

const Login: React.FC = () => {
    const { logIn } = useAuth();
    const [email, setEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    
    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };
    
    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserPassword(event.target.value);
    };

    if (!logIn) return null;
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        logIn(email, userPassword);
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className='login-form' method="POST">
                <Image className="logo" src="/perfguardian-text-and-logo.svg" alt="perfguardian-text-and-logo" width="30" height="30" />
                <InputText type='email' label="email" name="email" value={email} onChange={handleEmailChange} />
                <InputText type='password' label="password" name="password" value={userPassword} onChange={handlePasswordChange} />
                <SubmitButton text="Submit" />
                <div className='login-miscellaneous-services text-over-background'>
                    <span>
                        You don&apos;t have an account?
                        <Link className='miscellaneous-services-link' href="/register">Sign up</Link>
                    </span>
                    <Link className='miscellaneous-services-link' href="/password-request">Forgot your password ?</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
