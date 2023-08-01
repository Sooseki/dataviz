"use client";

import Tabs from "@/components/tabs/Tabs";
import PasswordSettings from "@/components/user/settings/PasswordSettings";
import ThemeSettings from "@/components/user/settings/ThemeSettings";

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