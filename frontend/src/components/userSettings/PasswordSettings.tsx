import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import InputText from "../InputText";
import { useRouter } from "next/navigation";

const PasswordSettings = () => {
    const router = useRouter();
    const { user, changePassword } = useAuth();
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");

    // TODO : uncomment these verifications when link to database is made
    // if (!user || !user.email) { 
    //     router.push("/login");
    //     return null;
    // };

    if (!changePassword) return null;

    const handleSubmit = () => {
        if (!currentPassword) return // toast
        if (!newPassword || !newPasswordConfirmation) return // toast
        if (newPassword !== newPasswordConfirmation) return // toast
        changePassword(user.email, newPassword, currentPassword)

        // success toast
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="password-settings">
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
            </form>
        </>
    )
}

export default PasswordSettings;