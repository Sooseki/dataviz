// TODO : move interface User to types when mongoDB User return values available
export interface User {
    name: string,
    email: string,
    id: string,
}

export interface Client {
    name: string,
}

export interface AuthContextType {
    user?: User | undefined;
    signUp?: (email: string, password: string, username: string, company: string) => Promise<void>;
    autoLogIn?: (token: string) => Promise<void>;
    changeOtherInfo?: (email: string, name: string) => Promise<void>;
    logIn?: (email: string, password: string) => Promise<void>;
    logOut?: () => void;
    changePassword?: (newPassword: string, currentPassword: string) => Promise<void>;
}

export interface ThemeContextType {
    theme?: string | undefined;
    setNewTheme?: (theme: string) => void;
    allThemes?: { label: string; name: string; }[];
}

export type LoginResponse = {
    token: string;
    client: Client;
};