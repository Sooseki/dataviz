"use client";
import { ReactNode } from "react";
import Navbar from "@/components/navbar/Navbar";

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