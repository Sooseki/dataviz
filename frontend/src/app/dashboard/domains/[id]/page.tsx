"use client";
import { handleGet } from "@/api/handleCall";
import { useQuery } from "react-query";
import { Metrics } from "@/types";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Chart as ChartJS, ChartData, ChartOptions, TimeScale, LinearScale, PointElement, LineElement, LogarithmicScale, CategoryScale, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { utcToZonedTime, format } from "date-fns-tz";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, LogarithmicScale, ChartDataLabels, CategoryScale, Title, Tooltip, Legend);

const Domain = () => {
    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;
    const domainName = useSearchParams().get("name");
    const domain= useParams();
    const { user } = useAuth();

    const { data: useQueryMetrics } = useQuery("metrics", async () => {
        return await handleGet<{ metrics: Metrics[] }>(
            `${host}/metrics?domainId=${domain.id}&clientId=${user?.client.id}`
        );
    });
    const timezone = "Europe/paris";
    const convertedMetrics = useQueryMetrics?.data?.metrics.map((metric) => {
        const utcDate = new Date(metric.date);
        const localDate = utcToZonedTime(utcDate, timezone);
        const formattedDate = format(localDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");

        return {
            ...metric,
            date: formattedDate,
        };
    });
    console.log(convertedMetrics);
    if (!convertedMetrics) {
        return null;
    }

    const chartData: ChartData<"line"> = {
        labels: convertedMetrics?.map((dataset) => {
            const dateObject = new Date(dataset.date);
            return format(dateObject, "dd/MM HH:mm:ss");
        }),
        datasets: [
            {
                label: "TimeToLoad",
                data: convertedMetrics.map((dataset) => dataset.timeToLoad),
                fill: false,
                backgroundColor: "transparent",
                borderColor: "#06a1e1",
                tension: 0.1,
                borderWidth: 4
            },
        ],
    };
    
    const options: ChartOptions = {
        scales: {
            x: {
                display: true,
                grid: {
                    display: true
                }
            },
            y: {
                display: true,
                grid: {
                    display: true
                }
            }
        },
        plugins: {
            tooltip: {
                enabled: true, // Display the tooltip
                mode: "index", // Display multiple tooltips when overlapping data points
                intersect: false,
            },
            legend: {
                display: true, // Display the legend
                position: "top", // Change the position of the legend (options: 'top', 'left', 'bottom', 'right')
            },
            title: {
                display: true,
                text: "Time to load (In miliseconds by session)",
                padding: {
                    bottom: 30,
                },
                color: "#00325c",
                font: {
                    size: 13,
                },
                align: "start",
            },
            datalabels: {
                display: true,
                color: "black",
                align: "end",
                padding: {
                    right: 2
                },
                labels: {
                    title: {
                        font: {
                            weight: "bold"
                        }
                    },
                    value: {
                        color: "black"
                    }
                },
                formatter: function (value) {
                    return "\n" + value;
                }
            }
        }
    };
    
    return (
        <>
            <div className="metrics-container">
                <h1> {domainName} </h1>
                <div className="graph-container">
                    <Line data={chartData} plugins={[ChartDataLabels]} options={options} />
                </div>
            </div>
        </>
    );
};

export default Domain;