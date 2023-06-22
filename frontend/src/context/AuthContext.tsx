"use client"
import { handlePost, handlePut } from "@/api/handleCall";
import { AuthContextType, User } from "@/types";
import { useRouter } from "next/navigation";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify"

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
            router.push("/")
        } catch (err) {
            toast("There has been an error. Please try again", 
            { 
                type: "error",
                theme: "colored",
                position: "bottom-left"
            })
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            const authresult = await handlePost(`${host}/users/register`, { email, password });
                      
            if (!authresult || !authresult.data?.user) {
                throw new Error("no user found");
            }

            setUser(authresult.data?.user);
        } catch (err) {
            toast(
                "There has been an error in registering. Please try again.", 
                { 
                    type: "error",
                    theme: "colored",
                    position: "bottom-left"
                }
            )
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
                toast(
                    "There has been an error in reseting password. Please try again.", 
                    { 
                        type: "error",
                        theme: "colored",
                        position: "bottom-left"
                    }
                )
                throw new Error("There was an error in password reseting");
            }
            
            setUser(pswChangeResult.data?.user);
        } catch (err) {
            toast(
                "There has been an error in reseting password. Please try again.", 
                { 
                    type: "error",
                    theme: "colored",
                    position: "bottom-left"
                }
            )
        }
    }

    useEffect(() => {
        if (!user) { 
            router.push("/login");
        };
    }, [])

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
