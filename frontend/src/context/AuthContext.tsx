"use client";
import { handlePost, handlePut } from "@/api/handleCall";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { AuthContextType, User, LoginResponse, UpdateUserResponse } from "@/types";
import { useRouter } from "next/navigation";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { decodeToken } from "react-jwt";
import { toast } from "react-toastify";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);
export const AuthContextProvider = ({ children }: PropsWithChildren) => {
	const router = useRouter();
	const [user, setUser] = useState<User | undefined>();
	const [token, setToken] = useState<string | undefined>();
	const { getItem, removeItem, setItem } = useLocalStorage();
	const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;
	const [isLoading, setIsLoading] = useState(true);

	const getConfig = () => ({
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	const logIn = async (email: string, password: string) => {
		try {
			const authresult = await handlePost<LoginResponse>(`${host}/users/login`, {
				email,
				password,
			});

			if (!authresult || !authresult.data?.token) throw new Error(authresult?.error);
			setToken(authresult.data?.token);
			getUserFromToken(authresult.data?.token);
			setItem("token", authresult.data?.token);
			router.push("/dashboard/domains");
		} catch (err) {
			toast(err instanceof Error ? err.message : "There has been an error. Please try again", {
				type: "error",
				theme: "colored",
				position: "bottom-left",
			});
		}
	};
	/* TODO : auto login remove or keep it ?
    const autoLogIn = async (token: string) => {
        try {
            const authresult = await handlePost<LoginResponse>(`${host}/users/login`, { email, password });

            if (!authresult || !authresult.data?.token) {
                throw new Error("no user found");
            }

            setUser(authresult.data?.user);
            setToken(authresult.data?.token);
            setItem("token", authresult.data?.token);
            // DEL 
            console.log(authresult.data?.token);
            router.push("/");
        } catch (err) {
            toast("There has been an error. Please try again",
                {
                    type: "error",
                    theme: "colored",
                    position: "bottom-left"
                });
        }
    }; */

	const signUp = async (email: string, password: string, name: string, company: string) => {
		try {
			const authresult = await handlePost<LoginResponse>(`${host}/users/register`, {
				email,
				password,
				name,
				company,
			});

			if (!authresult || !authresult.data?.token) throw new Error(authresult?.error);
			setToken(authresult.data?.token);
			getUserFromToken(authresult.data?.token);
			setItem("token", authresult.data?.token);
			router.push("/dashboard");
		} catch (err) {
			toast(
				err instanceof Error
					? err.message
					: "There has been an error in registering. Please try again.",
				{
					type: "error",
					theme: "colored",
					position: "bottom-left",
				}
			);
		}
	};

	const logOut = () => {
		removeItem("token");
		setToken(undefined);
		setUser(undefined);
		router.push("/login");
	};

	const changePassword = async (newPassword: string, currentPassword: string) => {
		const pswChangeResult = await handlePut<{ msg: string }>(
			`${host}/users/password`,
			{
				newPassword,
				currentPassword,
				id: user?.id,
			},
			getConfig()
		);

		if (!pswChangeResult || pswChangeResult.error) {
			toast("There has been an error in reseting password. Please try again.", {
				type: "error",
				theme: "colored",
				position: "bottom-left",
			});
			return;
		}
		toast("Password changed successfully !", {
			type: "success",
			theme: "colored",
			position: "bottom-left",
		});
	};

	const getUserFromToken = (userToken: string) => {
		if (!userToken) return logOut();

		const decodedToken: { user: User } | null = decodeToken(userToken);
		if (!decodedToken?.user) return logOut();
		setUser(decodedToken.user);
	};

	const changeOtherInfo = async (email: string, name: string) => {
		try {
			const otherInfoChangeResult = await handlePut<UpdateUserResponse>(
				`${host}/users/update`,
				{
					email,
					name,
					id: user?.id,
				},
				getConfig()
			);
			if (!otherInfoChangeResult || otherInfoChangeResult.error || !otherInfoChangeResult.data) {
				throw new Error(otherInfoChangeResult?.error);
			}
			if (user) {
				setUser({
					...user,
					email: otherInfoChangeResult.data.userUpdated.email,
					name: otherInfoChangeResult.data.userUpdated.name,
				});
			}
			toast("info changed successfully !", {
				type: "success",
				theme: "colored",
				position: "bottom-left",
			});
		} catch (err) {
			toast(
				err instanceof Error
					? err.message
					: "There has been an error in changing your information. Please try again.",
				{
					type: "error",
					theme: "colored",
					position: "bottom-left",
				}
			);
		}
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
		changeOtherInfo,
		signUp,
		logOut,
		changePassword,
		getConfig,
	};

	return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};
