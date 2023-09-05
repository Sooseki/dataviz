import { IClientPopulated } from "@perfguardian/common/types";

export const clientDomainExists = (client: IClientPopulated, url: string): boolean => {
    return !!client.domains.find((domain) => domain.url === url);
};
