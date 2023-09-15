"use client";
import { useState } from "react";
import { handleGet } from "../../../../api/handleCall";
import { useQuery } from "react-query";
import { MetricsDataset } from "@perfguardian/common/src/types";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import PercentUsedList from "../../../../components/charts/LastScan";
import SingleDomainCharts from "../../../../components/charts/SingleDomainCharts";

type Tab = "lastScan" | "allDatas";

const Domain = () => {
    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;
    const domainName = useSearchParams().get("name");
    const domain = useParams();
    const { getConfig } = useAuth();
    const { data: useQueryMetrics } = useQuery("get_metrics", async () => {
        return await handleGet<{ metrics: MetricsDataset[] }>(
            `${host}/metrics?domainId=${domain.id}`,
            getConfig()
        );
    });
    const [activeTab, setActiveTab] = useState("lastScan");
    const handleTabClick = (tab: Tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div className="page-title">
                <h1>{domainName}</h1>
            </div>
            <Breadcrumb
                items={[
                    {
                        label: "Dashboard",
                        path: "/dashboard",
                    },
                    {
                        label: "Domains",
                        path: "/dashboard/domains",
                    },
                    {
                        label: domainName ?? "",
                        path: domain.id.toString(),
                    },
                ]}
            />
            <div className="singledomain_switch">
                <div
                    className={`singledomain_last ${
                        activeTab === "lastScan"
                            ? "singledomain_last-active"
                            : ""
                    }`}
                    onClick={() => handleTabClick("lastScan")}
                >
                    Last Scan Data
                </div>
                <div
                    className={`singledomain_analyse ${
                        activeTab === "allDatas"
                            ? "singledomain_analyse-active"
                            : ""
                    }`}
                    onClick={() => handleTabClick("allDatas")}
                >
                    All Datas
                </div>
            </div>
            <div
                className={`singledomain_lastscan ${
                    activeTab === "lastScan" ? "active" : ""
                }`}
            >
                <div>
                    {useQueryMetrics && (
                        <PercentUsedList metricsData={useQueryMetrics} />
                    )}
                </div>
            </div>
            <div
                className={`singledomain_alldatas ${
                    activeTab === "allDatas" ? "active" : ""
                }`}
            >
                {useQueryMetrics?.data?.metrics && (
                    <SingleDomainCharts
                        metricsData={useQueryMetrics.data.metrics}
                    />
                )}
            </div>
        </>
    );
};

export default Domain;
