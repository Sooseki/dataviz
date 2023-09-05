import { ObjectId, Types } from "mongoose";

export interface IDataset {
    timeToLoad: number | undefined,
    jsUseRate: JsUseRate[] | undefined,
    firstContentfulPaint: number,
    cumulativeLayoutShift: number,
    totalBlockingTime: number,
    timeToInteractive: number
}

export interface LighthouseMetrics {
    firstContentfulPaint: number,
    cumulativeLayoutShift: number,
    totalBlockingTime: number,
    timeToInteractive: number
}

export interface IClient {
    id?: string,
    name?: string | undefined,
    domains: ObjectId[]
}

export type IClientPopulated = Omit<IClient, "domains"> & {
    domains: IDomain[]
}

export interface IDomain {
    id?: string,
    url: string,
    datasets?: Types.ObjectId[]
}

// TODO : move interface User to types when mongoDB User return values available
export interface Client {
    id: string;
    name: string;
}
export interface User {
    id: string;
    name: string;
    email: string;
    client: Client;
    role: string;
}

export interface MetricsDataset {
    _id: string;
    date: string;
    timeToLoad: number;
    firstContentfulPaint: number | undefined;
    cumulativeLayoutShift: number | undefined;
    totalBlockingTime: number | undefined;
    timeToInteractive: number | undefined;
    jsUseRate: JsUseRate[] | undefined;
}

export type JsUseRate = {
    url: string;
    usedBytes: number;
    totalBytes: number;
    percentUsed: string;
}

export interface Domain {
    _id: string;
    url: string;
}

export interface AuthContextType {
    user?: User | undefined;
    signUp?: (email: string, password: string, username: string, company: string) => Promise<void>;
    autoLogIn?: (token: string) => Promise<void>;
    changeOtherInfo?: (email: string, name: string) => Promise<void>;
    logIn?: (email: string, password: string) => Promise<void>;
    logOut: () => void;
    changePassword?: (newPassword: string, currentPassword: string) => Promise<void>;
    getConfig: () => Record<string, unknown>;
}

export interface ThemeContextType {
    theme?: string | undefined;
    setNewTheme?: (theme: string) => void;
    allThemes?: { label: string; name: string }[];
}

export type LoginResponse = {
    token: string;
    msg: string;
};

export type UpdateUserResponse = {
    msg: string;
    userUpdated: { name: string; email: string };
};

export type GetUsersResponse = {
    users: User[];
    msg: string;
};
