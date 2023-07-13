"use client";
import Navbar from "@/components/Navbar";
import Burger from "@/components/Burger";
import { ReactNode } from "react";

/**TODO DEAL WITH STYLE => Navbar is floating */
const MenuLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Burger />
            <Navbar />
            {children}
        </>
    );
};

export default MenuLayout;