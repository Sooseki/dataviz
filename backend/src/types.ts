import { ObjectId } from "mongoose"

export interface IDataset {
    timeToLoad: number | undefined,
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
    id: string,
    url: string,
    datasets: IDataset[]
}