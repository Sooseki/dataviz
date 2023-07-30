import { AuthContextProvider } from "@/context/AuthContext";
import { ThemeContextProvider } from "@/context/ThemeContext";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/navbar/Navbar";
import "../styles/main.css";
import "react-toastify/dist/ReactToastify.css";
import ContentContainer from "@/components/contentContainer/ContentContainer";

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
                        <Navbar/>
                        <ContentContainer children={children} />
                        <ToastContainer />
                    </ThemeContextProvider>
                </AuthContextProvider>
            </body>
        </html>
    );
};

export default RootLayout;