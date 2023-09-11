import { Domain } from "@perfguardian/common/src/types";
import { Button } from "antd";
import Link from "next/link";

const DomainCard = ({ domain }: { domain: Domain }) => {
    // TODO : when we manage analyzing all pages of domain fix it
    const domainName = new URL(domain.url).hostname;

    return (
        <div className="domain-card" key={domain._id}>
            <Link
                className="domain-link"
                href={`/dashboard/domains/${domain._id}?name=${domainName}`}
            >
                {domainName}
            </Link>
            <Button className="domain-delete">X</Button>
        </div>
    );
};

export default DomainCard;
