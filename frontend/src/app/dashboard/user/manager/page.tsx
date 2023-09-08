"use client";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import GetUsers from "../../../../components/user/manager/GetUsers";
import { useAuth } from "../../../../context/AuthContext";

const UserManager = () => {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <>
            <div className="domains-container">
                <div className="page-title">
                    <h1>User Manager</h1>
                </div>
                <Breadcrumb
                    items={[
                        {
                            label: "Dashboard",
                            path: "/dashboard",
                        },
                        {
                            label: "User Manager",
                            path: "/dashboard/user/manager",
                        },
                    ]}
                />
                <GetUsers />
            </div>
        </>
    );
};

export default UserManager;
