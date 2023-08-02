"use client";

import DomainCards from "@/components/domains/DomainCards";

const Domains = () => {
    return (
        <>
            <div className="domains-container">
                <div className="page-title">
                    <h1>Domains</h1>
                </div>
                <DomainCards />
            </div>
        </>
    );
};

export default Domains;