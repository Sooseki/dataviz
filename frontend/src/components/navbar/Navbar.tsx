"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { navConfig } from "./navconfig";
import Burger from "./Burger";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const { user } = useAuth();
    const pathname = usePathname();

    // if (!user) return null;

    return <div>
        <div className='navigation'>
            <div className="logoContainer">
                <img className='navigation_logo' src="/perfguardian-text-and-logo.svg" alt='perfguardian-text-and-logo-black' />
            </div>
            <div className="navigation_items">
                {Object.values(navConfig).map(({ href, name, icon }) =>
                    <Link key={name} className={pathname === href ? "navigation_item navigation_item_active" : "navigation_item"} href={href}>{name}</Link>
                )}
                {
                    // Keep track on how to put icons
                    // <NavLink className='navigation_item' href="/login"> <FontAwesomeIcon icon={faChartSimple} /> Item 1</Link>
                }
            </div>
            <div className="navigation_userContainer">
                <Link className="navigation_user" href="/user/settings">
                    <img src="https://picsum.photos/200" alt="image utilisateur" />
                    <p>{user?.name}</p>
                </Link>
                <Link href="/login">
                    Login
                </Link>
            </div>

        </div>
        <Burger />
    </div>;
}

export default Navbar;
