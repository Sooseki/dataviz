"use client";
import { useQuery } from "react-query";
import { handleGet } from "@/api/handleCall";
import { useAuth } from "@/context/AuthContext";
import { Domain } from "../../../types";
import Link from "next/link";

const Domains: React.FC<{ params: { dounga: string; name: string} }> = ({ params }) => {
    const { user } = useAuth();
    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;

    const { data: useQueryDomains } = useQuery("domains", async () => {
        const domain = await handleGet<{ domains: Domain[] }>(
            `${host}/domains?clientId=${user?.client.id}`
        );
        return domain;
    });

    return (
        <>
            <div className="domains-container">
                {useQueryDomains?.data.domains.map((domain) => {
                    const domainName = new URL(domain.url).hostname;
                    return (
                        <div className="domain-card" key={domain._id}>
                            <Link
                                className="domain-link"
                                href={`/dashboard/domains/${domain._id}?name=${domainName}`}
                                target="_blank"
                            >
                                {domainName}
                            </Link>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Domains;