"use client";

import Tabs from "@/components/tabs/Tabs";
import PasswordSettings from "@/components/userSettings/PasswordSettings";
import ThemeSettings from "@/components/userSettings/ThemeSettings";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const UserSettings = () => {
    const router = useRouter();
    const { user } = useAuth();

    // TODO : uncomment these verifications when link to database is made
    // if (!user) { 
    //     router.push("/login");
    //     return null;
    // };

    const tabs = [
        {
            label: "Change password",
            component: <PasswordSettings />,
        },
        {
            label: "Change theme",
            component: <ThemeSettings />,
        }
    ]
    return (
        <>
            <Tabs tabs={tabs} />
        </>
    )
}

export default UserSettings;