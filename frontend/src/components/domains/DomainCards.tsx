import DomainCard from "./DomainCard";
import { useState } from "react";
import Modal from "../modal/Modal";
import NewDomainForm from "./NewDomainForm";
import { Domain } from "@/types";

const DomainCards = ({ domains }: { domains: Domain[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return <>
    <div className="domains-cards">
      {
        domains.map((domain, key) => <DomainCard key={key} domain={domain} />)
      }
      <button className="domain-card" onClick={() => setIsModalOpen(!isModalOpen)}>+ Ajouter un domaine</button>
    </div>
    <Modal component={<NewDomainForm closeModal={() => setIsModalOpen(false)}/>} isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
  </>;
}

export default DomainCards;