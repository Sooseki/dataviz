import { ObjectId } from "mongoose";

export interface IDataset {
    timeToLoad: number | undefined,
    jsUseRate: JsUseRateResult[] | undefined,
    firstContentfulPaint: String,
    cumulativeLayoutShift: String,
    totalBlockingTime: String,
    timeToInteractive: String
} 

export interface JsUseRateResult {
    url: string;
    usedBytes: number;
    totalBytes: number;
    percentUsed: string;
}
export interface LighthouseMetrics {
    firstContentfulPaint: String,
    cumulativeLayoutShift: String,
    totalBlockingTime: String,
    timeToInteractive: String
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