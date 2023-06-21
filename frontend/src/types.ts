// TODO : move interface User to types when mongoDB User return values available
export interface User {
    fullName: string,
    email: string,
}

export interface AuthContextType {
    user?: User | undefined;
    signUp?: (email: string, password: string) => Promise<void>;
    logIn?: (email: string, password: string) => Promise<void>;
    logOut?: () => void;
    changePassword?: (email: string, newPassword: string, currentPassword: string) => Promise<void>;
}

export interface ThemeContextType {
    theme?: string | undefined;
    setNewTheme?: (theme: string) => void;
    allThemes?: { label: string; name: string; }[];
}