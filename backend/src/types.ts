import { ObjectId } from "mongoose";

export interface IDataset {
    timeToLoad: number | undefined,
    jsUseRate: JsUseRateResult[] | undefined,
    lightHouse: LighthouseMetrics;
} 

export interface JsUseRateResult {
    url: string;
    usedBytes: number;
    totalBytes: number;
    percentUsed: string;
}
export interface LighthouseMetrics {
    first_contentful_paint: string;
    cumulative_layout_shift: string;
    total_blocking_time: string;
    time_to_interactive: string;
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