import axios from "axios";

type AxiosResponse<T> = {
    data: T;
}

// TO DO REMOVE THIS TOKEN
const tokenTest = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiYWFhYSIsInJvbGUiOiJhZG1pbiIsIm5hbWUiOiJ0ZXN0IiwiaWQiOiI2NGFmMzRhYWYyYmY1NGEwNDFkN2UyYTgifSwiaWF0IjoxNjg5MjEwMzUxLCJleHAiOjE2ODkyMTM5NTF9.sQlTGsJPoGWsHMGInn7rHp4rRqRYT0eKTff1x7fSD-A";
const config = {
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenTest}`
    }
};

export const handleGet = async <T>(url: string): Promise<AxiosResponse<T> | undefined> => {
    const res = await axios.get(url, config)
        .then((data) => data)
        .catch((err) => console.error(err));
    
    if(!res) return undefined;

    return res;
};

export const handlePost = async <T>(url: string, data: {}): Promise<AxiosResponse<T> | undefined> => {
    const res = await axios.post(url, data, config)
        .then((data) => data)
        .catch((err) => console.error(err));
    
    if(!res) return undefined;

    return res;
};

export const handlePut = async <T>(url: string, data: {}): Promise<AxiosResponse<T> | undefined> => {
    const res = await axios.put(url, data, config)
        .then((data) => data)
        .catch((err) => console.error(err));
    
    if(!res) return undefined;

    return res;
};
