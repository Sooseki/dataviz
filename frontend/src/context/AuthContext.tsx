"use client"
import { handlePost, handlePut } from "@/api/handleCall";
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

    const changePassword = async (
        email: string, 
        newPassword: string, 
        currentPassword: string,
    ) => {
        try {
            // TODO : correct urls when backend ok :+1:
            const pswChangeResult = await handlePut('/api/user/password', { 
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
