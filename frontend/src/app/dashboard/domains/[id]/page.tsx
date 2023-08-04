"use client";
import { handleGet } from "@/api/handleCall";
import { useQuery } from "react-query";
import { MetricsDataset } from "@/types";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LineChart from "@/components/charts/LineChart";

const Domain = () => {
    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;
    const domainName = useSearchParams().get("name");
    const domain= useParams();
    const { user } = useAuth();

    const { data: useQueryMetrics } = useQuery("get_metrics", async () => {
        return await handleGet<{ metrics: MetricsDataset[] }>(
            `${host}/metrics?domainId=${domain.id}&clientId=${user?.client.id}`
        );
    });

    return (
        <>
            <div className="metrics-container">
                <h1> {domainName} </h1>
                {useQueryMetrics && <LineChart metricsDatasets={useQueryMetrics} metricToStudy={"timeToLoad"} graphTitle={"Time to load (In miliseconds by session)"}/>}
            </div>
        </>
    );
};

export default Domain;