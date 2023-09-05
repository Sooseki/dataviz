import { ObjectId, Types } from "mongoose";

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
    id?: string,
    url: string,
    datasets?: Types.ObjectId[]
}


export type MetricsDataset = {
    _id: { $oid: string };
    date: { $date: string };
    timeToLoad: number;
    firstContentfulPaint: number | undefined;
    cumulativeLayoutShift: number | undefined;
    totalBlockingTime: number | undefined;
    timeToInteractive: number | undefined;
    jsUseRate: JsUseRate[];
    __v: number;
}

export type JsUseRate = {
    url: string;
    usedBytes: number;
    totalBytes: number;
    percentUsed: string;
}
