import { Domain } from "@perfguardian/common/src/types";
import { Button } from "antd";
import Link from "next/link";
import { useState } from "react";
import Modal from "../modal/Modal";
import DeleteDomainForm from "./DeleteDomainForm";

const DomainCard = ({
    domain,
    refetch,
}: {
    domain: Domain;
    refetch: VoidFunction;
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            <Button
                onClick={() => setIsModalOpen(true)}
                className="domain-delete"
            >
                X
            </Button>
            <Modal
                component={
                    <DeleteDomainForm
                        closeModal={() => setIsModalOpen(false)}
                        domain={domain}
                        refetch={refetch}
                    />
                }
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default DomainCard;
