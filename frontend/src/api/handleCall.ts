import { User } from '@/types';
import axios from 'axios';

type AxiosResponse = {
    data: {
        user: User;
        msg: string;
        token: string;
    }
}

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

export const handleGet = async (url: string): Promise<AxiosResponse | undefined> => {
    const res = await axios.get(url, config)
        .then((data) => data)
        .catch((err) => console.error(err));
    
    if(!res) return undefined;

    return res;
}

export const handlePost = async (url: string, data: {}): Promise<AxiosResponse | undefined> => {
    const res = await axios.post(url, data, config)
        .then((data) => data)
        .catch((err) => console.error(err));
    
    if(!res) return undefined;

    return res;
}

export const handlePut = async (url: string, data: {}): Promise<AxiosResponse | undefined> => {
    const res = await axios.put(url, data, config)
        .then((data) => data)
        .catch((err) => console.error(err));
    
    if(!res) return undefined;

    return res;
}
