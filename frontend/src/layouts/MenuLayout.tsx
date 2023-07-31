"use client";
import Navbar from "@/components/navbar/Navbar";
import { ReactNode } from "react";

/**TODO DEAL WITH STYLE => Navbar is floating */
const MenuLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Navbar />
            <div className="container">
                {children}
            </div>
        </>
    );
};

export default MenuLayout;