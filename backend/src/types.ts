export interface IDataset {
    timeToLoad: number | undefined,
} 

export interface IClient {
    id?: string,
    name?: string | undefined,
    domains: any[]
}

export interface IDomain {
    id: string,
    url: string,
    datasets: IDataset[]
}