"use client"
import { handlePost, handlePut } from "@/api/handleCall";
import { AuthContextType, User } from "@/types";
import { useRouter } from "next/navigation";
import { PropsWithChildren, createContext, useContext, useState } from "react";

const AuthContext = createContext<AuthContextType>({})
export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
    const router = useRouter();
    const [user, setUser] = useState<User | undefined>();
    const [token, setToken] = useState<string | undefined>();
    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;

    const logIn = async (email: string, password: string) => {
        try {
            const authresult = await handlePost(`${host}/users/login`, { email, password });

            if (!authresult || !authresult.data?.user || !authresult.data?.token) {
                throw new Error("no user found");
            }
            
            setUser(authresult.data?.user);
            setToken(authresult.data?.token)
            // TODO : code toast component 
            // toastsuccess("Login Successfull")
            router.push("/")
        } catch (err) {
            console.error(err);
            // toasterror("Login Failed")
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            const authresult = await handlePost(`${host}/users/register`, { email, password });
                      
            // TODO : correct API return values
            if (!authresult || !authresult.data?.user) {
                throw new Error("no user found");
            }

            setUser(authresult.data?.user);
            // TODO : code toast component 
            // toastsuccess("Sign Up Successfull")
        } catch (err) {
            console.error(err);
            // toasterror("An Error Occuered")
        }
    };

    const logOut = () => {
        setUser(undefined);
    };

    const changePassword = async (
        email: string, 
        newPassword: string, 
        currentPassword: string,
    ) => {
        try {
            // TODO : correct urls when backend ok :+1:
            const pswChangeResult = await handlePut(`${host}/users/change-password`, { 
                email, 
                newPassword,
                currentPassword,
            });
            
            // TODO : correct API return values
            if (!pswChangeResult || !pswChangeResult.data?.user) {
                throw new Error("There was an error in password reseting");
            }
            
            setUser(pswChangeResult.data?.user);
            // TODO : code toast component 
            // toastsuccess("Password Changed Successfully")
        } catch (err) {
            console.error(err);
            // toasterror("Login Failed")
        }
    }

    const value: AuthContextType = { 
        user, 
        logIn, 
        signUp, 
        logOut, 
        changePassword 
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};
