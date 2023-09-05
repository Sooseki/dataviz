"use client";

import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import DomainCards from "../../../components/domains/DomainCards";

const Domains = () => {
    return (
        <>
            <div className="domains-container">
                <div className="page-title">
                    <h1>Domains</h1>
                </div>
                <Breadcrumb
                    items={[
                        {
                            label: "Dashboard",
                            path: "/dashboard",
                        },
                        {
                            label: "Domains",
                            path: "/domains",
                        },
                    ]}
                />
                <DomainCards />
            </div>
        </>
    );
};

export default Domains;
