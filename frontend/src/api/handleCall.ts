import axios from "axios";

export type AxiosResponse<T> = {
    data?: T;
    error?: string;
}


const defaultConfig = {
    headers: {
        "Content-Type": "application/json"
        // "Authorization": `Bearer ${tokenTest}`
    }
};


export const handleGet = async <T>(url: string, config?: Record<string, unknown>): Promise<AxiosResponse<T> | undefined> => {
    const res = await axios.get(url, config??defaultConfig).catch((err) => err.response);
    if (!res) return undefined;

    return res;
};

export const handlePost = async <T>(url: string, data: Record<string, unknown>, config?: Record<string, unknown>): Promise<AxiosResponse<T> | undefined> => {
    const res = await axios.post(url, data, config??defaultConfig).catch((err) => err.response);
    if(!res) return undefined;

    return res;
};

export const handlePut = async <T>(url: string, data: Record<string, unknown>, config?: Record<string, unknown>): Promise<AxiosResponse<T> | undefined> => {
    const res = await axios.put(url, data, config??defaultConfig).catch((err) => err.response);
    if(!res) return undefined;

    return res;
};
