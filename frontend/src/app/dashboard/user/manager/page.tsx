"use client";
import GetUsers from "@/components/user/manager/GetUsers";
import { useAuth } from "@/context/AuthContext";

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
                <GetUsers />
            </div>
        </>
    );
};

export default UserManager;