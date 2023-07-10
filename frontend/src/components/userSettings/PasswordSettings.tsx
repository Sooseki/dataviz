import { useAuth } from "@/context/AuthContext";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import InputText from "../InputText";
import { toast } from "react-toastify";
import SubmitButton from "../button/SubmitButton";

const PasswordSettings = () => {
    const router = useRouter();
    const { user, changePassword } = useAuth();
    const [ inputError, setInputError ] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");

    if (!changePassword) return null;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!currentPassword) {
            setInputError("Current password must be provided.")
            return;
        }

        if (!newPassword || !newPasswordConfirmation) {
            setInputError("New password must be provided.")
            return;
        }

        if (newPassword !== newPasswordConfirmation) {
            setInputError("New password and new password confirmation don't match.")
            return;
        }
        
        try {
            changePassword(user.email, newPassword, currentPassword)
            toast(
                "Password changed successfully !", 
                { 
                    type: "success",
                    theme: "colored",
                    position: "bottom-left"
                }
            )
        } catch (err) {
            toast(
                "There has been an error in reseting your password. Please try again.", 
                { 
                    type: "error",
                    theme: "colored",
                    position: "bottom-left"
                }
            )
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="password-settings">
                {inputError &&
                    <div className="form-input-error">{inputError}</div>
                }
                <InputText 
                    name="currentPassword" 
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    label="Current password"
                    type="password"
                    value={currentPassword}
                />
                <InputText 
                    name="newPassword"
                    onChange={(event) => setNewPassword(event.target.value)}
                    label="New password"
                    type="password"
                    value={newPassword}
                />
                <InputText 
                    name="newPasswordConfirmation"
                    onChange={(event) => setNewPasswordConfirmation(event.target.value)}
                    label="New password confirmation"
                    type="password"
                    value={newPasswordConfirmation}
                />
                <SubmitButton text="Submit" />
            </form>
        </>
    )
}

export default PasswordSettings;