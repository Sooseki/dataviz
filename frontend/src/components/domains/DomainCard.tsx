import { Domain } from "@/types";
import Link from "next/link";

const DomainCard = ({ domain }: { domain: Domain }) => {
    // TODO : when we manage analyzing all pages of domain fix it
    const domainName = new URL(domain.url).hostname;
    
    if (!domainName) {
        return null;
    }
    return <div className="domain-card" key={domain._id}>
        <Link
            className="domain-link"
            href={`/dashboard/domains/${domain._id}?name=${domainName}`}
            target="_blank"
        >
            {domainName}
        </Link>
    </div>;
};

export default DomainCard;