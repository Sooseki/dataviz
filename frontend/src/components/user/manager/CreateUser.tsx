import { ChangeEvent, FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { handlePost } from "@/api/handleCall";
import { User } from "@/types";
import { Select } from "antd";
import InputText from "@/components/InputText";
import Image from "next/image";
import SubmitButton from "@/components/button/SubmitButton";


const CreateUser = ({ closeModal, refetch }: { closeModal: VoidFunction, refetch: VoidFunction }) => {
    const { user } = useAuth();
    const [username, setUsername] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userMail, setUserMail] = useState("");
    const [role, setRole] = useState("administrator");

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserPassword(event.target.value);
    };

    const handleUsermailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserMail(event.target.value);
    };

    const handleRoleChange = (value: string) => {
        setRole(value);
    };

    if (!user || user.role !== "administrator") {
        return null;
    }
    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;
    const clientId = user.client.id;
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const createUserResult = await handlePost<{ user: User }>(`${host}/users/create`, { email: userMail, password: userPassword, name: username, clientId, role });

            if (!createUserResult || !createUserResult.data?.user) {
                throw new Error("Could not create a new user");
            }
            toast(
                "User has been created !",
                {
                    type: "success",
                    theme: "colored",
                    position: "bottom-left"
                }
            );
            refetch();
            closeModal();
        } catch (err) {
            console.log("this is error", err);
            toast(
                "There has been an error in user creation. Please try again.",
                {
                    type: "error",
                    theme: "colored",
                    position: "bottom-left"
                }
            );
        }
    };
    return(
        <div className="create-user-container">
            <form onSubmit={handleSubmit} className='create-user-form' method='POST'>
                <Image className="logo" src="/perfguardian-text-and-logo.svg" alt="perfguardian-text-and-logo" width="30" height="30" />
                <InputText placeholder="Donkey Kong" type='text' name='username' label="username" value={username} onChange={handleNameChange} />
                <InputText placeholder="******" type='password' name='password' label="password" value={userPassword} onChange={handlePasswordChange} />
                <InputText placeholder="Donkey@Kong.fr" type='email' name='email' label="email" value={userMail} onChange={handleUsermailChange} />
                <label className="create-user-dropdown-label">Role:</label>
                <Select
                    className="create-user-dropdown"
                    defaultValue="Select a role"
                    onChange={handleRoleChange}
                    options={[
                        {
                            value: "administrator",
                            label: "Administrator",
                        },
                        {
                            value: "collaborator",
                            label: "Collaborator",
                        },
                    ]}
                />
                <SubmitButton text="Submit" />
            </form>
        </div>
    );
};

export default CreateUser;