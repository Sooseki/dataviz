"use client";
import Link from "next/link";

const Home = () => {

    return (
        <div>
            <img className='logo' src="/perfguardian-text-and-logo.svg" alt='perfguardian-text-and-logo' />
            <Link href="/login">
                Login
            </Link>
        </div>
    );
};

export default Home;
