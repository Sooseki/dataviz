"use client";
import { handleGet } from "@/api/handleCall";
import { useQuery } from "react-query";
import { Metrics } from "@/types";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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
    
    return (
        <>
            <div className="metrics-container">
                <h1> {domainName} </h1>
                {useQueryMetrics?.data?.metrics.map((metric) => {
                    return (
                        <div key={metric._id}>
                            <p>
                                Time to Load : {metric.timeToLoad}
                            </p>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Domain;