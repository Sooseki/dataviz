"use client";

import Tabs from "../../../../components/tabs/Tabs";
import PasswordSettings from "../../../../components/user/settings/PasswordSettings";
import ThemeSettings from "../../../../components/user/settings/ThemeSettings";
import InfoSettings from "../../../../components/user/settings/InfoSettings";

const UserSettings = () => {
    const tabs = [
        {
            label: "Change password",
            component: <PasswordSettings />,
        },
        {
            label: "Change theme",
            component: <ThemeSettings />,
        },
        {
            label: "Change user Info",
            component: <InfoSettings />,
        },
    ];
    return (
        <>
            <Tabs tabs={tabs} />
        </>
    );
};

export default UserSettings;
