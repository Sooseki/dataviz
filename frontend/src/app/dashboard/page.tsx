"use client";

import React from "react";
import { useQuery } from "react-query";
import { useAuth } from "../../context/AuthContext";
import DomainDashboardCard from "../../components/dashboard/DomainDashboardCard";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import { handleGet } from "../../api/handleCall";
import { Domain } from "@perfguardian/common/src/types";

const Dashboard = () => {
    const { user, getConfig } = useAuth();

    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;

    const { data: domainsData } = useQuery(
        "get_domains",
        async () =>
            await handleGet<{ domains: Domain[] }>(
                `${host}/domains?clientId=${user?.client.id}`,
                getConfig()
            )
    );

    return (
        <div className="dashboard">
            <h1>Welcome, {user?.name}</h1>
            <Breadcrumb
                items={[
                    {
                        label: "Dashboard",
                        path: "/dashboard",
                    },
                    {
                        label: "Domains",
                        path: "/dashboard/domains",
                    },
                ]}
            />
            <div className="domains-overview">
                {domainsData?.data?.domains?.map((domain) => (
                    <DomainDashboardCard key={domain._id} domain={domain} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
