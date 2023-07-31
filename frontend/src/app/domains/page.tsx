"use client";

import DomainCards from "@/components/domains/DomainCards";
import { useQuery } from "react-query";
import { handleGet } from "@/api/handleCall";
import { useAuth } from "@/context/AuthContext";
import { Domain } from "@/types";
import { useRouter } from "next/navigation";

const Domains: React.FC<{ params: { dounga: string; name: string} }> = ({ params }) => {
    const { user } = useAuth();
    const router = useRouter();

    if (!user) {
      router.push('/login');
      return null;
    }

    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;

    const { data: useQueryDomains } = useQuery("domains", async () => {
        const domain = await handleGet<{ domains: Domain[] }>(
            `${host}/domains?clientId=${user.client.id}`
        );
        return domain;
    });

    return (
        <>
            <div className="domains-container">
                <div className="page-title">
                  <h1>Domaines</h1>
                </div>
                <DomainCards domains={useQueryDomains?.data?.domains ?? []} />
            </div>
        </>
    );
};

export default Domains;