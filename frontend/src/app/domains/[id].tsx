import { handleGet } from "@/api/handleCall";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "react-query";
import { Metrics } from "@/types";

const Domain: React.FC = () => {
    const { user } = useAuth();
    /** TODO: CHECK URL PATH */
    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;
    const getMetrics = async () => {
        return await handleGet<Metrics[]>(`${host}/metrics?domainId=${domain.id}?clientId=${user?.clientId}`);
    };
    const { data: useQueryDomains } = useQuery("domains", getMetrics);
    return (
        <>
            <div className="metrics-container">
                {useQueryDomains?.data.map((metric) => (
                    <>
                        <p key={metric.id}>{metric.timeToLoad}</p>
                    </>
                ))}
            </div>
        </>
    );
};

export default Domain;

