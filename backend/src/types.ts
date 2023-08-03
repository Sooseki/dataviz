import { ObjectId } from "mongoose";

export interface IDataset {
    timeToLoad: number | undefined,
    jsUseRate: JsUseRateResult[] | undefined,
    firstContentfulPaint: string,
    cumulativeLayoutShift: string,
    totalBlockingTime: string,
    timeToInteractive: string
} 

export interface JsUseRateResult {
    url: string;
    usedBytes: number;
    totalBytes: number;
    percentUsed: string;
}
export interface LighthouseMetrics {
    firstContentfulPaint: string,
    cumulativeLayoutShift: string,
    totalBlockingTime: string,
    timeToInteractive: string
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