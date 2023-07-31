import { AuthContextProvider } from "@/context/AuthContext";
import { ThemeContextProvider } from "@/context/ThemeContext";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/navbar/Navbar";
import "../styles/main.css";
import "react-toastify/dist/ReactToastify.css";
import QueryLayout from "@/layouts/QueryLayout";
import MenuLayout from "@/layouts/MenuLayout";

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
                    <ThemeContextProvider>
                        <QueryLayout>
                            <MenuLayout>
                                {children}
                                <ToastContainer />
                            </MenuLayout>
                        </QueryLayout>
                        <Navbar/>
                        <div className="container">
                            {children}
                        </div>
                        <ToastContainer />
                    </ThemeContextProvider>
                </AuthContextProvider>
            </body>
        </html>
    );
};

export default RootLayout;