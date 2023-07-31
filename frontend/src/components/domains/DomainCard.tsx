import { Domain } from "@/types";
import Link from "next/link";

const DomainCard = ({ domain }: { domain: Domain }) => {
  // TODO : when we manage analyzing all pages of domain fix it
  const domainName = new URL(domain.url).hostname;

  return <div className="domain-card" key={domain._id}>
      <Link
          className="domain-link"
          href={`/domains/${domain._id}?name=${domain.url}`}
          target="_blank"
      >
          {domainName}
      </Link>
  </div>;
}

export default DomainCard;