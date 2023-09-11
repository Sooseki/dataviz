import { handleDelete } from "../../api/handleCall";
import { useAuth } from "../../context/AuthContext";
import { Domain } from "@perfguardian/common/src/types";
import { Button } from "antd";
import Link from "next/link";

const DomainCard = ({
    domain,
    refetch,
}: {
    domain: Domain;
    refetch: VoidFunction;
}) => {
    const { getConfig } = useAuth();
    // TODO : when we manage analyzing all pages of domain fix it
    const domainName = new URL(domain.url).hostname;
    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;

    const handleDomainDelete = async (id: string) => {
        await handleDelete(`${host}/domains?id=${id}`, getConfig());
        refetch();
    };

    return (
        <div className="domain-card" key={domain._id}>
            <Link
                className="domain-link"
                href={`/dashboard/domains/${domain._id}?name=${domainName}`}
            >
                {domainName}
            </Link>
            <Button
                onClick={() => handleDomainDelete(domain._id)}
                className="domain-delete"
            >
                X
            </Button>
        </div>
    );
};

export default DomainCard;
