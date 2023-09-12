import { FormEvent, useState } from "react";
import InputText from "../InputText";
import { handlePost } from "../../api/handleCall";
import { Domain } from "domain";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const NewDomainForm = ({
    closeModal,
    refetch,
}: {
    closeModal: VoidFunction;
    refetch: VoidFunction;
}) => {
    const { getConfig } = useAuth();
    const [newDomain, setNewDomain] = useState("");
    const [inputError, setInputError] = useState("");
    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newDomain === "") {
            setInputError("Please fill in an URL !");
            return;
        }
        try {
            const data = await handlePost<{ domain: Domain }>(
                `${host}/domains/create`,
                { url: newDomain },
                getConfig()
            );

            if (data?.error) throw new Error(data.error);

            toast("Domain added with success !", {
                type: "success",
                theme: "colored",
                position: "bottom-left",
            });
            refetch();
            closeModal();
        } catch (err) {
            console.log("this is error", err);
            toast(
                err instanceof Error
                    ? err.message
                    : "This domain could not be added. Try Again",
                {
                    type: "error",
                    theme: "colored",
                    position: "bottom-left",
                }
            );
        }
    };

    return (
        <div>
            <h2>add a new Domain</h2>
            <form
                className="create-domain-form"
                method="POST"
                onSubmit={handleSubmit}
            >
                {inputError && (
                    <div className="create-domain-form-input-error">
                        {inputError}
                    </div>
                )}
                <InputText
                    placeholder="E.g: http://www.hetic.net/"
                    name="domain"
                    label="url"
                    value={newDomain}
                    type="text"
                    onChange={(e) => setNewDomain(e.target.value)}
                />
                <button className="add-domain-button" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default NewDomainForm;
