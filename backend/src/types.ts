import { ObjectId } from "mongoose";

export interface IDataset {
    timeToLoad: number | undefined,
    jsUseRate: JsUseRateResult[] | undefined,
    firstContentfulPaint: number,
    cumulativeLayoutShift: number,
    totalBlockingTime: number,
    timeToInteractive: number
} 

export interface JsUseRateResult {
    url: string;
    usedBytes: number;
    totalBytes: number;
    percentUsed: string;
}
export interface LighthouseMetrics {
    firstContentfulPaint: number,
    cumulativeLayoutShift: number,
    totalBlockingTime: number,
    timeToInteractive: number
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