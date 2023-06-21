"use client"
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Burger from '@/components/burger';

const Home: React.FC = () => {

    return (
        <div>
            <Burger/>
            <Navbar/>
            <img className='logo' src="/perfguardian-text-and-logo.svg" alt='perfguardian-text-and-logo' />
            <Link href="/login">
                Login
            </Link>
        </div>
    );
};

export default Home;
