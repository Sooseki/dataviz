import { User } from '@/types';
import axios from 'axios';

type AxiosResponse = {
    data: {
        user: User;
        token: string;
    }
}

export const handleGet = async (url: string, config: {}): Promise<AxiosResponse | undefined> => {
    const data = await axios.get(url, config)
        .then((data) => data)
        .catch((err) => console.error(err));
    
    if(!data) return undefined;

    return data;
}

export const handlePost = async (url: string, config: {}): Promise<AxiosResponse | undefined> => {
    const data = await axios.post(url, config)
        .then((data) => data)
        .catch((err) => console.error(err));
    
    if(!data) return undefined;

    return data;
}
