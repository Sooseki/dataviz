import { IClient } from "../types";

export const clientDomainExists = (client: IClient, url: string): boolean => {
    return !!client.domains.find((domain) => domain.url === url);
}