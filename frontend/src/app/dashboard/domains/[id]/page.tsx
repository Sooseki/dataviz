"use client";
import { handleGet } from "@/api/handleCall";
import { useQuery } from "react-query";
import { Metrics } from "@/types";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

const Domain = () => {
    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;
    const domainName = useSearchParams().get("name");
    const domain = useParams();
    const { user } = useAuth();

    const { data: useQueryMetrics } = useQuery("metrics", async () => {
        return await handleGet<{ metrics: Metrics[] }>(
            `${host}/metrics?domainId=${domain.id}&clientId=${user?.client.id}`
        );
    });
    
    return (
        <>
            <div className="metrics-container">
                <div className="page-title"><h1> {domainName} </h1></div>
                <Breadcrumb items={[
                    {
                        label: "Dashboard",
                        path: "/dashboard"
                    },
                    {
                        label: "Domains",
                        path: "/domains"
                    },
                    {
                        label: domainName ?? "",
                        path: domain.id.toString()
                    }
                ]} />
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