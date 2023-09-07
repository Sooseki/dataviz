// DomainDashboardCard.tsx
import React from "react";
import { Domain, MetricsDataset } from "@perfguardian/common/src/types";

type DomainDashboardCardProps = {
    domain: Domain;
    metrics?: MetricsDataset[];
};

const DomainDashboardCard: React.FC<DomainDashboardCardProps> = ({
    domain,
    metrics,
}) => {

    const latestMetrics = metrics?.length ? metrics[metrics.length - 1] : null;
    const previousMetrics =
        metrics?.length > 1 ? metrics[metrics.length - 2] : null;

    const compareMetric = (current: number, previous: number) => {
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
