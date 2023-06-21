import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useState } from "react";

const PasswordSettings = () => {
    const router = useRouter();
    const { user, changePassword } = useAuth();
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");

    if (!user || !user.email) { 
        router.push("/login");
        return null;
    };

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
            <form onSubmit={handleSubmit}>
                {/* TODO : change to Juan InputText component */}
                <input name="currentPassword" />
                <input name="newPassword" />
                <input name="newPasswordConfirmation" />
            </form>
        </>
    )
}

export default PasswordSettings;