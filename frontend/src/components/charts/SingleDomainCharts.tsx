import { useMemo, useState } from "react";
import DateRangePicker from "./DatePicker";
import LineChart from "./LineChart";
import { MetricsDataset } from "@perfguardian/common";

interface Props {
    metricsData: MetricsDataset[];
}

const SingleDomainCharts = ({ metricsData }: Props) => {
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
        if (!selectedStartDate || !selectedEndDate || !metricsData) {
            return metricsData;
        }

        return metricsData.filter(
            (metric) =>
                new Date(metric.date) >= selectedStartDate &&
                new Date(metric.date) <= selectedEndDate
        );
    };

    const filteredMetrics = useMemo(filterMetrics, [
        metricsData,
        selectedStartDate,
        selectedEndDate,
    ]);

    return (
        <div>
            <DateRangePicker onChange={handleDateRangeChange} />
            <div className="singleDomainCharts">
                <LineChart
                    metricsDatasets={filteredMetrics}
                    metricToStudy={"timeToLoad"}
                    graphTitle={"Time to load (In seconds by session)"}
                    minY={0}
                    maxY={1}
                />
                <LineChart
                    metricsDatasets={filteredMetrics}
                    metricToStudy={"firstContentfulPaint"}
                    graphTitle={"First content fulPaint (In second by session)"}
                    minY={0}
                    maxY={5}
                />
                <LineChart
                    metricsDatasets={filteredMetrics}
                    metricToStudy={"cumulativeLayoutShift"}
                    graphTitle={"Cumulative layout shift"}
                    minY={0}
                    maxY={1}
                />
                <LineChart
                    metricsDatasets={filteredMetrics}
                    metricToStudy={"totalBlockingTime"}
                    graphTitle={"Total blocking time (In seconds by session)"}
                />
                <LineChart
                    metricsDatasets={filteredMetrics}
                    metricToStudy={"timeToInteractive"}
                    graphTitle={"Time to interactive (In second by session)"}
                    minY={0}
                    maxY={10}
                />
            </div>
        </div>
    );
};

export default SingleDomainCharts;
