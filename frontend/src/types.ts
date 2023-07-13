// TODO : move interface User to types when mongoDB User return values available
export interface User {
    name: string,
    email: string,
    clientId: string
}
export interface Domain {
    id: number,
    url: string
}
export interface Client {
    name: string,
}

export interface AuthContextType {
    user?: User | undefined;
    signUp?: (email: string, password: string, username: string, company: string) => Promise<void>;
    logIn?: (email: string, password: string) => Promise<void>;
    logOut?: () => void;
    changePassword?: (email: string, newPassword: string, currentPassword: string) => Promise<void>;
}

export interface ThemeContextType {
    theme?: string | undefined;
    setNewTheme?: (theme: string) => void;
    allThemes?: { label: string; name: string; }[];
}

export type LoginResponse = {
    user: User;
    msg: string;
    token: string;
    client: Client;
};