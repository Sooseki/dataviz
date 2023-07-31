"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { navConfig } from "./navconfig";
import Burger from "./Burger";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../button/Button";
import Image from "next/image";

const Navbar: React.FC = () => {
    const { user, logOut } = useAuth();
    const pathname = usePathname();

    const handleLogout = () => logOut();

    return (
        <div>
            <div className="navigation">
                <div className="navigation_header">
                    <div className="navigation_header_logo_container">
                        <Image
                            className="navigation_logo"
                            src="/perfguardian-text-and-logo.svg"
                            alt="perfguardian-text-and-logo-black"
                            width="30"
                            height="30"
                        />
                    </div>
                    <div className="navigation_header_items">
                        {Object.values(navConfig).map(({ href, name, icon }) => (
                            <Link
                                key={name}
                                className={
                                    pathname === href
                                        ? "navigation_item navigation_item_active"
                                        : "navigation_item"
                                }
                                href={href}
                            >
                                {icon && <FontAwesomeIcon icon={icon} />} &nbsp;
                                {name}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="navigation_userContainer">
                    <Link className="navigation_user" href="/user/settings">
                        <Image src="/user.svg" alt="user-image" width="30" height="30"/>
                        <p>{user?.name}</p>
                    </Link>
                    <Button
                        content={"Logout"}
                        onClick={handleLogout}
                        classes="nav-button"
                    />
                </div>
            </div>
            <Burger />
        </div>
    );
};

export default Navbar;
