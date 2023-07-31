"use client";

import DomainCards from "@/components/domains/DomainCards";
import { Domain } from "domain";

const Domains = () => {
  // TODO : get domains with Juan MR
  const domains = [] as Domain[]

  return <>
    <DomainCards domains={domains} />
  </>;
}

export default Domains;