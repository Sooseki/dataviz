"use client";

import Tabs from "@/components/tabs/Tabs";
import PasswordSettings from "@/components/userSettings/PasswordSettings";
import ThemeSettings from "@/components/userSettings/ThemeSettings";

const UserSettings = () => {
    const tabs = [
        {
            label: "Change password",
            component: <PasswordSettings />,
        },
        {
            label: "Change theme",
            component: <ThemeSettings />,
        }
    ];
    return (
        <>
            <Tabs tabs={tabs} />
        </>
    );
};

export default UserSettings;