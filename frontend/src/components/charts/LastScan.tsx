import React, { useEffect } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale"; 
import { MetricsDataset } from "@/types";
import { AxiosResponse } from "@/api/handleCall";

interface PercentUsedListProps {
    metricsData: AxiosResponse< {metrics: MetricsDataset[];}>;
}


const PercentUsedList: React.FC<PercentUsedListProps> = ({ metricsData }) => {
    useEffect(() => {
        const progressInElements = document.querySelectorAll(".jsuserate_progressIn");
            
        progressInElements.forEach((element) => {
            const dataWidth = element.getAttribute("data-width");
            if (dataWidth) {
                element.style.width = dataWidth;
            }
        });
    }, []);
    if (!metricsData.data){
        return null;
    }
    const lastMetricsTable = metricsData.data.metrics[metricsData.data.metrics.length - 1];
    const {
        jsUseRate,
        date,
        timeToLoad,
        cumulativeLayoutShift,
        totalBlockingTime,
        firstContentfulPaint,
        timeToInteractive,
    } = lastMetricsTable;

    const formattedDate = date ? format(parseISO(date), "d MMMM HH:mm", { locale: fr }) : "";

    

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
            <p className="jsuserate_alljsTitle">% d&apos; utilisation du Javascript</p>
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
