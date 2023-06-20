"use client"
import { handlePost } from "@/api/handleCall";
import { AuthContextType, User } from "@/types";
import { PropsWithChildren, createContext, useContext, useState } from "react";

const AuthContext = createContext<AuthContextType>({})
export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | undefined>()

    const logIn = async (email: string, password: string) => {
        try {
            // TODO : correct urls when backend ok :+1:
            const authresult = await handlePost('/api/auth/login', { email, password });
            
            // TODO : correct API return values
            if (!authresult || !authresult.data?.user) {
                throw new Error("no user found");
            }
            
            setUser(authresult.data?.user);
            // TODO : code toast component 
            // toastsuccess("Login Successfull")
        } catch (err) {
            console.error(err);
            // toasterror("Login Failed")
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            const authresult = await handlePost('/api/auth/signup', { email, password });
                      
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

    const value: AuthContextType = { user, logIn, signUp, logOut };

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
};
