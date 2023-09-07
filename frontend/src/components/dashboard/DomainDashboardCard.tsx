// DomainDashboardCard.tsx
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
    const { user, getConfig } = useAuth();

    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;

    const { data: domainsMetrics } = useQuery(domain._id, async () => {
        return await handleGet<{ metrics: MetricsDataset[] }>(
            `${host}/metrics?domainId=${domain._id}&clientId=${user?.client.id}`,
            getConfig()
        );
    });

    if (!domainsMetrics || !domainsMetrics?.data?.metrics) {
        return null;
    }
    const metrics = domainsMetrics.data.metrics;
    const latestMetrics = metrics.length ? metrics[metrics.length - 1] : null;
    const previousMetrics =
        metrics.length > 1 ? metrics[metrics.length - 2] : null;

    const compareMetric = (
        current: number | undefined,
        previous: number | undefined
    ) => {
        if (current === undefined || previous === undefined) return "➡️";
        if (current > previous) return "🔺";
        if (current < previous) return "🔻";
        return "➡️";
    };

    return (
        <div className="domain-card">
            <h3>{domain.url}</h3>
            {latestMetrics && (
                <>
                    <p>
                        <strong>Time To Load:</strong>{" "}
                        {latestMetrics.timeToLoad}
                        {previousMetrics &&
                            ` ${compareMetric(
                                latestMetrics.timeToLoad,
                                previousMetrics.timeToLoad
                            )}`}
                    </p>
                    <p>
                        <strong>First Contentful Paint:</strong>{" "}
                        {latestMetrics.firstContentfulPaint}
                        {previousMetrics &&
                            ` ${compareMetric(
                                latestMetrics.firstContentfulPaint,
                                previousMetrics.firstContentfulPaint
                            )}`}
                    </p>
                    <p>
                        <strong>Cumulative Layout Shift:</strong>{" "}
                        {latestMetrics.cumulativeLayoutShift}
                        {previousMetrics &&
                            ` ${compareMetric(
                                latestMetrics.cumulativeLayoutShift,
                                previousMetrics.cumulativeLayoutShift
                            )}`}
                    </p>
                    <p>
                        <strong>Total Blocking Time:</strong>{" "}
                        {latestMetrics.totalBlockingTime}
                        {previousMetrics &&
                            ` ${compareMetric(
                                latestMetrics.totalBlockingTime,
                                previousMetrics.totalBlockingTime
                            )}`}
                    </p>
                    <p>
                        <strong>Time To Interactive:</strong>{" "}
                        {latestMetrics.timeToInteractive}
                        {previousMetrics &&
                            ` ${compareMetric(
                                latestMetrics.timeToInteractive,
                                previousMetrics.timeToInteractive
                            )}`}
                    </p>
                </>
            )}
        </div>
    );
};

export default DomainDashboardCard;
