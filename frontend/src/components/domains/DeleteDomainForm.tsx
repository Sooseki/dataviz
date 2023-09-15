import { handleDelete } from "../../api/handleCall";
import { useAuth } from "../../context/AuthContext";
import { Domain } from "@perfguardian/common/src/types";
import { Button } from "antd";

const DeleteDomainForm = ({
    closeModal,
    domain,
    refetch,
}: {
    closeModal: VoidFunction;
    domain: Domain;
    refetch: VoidFunction;
}) => {
    const { getConfig } = useAuth();

    // TODO : when we manage analyzing all pages of domain fix it
    const domainName = new URL(domain.url).hostname;
    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;

    const handleDomainDelete = async () => {
        await handleDelete(`${host}/domains?id=${domain._id}`, getConfig());
        refetch();
        closeModal();
    };

    return (
        <div key={domain._id}>
            <h3 className="delete-domain-modal-content">
                Supprimer {domainName}
            </h3>
            <p className="delete-domain-modal-content">
                Vous allez supprimer le domaine {domainName} et toutes les
                données relatives à ce domaine. Voulez-vous confirmer ?
            </p>
            <div className="delete-domain-modal-actions">
                <Button onClick={closeModal}>Annuler</Button>
                <Button className="warning-button" onClick={handleDomainDelete}>
                    Supprimer
                </Button>
            </div>
        </div>
    );
};

export default DeleteDomainForm;
