import { Domain } from "domain";
import DomainCard from "./DomainCard";
import { useState } from "react";
import Modal from "../modal/Modal";
import NewDomainForm from "./NewDomainForm";

const DomainCards = ({ domains }: { domains: Domain[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return <>
    <div className="domainsCards">
      {
        domains.map((domain) => <DomainCard domain={domain} />)
      }
      <button className="domainCard" onClick={() => setIsModalOpen(!isModalOpen)}>+ Ajouter un domaine</button>
    </div>
    <Modal component={<NewDomainForm />} isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
  </>;
}

export default DomainCards;