import { useState } from "react";
import InputText from "../InputText";
import { handlePost } from "@/api/handleCall";
import { Domain } from "domain";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

const NewDomainForm = () => {
  const [newDomain, setNewDomain] = useState("");
  const [inputError, setInputError] = useState("");
  const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;

  const handleSubmit = async () => {
    const { user } = useAuth();

    if(newDomain === "") {
      setInputError("Veuillez renseigner une url")
      return;
    }

    try {
      await handlePost<{ domain: Domain }>(`${host}/domain/create`, { url: newDomain, clientId: user.client.id });
    } catch {
      toast(
        "Ce domaine n'a pas pu être ajouté", 
        { 
            type: "error",
            theme: "colored",
            position: "bottom-left"
        }
      );
    }
  }

  return <div>
    <h2>Ajouter un nouveau domaine</h2>
    <form method="POST" onSubmit={handleSubmit}>
      {inputError && 
        <div className="form-input-error">{inputError}</div>
      }
      <InputText name="domain" label="url" value={newDomain} type="text" onChange={(e) => setNewDomain(e.target.value)} />
      <button type="submit">Valider</button>
    </form>
  </div>;
}

export default NewDomainForm;