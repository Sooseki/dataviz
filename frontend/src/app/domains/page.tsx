"use client";
import { useQuery } from "react-query";
import { handleGet } from "@/api/handleCall";
import { useAuth } from "@/context/AuthContext";
import { Domain } from "../../../src/types";
import Link from "next/link";

const Domains:React.FC = () => {
    const { user} = useAuth();
    /** TODO: CHECK URL PATH */
    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;
    const getDomains = async () => {
        return await handleGet<Domain[]>(`${host}/domains?clientId=${user?.clientId}`);
    };
    const { data: useQueryDomains } = useQuery("get_domains", getDomains);

    return (
        <>  
            <div className="domains-container">
                {useQueryDomains?.data.map((domain) => (
                    <div className="domain-card" key={domain.id}>
                        <a className="domain-link" href={domain.url}></a>
                        <Link className='miscellaneous-services-link' href={`/domains/${domain.id}`}>Domain metrics page</Link>
                        {domain.id}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Domains;