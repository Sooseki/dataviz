import axios from "axios";

export type AxiosResponse<T> = {
    data?: T;
    error?: string;
}

const config = {
    headers: {
        "Content-Type": "application/json"
    }
};

export const handleGet = async <T>(url: string): Promise<AxiosResponse<T> | undefined> => {
    const res = await axios.get(url, config).catch((err) => err.response);

    if (!res) return undefined;

    return res;
};

export const handlePost = async <T>(url: string, data: object): Promise<AxiosResponse<T> | undefined> => {
    const res = await axios.post(url, data, config).catch((err) => err.response);
    
    if(!res) return undefined;

    return res;
};

export const handlePut = async <T>(url: string, data: object): Promise<AxiosResponse<T> | undefined> => {
    const res = await axios.put(url, data, config).catch((err) => err.response);
    
    if(!res) return undefined;

    return res;
};
