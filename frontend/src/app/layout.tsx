import { AuthContextProvider } from "@/context/AuthContext";
import { ThemeContextProvider } from "@/context/ThemeContext";
import { ToastContainer } from "react-toastify";
import QueryLayout from "@/layouts/QueryLayout";
import MenuLayout from "@/layouts/MenuLayout";
import "../styles/main.css";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
    title: "PerfGuardian"
};

const RootLayout = ({children}: {
    children: React.ReactNode
}) => {
    return (
        <html lang="en">
            <body>
                <AuthContextProvider>
                    {children}
                    <ToastContainer />
                </AuthContextProvider>
            </body>
        </html>
    );
};

export default RootLayout;