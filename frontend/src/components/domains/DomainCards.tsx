import DomainCard from "./DomainCard";
import { useState } from "react";
import Modal from "../modal/Modal";
import NewDomainForm from "./NewDomainForm";
import { Domain } from "@/types";
import { useQuery } from "react-query";
import { handleGet } from "@/api/handleCall";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const DomainCards = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;

    const { data: useQueryDomains, refetch } = useQuery("get_domains", async () => 
        await handleGet<{ domains: Domain[] }>(`${host}/domains?clientId=${user?.client.id}`)
    );

    if (!user) {
        router.push("/login");
        return null;
    }


    return <>
        <div className="domains-cards">
            {
                useQueryDomains?.data?.domains.map((domain, key) => <DomainCard key={key} domain={domain} />)
            }
        </div>
        <button className="add-domain-button" onClick={() => setIsModalOpen(!isModalOpen)}>+ Ajouter un domaine</button>
        <Modal component={<NewDomainForm closeModal={() => setIsModalOpen(false)} refetch={refetch}/>} isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
    </>;
};

export default DomainCards;