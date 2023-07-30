// TODO : move interface User to types when mongoDB User return values available
export interface User {
    name: string,
    email: string,
    clientId: string,
    role: string
}
export interface Metrics {
    id: number,
    date: string,
    timeToLoad: number | undefined,
    jsUseRate: JsUseRateResult[] | undefined,
    lightHouse: LighthouseMetrics;
}
export interface JsUseRateResult {
    url: string;
    usedBytes: number;
    totalBytes: number;
    percentUsed: string;
}
export interface LighthouseMetrics {
    first_contentful_paint: string;
    cumulative_layout_shift: string;
    total_blocking_time: string;
    time_to_interactive: string;
}
export interface Domain {
    id: number,
    url: string
}
export interface Client {
    name: string,
}

export interface AuthContextType {
    client?: Client | undefined;
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