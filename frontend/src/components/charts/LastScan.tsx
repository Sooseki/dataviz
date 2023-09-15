import React, { useEffect } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { MetricsDataset } from "@perfguardian/common/src/types";
import { AxiosResponse } from "../../api/handleCall";
import Image from "next/image";
import { getValueColor } from "@/lib/helpers";

interface PercentUsedListProps {
    metricsData: AxiosResponse<{ metrics: MetricsDataset[] }>;
}

const PercentUsedList: React.FC<PercentUsedListProps> = ({ metricsData }) => {
    useEffect(() => {
        const progressInElements = document.querySelectorAll(
            ".jsuserate_progressIn"
        ) as NodeListOf<HTMLElement>;
        progressInElements.forEach((element) => {
            const dataWidth = element.getAttribute("data-width");
            if (dataWidth) {
                element.style.width = dataWidth;
            }
        });
    }, []);

    if (!metricsData.data || !metricsData.data.metrics.length) {
        return <p>Pas encore de datas revenez plus tard</p>;
    }

    const lastMetricsTable =
        metricsData.data.metrics[metricsData.data.metrics.length - 1];
    if (!lastMetricsTable) {
        return <p>Pas encore de datas revenez plus tard</p>;
    }

    const {
        jsUseRate,
        date,
        timeToLoad,
        cumulativeLayoutShift,
        totalBlockingTime,
        firstContentfulPaint,
        timeToInteractive,
    } = lastMetricsTable;

    const formattedDate = date
        ? format(parseISO(date), "d MMMM HH:mm", { locale: fr })
        : "";

    return (
        <div>
            <h3 className="singledomain_lastScanTitle">
                Date du dernier scan: {formattedDate}
            </h3>
            <div className="singledomain_lastScanContainer">
                <p className="singledomain_singleData">
                    <span
                        style={{
                            color: getValueColor([0, 2], timeToLoad),
                        }}
                    >
                        {timeToLoad}
                    </span>

                    <p className="singledomain_singleInfo">timeToLoad</p>
                </p>
                <p className="singledomain_singleData">
                    <span
                        style={{
                            color: getValueColor([0, 5], firstContentfulPaint),
                        }}
                    >
                        {firstContentfulPaint}
                    </span>

                    <p className="singledomain_singleInfo">
                        firstContentfulPaint{" "}
                        <Image
                            className="singledomain_singleInfoPicto"
                            src="/info.svg"
                            alt="picto info"
                            width="15"
                            height="15"
                        />
                        <div className="singledomain_popup">
                            FCP measures how long it takes the browser to render
                            the first piece of DOM content after a user
                            navigates to your page. Images, non-white canvas
                            elements, and SVGs on your page are considered DOM
                            content; anything inside an iframe is not included.
                        </div>
                    </p>
                </p>
                <p className="singledomain_singleData">
                    <span
                        style={{
                            color: getValueColor([0, 1], cumulativeLayoutShift),
                        }}
                    >
                        {cumulativeLayoutShift}
                    </span>

                    <p className="singledomain_singleInfo">
                        cumulativeLayoutShift{" "}
                        <Image
                            className="singledomain_singleInfoPicto"
                            src="/info.svg"
                            alt="picto info"
                            width="15"
                            height="15"
                        />
                        <div className="singledomain_popup">
                            CLS is a measure of the largest burst of layout
                            shift scores for every unexpected layout shift that
                            occurs during the entire lifespan of a page. A
                            layout shift occurs any time a visible element
                            changes its position from one rendered frame to the
                            next.
                        </div>
                    </p>
                </p>
                <p className="singledomain_singleData">
                    <span
                        style={{
                            color: getValueColor([0.1, 0.3], totalBlockingTime),
                        }}
                    >
                        {totalBlockingTime}
                    </span>

                    <p className="singledomain_singleInfo">
                        totalBlockingTime{" "}
                        <Image
                            className="singledomain_singleInfoPicto"
                            src="/info.svg"
                            alt="picto info"
                            width="15"
                            height="15"
                        />
                        <div className="singledomain_popup">
                            The Total Blocking Time metric measures the total
                            amount of time between First Contentful Paint and
                            Time to Interactive where the main thread was
                            blocked for long enough to prevent input
                            responsiveness.
                        </div>
                    </p>
                </p>
                <p className="singledomain_singleData">
                    <span
                        style={{
                            color: getValueColor([0, 10], timeToInteractive),
                        }}
                    >
                        {timeToInteractive}
                    </span>

                    <p className="singledomain_singleInfo">
                        timeToInteractive{" "}
                        <Image
                            className="singledomain_singleInfoPicto"
                            src="/info.svg"
                            alt="picto info"
                            width="15"
                            height="15"
                        />
                        <div className="singledomain_popup">
                            Time to Interactive is a performance metric that
                            measures a page&apos;s load responsiveness and helps
                            identify situations where a page looks interactive
                            but actually is not.
                        </div>
                    </p>
                </p>
            </div>
            <p className="jsuserate_alljsTitle">
                % d&apos; utilisation du Javascript
            </p>
            <ul className="jsuserate_alljs">
                {jsUseRate ? (
                    jsUseRate
                        .filter((item) => item.totalBytes / 1024 > 5)
                        .map((item, index) => (
                            <li className="jsuserate_singleFile" key={index}>
                                <div className="jsuserate_progressOut">
                                    <div
                                        data-width={item.percentUsed}
                                        className="jsuserate_progressIn"
                                    ></div>
                                    <p>{item.percentUsed}</p>
                                </div>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.url.split("?")[0]}
                                </a>
                                <p className="jsuserate_fileSize">
                                    Taille du fichier &nbsp;
                                    {(item.totalBytes / 1024).toFixed(2)} Ko
                                </p>
                            </li>
                        ))
                ) : (
                    <p>No data available</p>
                )}
            </ul>
        </div>
    );
};

export default PercentUsedList;
