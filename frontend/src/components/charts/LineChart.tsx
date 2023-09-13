import {
    Chart as ChartJS,
    ChartData,
    ChartOptions,
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { MetricsDataset } from "@perfguardian/common/src/types";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    ChartDataLabels,
    CategoryScale,
    Title,
    Tooltip,
    Legend
);

type MetricProperty = keyof MetricsDataset;

interface props {
    metricsDatasets: MetricsDataset[];
    metricToStudy: MetricProperty;
    graphTitle: string;
    minY?: number;
    maxY?: number;
}

const LineChart = ({
    metricsDatasets,
    metricToStudy,
    graphTitle,
    minY,
    maxY,
}: props) => {
    const convertedMetrics = metricsDatasets.map((dataset) => {
        const date = new Date(dataset.date);
        return {
            ...dataset,
            date: date.toLocaleString("fr-FR"),
        };
    });

    if (!convertedMetrics) {
        return null;
    }

    const chartData: ChartData<"line"> = {
        labels: convertedMetrics?.map((dataset) => {
            return dataset.date;
        }),
        datasets: [
            {
                label: metricToStudy,
                data: convertedMetrics.map(
                    (dataset) => dataset[metricToStudy] as number
                ),
                fill: false,
                backgroundColor: "transparent",
                borderColor: "#06a1e1",
                tension: 0.1,
                borderWidth: 4,
            },
        ],
    };

    const options: ChartOptions<"line"> = {
        interaction: {
            intersect: false,
            mode: "index",
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: true,
                },
            },
            y: {
                display: true,
                grid: {
                    display: true,
                },
                min: minY,
                max: maxY,
            },
        },
        plugins: {
            tooltip: {
                enabled: true,
                mode: "index",
                intersect: false,
            },
            legend: {
                display: true,
                position: "top",
            },
            title: {
                display: true,
                text: graphTitle,
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
                    right: 2,
                },
                labels: {
                    title: {
                        font: {
                            weight: "bold",
                        },
                    },
                    value: {
                        color: "black",
                    },
                },
            },
        },
    };

    return (
        <div className="graph-container">
            <Line
                data={chartData}
                plugins={[ChartDataLabels]}
                options={options}
            />
        </div>
    );
};

export default LineChart;
