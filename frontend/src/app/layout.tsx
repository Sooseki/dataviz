import { AuthContextProvider } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "../styles/main.css";
import "react-toastify/dist/ReactToastify.css";
import MetaHead from "../components/MetaHead";
export const metadata = {
    title: "PerfGuardian",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <MetaHead />
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
