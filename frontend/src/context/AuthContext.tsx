"use client";
import { handlePost, handlePut } from "@/api/handleCall";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { decryptJWT } from "@/lib/decryptJWT";
import { AuthContextType, User, LoginResponse } from "@/types";
import { useRouter } from "next/navigation";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { decodeToken } from "react-jwt";
import { toast } from "react-toastify";

const AuthContext = createContext<AuthContextType>({});
export const useAuth = () => useContext(AuthContext);


export const AuthContextProvider = ({ children }: PropsWithChildren) => {
    const router = useRouter();
    const [user, setUser] = useState<User | undefined>();
    const [token, setToken] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const { getItem, removeItem, setItem } = useLocalStorage();
    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;


    const logIn = async (email: string, password: string) => {
        try {
            const authresult = await handlePost<LoginResponse>(`${host}/users/login`, { email, password });

            if (!authresult || !authresult.data?.token) {
                throw new Error("no user found");
            }
            // TO DO : check the token info and push it to setUser()
            setUser(decryptJWT(authresult.data?.token)); /// NECESSARY WHEN  decodeToken exist ?
            setToken(authresult.data?.token);
            setItem("token", authresult.data?.token);
            // DEL 

            router.push("/");
        } catch (err) {
            toast("There has been an error. Please try again",
                {
                    type: "error",
                    theme: "colored",
                    position: "bottom-left"
                });
        }
    };

    // const autoLogIn = async (token: string) => {
    //     try {
    //         const authresult = await handlePost<LoginResponse>(`${host}/users/login`, { email, password });

    //         if (!authresult || !authresult.data?.token) {
    //             throw new Error("no user found");
    //         }

    //         setUser(authresult.data?.user);
    //         setToken(authresult.data?.token);
    //         setItem("token", authresult.data?.token);
    //         // DEL 
    //         console.log(authresult.data?.token);
    //         router.push("/");
    //     } catch (err) {
    //         toast("There has been an error. Please try again",
    //             {
    //                 type: "error",
    //                 theme: "colored",
    //                 position: "bottom-left"
    //             });
    //     }
    // };

    const signUp = async (email: string, password: string, name: string, company: string) => {
        try {
            const authresult = await handlePost<LoginResponse>(`${host}/users/register`, { email, password, name, company });

            if (!authresult || !authresult.data?.token) {
                throw new Error("could not register");
            }

            setUser(decryptJWT(authresult.data?.token)); /// NECESSARY WHEN  decodeToken exist ?
            setToken(authresult.data?.token);
            setItem("token", authresult.data?.token);
            router.push("/");
        } catch (err) {
            toast(
                "There has been an error in registering. Please try again.",
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
    };

    const changePassword = async (
        newPassword: string,
        currentPassword: string,
    ) => {

        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        };
        const pswChangeResult = await handlePut<LoginResponse>(`${host}/users/password`, {
            newPassword,
            currentPassword,
            id: user?.id,
        }, config);
        console.log(pswChangeResult?.data);
        // TODO : correct API return values
        if (!pswChangeResult || !pswChangeResult.data?.token) {
            toast(
                "There has been an error in reseting password. Please try again.",
                {
                    type: "error",
                    theme: "colored",
                    position: "bottom-left"
                }
            );
            return
        }
        toast(
            "Password changed successfully !",
            {
                type: "success",
                theme: "colored",
                position: "bottom-left"
            }
        );
        setToken(pswChangeResult.data?.token);
        // setUser(pswChangeResult.data?.user);
    };

    const changeOtherInfo = async (
        email: string,
        name: string,
    ) => {

        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        };
        const otherInfoChangeResult = await handlePut<LoginResponse>(`${host}/users/update`, {
            email,
            name,
            id: user?.id,
        }, config);


        if (!otherInfoChangeResult || !otherInfoChangeResult.data?.token) {
            toast(
                "There has been an error in changing your information. Please try again.",
                {
                    type: "error",
                    theme: "colored",
                    position: "bottom-left"
                }
            );
            return;
        }
        toast(
            "info changed successfully !",
            {
                type: "success",
                theme: "colored",
                position: "bottom-left"
            }
        );
        // setUser(decryptJWT(otherInfoChangeResult.data?.token));
        setToken(otherInfoChangeResult.data?.token);
        setItem("token", otherInfoChangeResult.data?.token);
    };

    useEffect(() => {
        if (!user) {
            const userToken = getItem("token");
            if (userToken) {
                const decodedToken: { user: User } | null = decodeToken(userToken);
                if (!decodedToken) return logOut();
                setUser(decodedToken.user);
            } else {
                router.push("/login");
                setIsLoading(false);
                return logOut();
            }
        }
        setIsLoading(false);
    }, []);

    const value: AuthContextType = {
        user,
        logIn,
        changeOtherInfo,
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
