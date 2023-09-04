"use client";
import { handlePost, handlePut } from "@/api/handleCall";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { AuthContextType, User, LoginResponse } from "@/types";
import { useRouter } from "next/navigation";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { decodeToken } from "react-jwt";
import { toast } from "react-toastify";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);
export const AuthContextProvider = ({ children }: PropsWithChildren) => {
    const router = useRouter();
    const [user, setUser] = useState<User | undefined>();
    const { getItem, removeItem, setItem } = useLocalStorage();
    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;
    const [isLoading, setIsLoading] = useState(true);
    
    const logIn = async (email: string, password: string) => {
        try {
            const authresult = await handlePost<LoginResponse>(`${host}/users/login`, { email, password });

            if (!authresult || !authresult.data?.token) throw new Error(authresult?.error);

            getUserFromToken(authresult.data?.token);
            setItem("token", authresult.data?.token);
            router.push("/dashboard/domains");
        } catch (err) {
            toast(
                err instanceof Error ? err.message : "There has been an error. Please try again",
                {
                    type: "error",
                    theme: "colored",
                    position: "bottom-left"
                });
        }
    };

    const signUp = async (email: string, password: string, name: string, company: string) => {
        try {
            const authresult = await handlePost<LoginResponse>(`${host}/users/register`, { email, password, name, company });

            if (!authresult || !authresult.data?.token)  throw new Error(authresult?.error);

            getUserFromToken(authresult.data?.token);
            setItem("token", authresult.data?.token);
            router.push("/dashboard");
        } catch (err) {
            toast(
                err instanceof Error ? err.message : "There has been an error in registering. Please try again.",
                {
                    type: "error",
                    theme: "colored",
                    position: "bottom-left"
                }
            );
        }
    };

    const logOut = () => {
        removeItem("token");
        setUser(undefined);
        router.push("/login");
    };

    const changePassword = async (
        email: string,
        newPassword: string,
        currentPassword: string,
    ) => {
        try {
            // TODO : correct urls when backend ok :+1:
            const pswChangeResult = await handlePut<{ user: User }>(`${host}/users/change-password`, {
                email,
                newPassword,
                currentPassword,
            });

            // TODO : correct API return values
            if (!pswChangeResult || !pswChangeResult.data?.user) throw new Error(pswChangeResult?.error);
            toast(
                "Password changed successfully !", 
                { 
                    type: "success",
                    theme: "colored",
                    position: "bottom-left"
                }
            );
            
            setUser(pswChangeResult.data?.user);
        } catch (err) {
            toast(
                err instanceof Error ? err.message : "There has been an error in resetting password. Please try again.",
                {
                    type: "error",
                    theme: "colored",
                    position: "bottom-left"
                }
            );
        }
    };

    const getUserFromToken = (userToken: string) => {
        if (!userToken) return logOut();

        const decodedToken: { user: User } | null = decodeToken(userToken);
        if (!decodedToken?.user) return logOut();
        setUser(decodedToken.user);
    };

    useEffect(() => {
        const userToken = getItem("token");

        if (userToken) {
            getUserFromToken(userToken);
        } else {
            setIsLoading(false);
            return logOut();
        }
        setIsLoading(false);
    }, []);

    const value: AuthContextType = {
        user,
        logIn,
        signUp,
        logOut,
        changePassword
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};
