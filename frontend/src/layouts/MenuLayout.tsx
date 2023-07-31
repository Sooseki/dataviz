"use client";

import Navbar from "@/components/navbar/Navbar";
import Burger from "@/components/navbar/Burger";
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

/**TODO DEAL WITH STYLE => Navbar is floating */
const MenuLayout = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();

    return (
        <>
            { user ?
                <>
                    <Burger />
                    <Navbar />                                
                    <div className="container">
                        {children}
                    </div>
                </>
            :   <div className="notConnected-container">
                    {children}
                </div> 
            }
        </>
    );
};

export default MenuLayout;