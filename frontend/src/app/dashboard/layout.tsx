"use client";

import { ThemeContextProvider } from "../../context/ThemeContext";
import QueryLayout from "../../layouts/QueryLayout";
import MenuLayout from "../../layouts/MenuLayout";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const user = useAuth();
    if (!user) {
        return null;
    }

    return (
        <ThemeContextProvider>
            <QueryLayout>
                <MenuLayout>{children}</MenuLayout>
            </QueryLayout>
        </ThemeContextProvider>
    );
};

export default DashboardLayout;
