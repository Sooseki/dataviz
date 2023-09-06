import { IClientPopulated } from "@perfguardian/common/src/types";

export const clientDomainExists = (
    client: IClientPopulated,
    url: string
): boolean => {
    return !!client.domains.find((domain) => domain.url === url);
};
