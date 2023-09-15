import React from "react";
import { Domain, MetricsDataset } from "@perfguardian/common/src/types";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "react-query";
import { handleGet } from "../../api/handleCall";

type DomainDashboardCardProps = {
    domain: Domain;
    metrics?: MetricsDataset[];
};

const DomainDashboardCard: React.FC<DomainDashboardCardProps> = ({
    domain,
}) => {
    const { getConfig } = useAuth();

    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;

    const { data: domainsMetrics } = useQuery(domain._id, async () => {
        return await handleGet<{ metrics: MetricsDataset[] }>(
            `${host}/metrics?domainId=${domain._id}`,
            getConfig()
        );
    });

    if (!domainsMetrics || !domainsMetrics?.data?.metrics) return null;
    const metrics: MetricsDataset[] = domainsMetrics.data.metrics;

    const metricTypes = [
        {
            label: "Time to load",
            average:
                metrics.reduce((a, b) => a + b.timeToLoad, 0) / metrics.length,
            latest: metrics[metrics.length - 1].timeToLoad,
        },
        {
            label: "First contentful paint",
            average:
                metrics.reduce((a, b) => a + b.firstContentfulPaint, 0) /
                metrics.length,
            latest: metrics[metrics.length - 1].firstContentfulPaint,
        },
        {
            label: "Cumulative layout shift",
            average:
                metrics.reduce((a, b) => a + b.cumulativeLayoutShift, 0) /
                metrics.length,
            latest: metrics[metrics.length - 1].cumulativeLayoutShift,
        },
        {
            label: "Total blocking time",
            average:
                metrics.reduce((a, b) => a + b.totalBlockingTime, 0) /
                metrics.length,
            latest: metrics[metrics.length - 1].totalBlockingTime,
        },
        {
            label: "Time to interactive",
            average:
                metrics.reduce((a, b) => a + b.timeToInteractive, 0) /
                metrics.length,
            latest: metrics[metrics.length - 1].timeToInteractive,
        },
    ];

    return (
        <div className="dashboard_card">
            <h3>{new URL(domain.url).hostname}</h3>

            <div className="dashboard_card_metrics">
                {metricTypes.map((metric) => (
                    <div key={metric.label} className="dashboard_card_metric">
                        <strong>{metric.label}</strong>
                        {metric.latest}
                        {compareMetric(metric.latest, metric.average)}
                        <p>AVG: {metric.average}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DomainDashboardCard;

const compareMetric = (
    metric: number | undefined,
    metricToCompare: number | undefined
) => {
    if (!metric || !metricToCompare) return "➡️";
    if (metric > metricToCompare) return "🔺";
    if (metric < metricToCompare) return "🔻";
    return "➡️";
};
