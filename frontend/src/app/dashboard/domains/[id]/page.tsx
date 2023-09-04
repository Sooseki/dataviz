"use client";
import { handleGet } from "@/api/handleCall";
import { useQuery } from "react-query";
import { MetricsDataset } from "@/types";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import LineChart from "@/components/charts/LineChart";

const Domain = () => {
    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;
    const domainName = useSearchParams().get("name");
    const domain = useParams();
    const { user, getConfig } = useAuth();

    const { data: useQueryMetrics } = useQuery("get_metrics", async () => {
        return await handleGet<{ metrics: MetricsDataset[] }>(
            `${host}/metrics?domainId=${domain.id}&clientId=${user?.client.id}`,
            getConfig()
        );
    });

    return (
        <>
            <div className="metrics-container">
                <div className="page-title"><h1> {domainName} </h1></div>
                <Breadcrumb items={[
                    {
                        label: "Dashboard",
                        path: "/dashboard"
                    },
                    {
                        label: "Domains",
                        path: "/domains"
                    },
                    {
                        label: domainName ?? "",
                        path: domain.id.toString()
                    }
                ]} />
                {useQueryMetrics && <LineChart metricsDatasets={useQueryMetrics} metricToStudy={"timeToLoad"} graphTitle={"Time to load (In miliseconds by session)"}/>}
            </div>
        </>
    );
};

export default Domain;