import React, { useEffect } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale"; 
import { PercentUsedListProps } from "@/types";

const PercentUsedList: React.FC<PercentUsedListProps> = ({ metricsData }) => {
    const lastMetricsTable = metricsData.data.metrics[metricsData.data.metrics.length - 1];
    const jsUseRate = lastMetricsTable?.jsUseRate;
    const date = lastMetricsTable?.date;
    const timeToLoad = lastMetricsTable?.timeToLoad;
    const cumulativeLayoutShift = lastMetricsTable?.cumulativeLayoutShift;
    const totalBlockingTime = lastMetricsTable?.totalBlockingTime;
    const firstContentfulPaint = lastMetricsTable?.firstContentfulPaint ;
    const timeToInteractive = lastMetricsTable?.timeToInteractive;

    const formattedDate = date ? format(parseISO(date), "d MMMM HH:mm", { locale: fr }) : "";

    useEffect(() => {
        const setProgressWidth = () => {
            const progressInElements = document.querySelectorAll(".jsuserate_progressIn");
            
            progressInElements.forEach((element) => {
                const dataWidth = element.getAttribute("data-width");
                if (dataWidth) {
                    element.style.width = dataWidth;
                }
            });
        };

        setProgressWidth();
    }, []);

    return (
        <div>
            <h3 className="singledomain_lastScanTitle">Date du dernier scan: {formattedDate}</h3>
            <div className="singledomain_lastScanContainer">
                <p className="singledomain_singleData"> <span>{timeToLoad}</span> timeToLoad </p>
                <p className="singledomain_singleData"> <span>{firstContentfulPaint}</span> firstContentfulPaint </p>
                <p className="singledomain_singleData"> <span>{cumulativeLayoutShift}</span> cumulativeLayoutShift  </p>
                <p className="singledomain_singleData"> <span>{totalBlockingTime}</span> totalBlockingTime  </p>
                <p className="singledomain_singleData"> <span>{timeToInteractive}</span> timeToInteractive  </p>
            </div>
            <p className="jsuserate_alljsTitle">% d'utilisation du Javascript</p>
            <ul className="jsuserate_alljs">
                {jsUseRate ? (
                    jsUseRate.map((item, index) => (
                        <li className="jsuserate_singleFile" key={index}>
                            <div className="jsuserate_progressOut">
                                <div data-width={item.percentUsed} className="jsuserate_progressIn"></div>
                                <p>{item.percentUsed}</p>
                            </div>
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                {item.url}
                            </a>
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
