import dotenv from 'dotenv'
import path from 'path';

export const getEnvVariable = (envVariable: string): string | undefined => {
    dotenv.config({ path: path.resolve(__dirname, '../../.env') });
    if (!envVariable || !process.env) throw new Error('env not found')
    return process.env[envVariable]
}