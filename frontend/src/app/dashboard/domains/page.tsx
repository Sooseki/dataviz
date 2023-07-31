"use client";

import DomainCards from "@/components/domains/DomainCards";

const Domains: React.FC<{ params: { dounga: string; name: string} }> = ({ params }) => {
    return (
        <>
            <div className="domains-container">
                <div className="page-title">
                  <h1>Domaines</h1>
                </div>
                <DomainCards />
            </div>
        </>
    );
};

export default Domains;