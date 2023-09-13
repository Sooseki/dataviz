"use client";
import { useState, useMemo } from "react";
import { handleGet } from "../../../../api/handleCall";
import { useQuery } from "react-query";
import { MetricsDataset } from "@perfguardian/common/src/types";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import LineChart from "../../../../components/charts/LineChart";
import PercentUsedList from "../../../../components/charts/LastScan";
import DateRangePicker from "../../../../components/charts/DatePicker";

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

    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
        null
    );
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

    const handleDateRangeChange = (
        startDate: Date | null,
        endDate: Date | null
    ) => {
        setSelectedStartDate(startDate);
        setSelectedEndDate(endDate);
    };

    const filterMetrics = () => {
        if (
            !selectedStartDate ||
            !selectedEndDate ||
            !useQueryMetrics?.data?.metrics
        ) {
            return useQueryMetrics?.data?.metrics;
        }

        return useQueryMetrics?.data?.metrics.filter(
            (metric) =>
                new Date(metric.date) >= selectedStartDate &&
                new Date(metric.date) <= selectedEndDate
        );
    };

    const filteredMetrics = useMemo(filterMetrics, [
        useQueryMetrics,
        selectedStartDate,
        selectedEndDate,
    ]);

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
                <DateRangePicker onChange={handleDateRangeChange} />
                {filteredMetrics && (
                    <LineChart
                        metricsDatasets={filteredMetrics}
                        metricToStudy={"timeToLoad"}
                        graphTitle={"Time to load (In seconds by session)"}
                        minY={0}
                        maxY={1}
                    />
                )}
                {filteredMetrics && (
                    <LineChart
                        metricsDatasets={filteredMetrics}
                        metricToStudy={"firstContentfulPaint"}
                        graphTitle={
                            "First content fulPaint (In second by session)"
                        }
                        minY={0}
                        maxY={5}
                    />
                )}
                {filteredMetrics && (
                    <LineChart
                        metricsDatasets={filteredMetrics}
                        metricToStudy={"cumulativeLayoutShift"}
                        graphTitle={"Cumulative layout shift"}
                        minY={0}
                        maxY={1}
                    />
                )}
                {filteredMetrics && (
                    <LineChart
                        metricsDatasets={filteredMetrics}
                        metricToStudy={"totalBlockingTime"}
                        graphTitle={"Time to load (In miliseconds by session)"}
                    />
                )}
                {filteredMetrics && (
                    <LineChart
                        metricsDatasets={filteredMetrics}
                        metricToStudy={"timeToInteractive"}
                        graphTitle={
                            "Time to interactive (In second by session)"
                        }
                        minY={0}
                        maxY={10}
                    />
                )}
            </div>
        </>
    );
};

export default Domain;
