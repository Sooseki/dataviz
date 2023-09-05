import { useAuth } from "@/context/AuthContext";
import { GetUsersResponse } from "@perfguardian/common/types";
import { useState } from "react";
import { Table, Pagination } from "antd";
import { useQuery } from "react-query";
import { handleGet } from "../../../api/handleCall";
import { toast } from "react-toastify";
import CreateUser from "./CreateUser";
import Modal from "../../../components/modal/Modal";

const GetUsers = () => {
    const { user, getConfig } = useAuth();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const usersPerPage = 10;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const host = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;

    const { data: useQueryUsers, refetch } = useQuery("get_users", async () => {
        const useQueryUsers = await handleGet<GetUsersResponse>(
            `${host}/users?clientId=${user?.client.id}`,
            getConfig()
        );
        if (!useQueryUsers || !useQueryUsers.data?.users) {
            toast(
                "There has been an error in fetching users. Please try again.",
                {
                    type: "error",
                    theme: "colored",
                    position: "bottom-left",
                }
            );
            return undefined;
        }
        toast(`Every user from ${user?.client.name} has been fetched !`, {
            type: "success",
            theme: "colored",
            position: "top-left",
        });
        return useQueryUsers;
    });

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
    ];
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const currentUsers = useQueryUsers?.data?.users?.slice(
        startIndex,
        endIndex
    );

    return (
        <div>
            {currentUsers ? (
                <>
                    <Table
                        dataSource={currentUsers}
                        columns={columns}
                        pagination={false}
                        rowKey={(user) => user.id}
                    />
                    <Pagination
                        current={currentPage}
                        pageSize={usersPerPage}
                        total={useQueryUsers?.data?.users?.length || 0}
                        onChange={(page) => setCurrentPage(page)}
                        style={{ marginTop: "10px", textAlign: "center" }}
                    />
                </>
            ) : (
                <p>Loading users...</p>
            )}
            {user?.role === "administrator" && (
                <>
                    <button
                        className="add-user-button "
                        onClick={() => setIsModalOpen(!isModalOpen)}
                    >
                        Add User
                    </button>
                    <Modal
                        component={
                            <CreateUser
                                closeModal={() => setIsModalOpen(false)}
                                refetch={refetch}
                            />
                        }
                        isOpen={isModalOpen}
                        closeModal={() => setIsModalOpen(false)}
                    />
                </>
            )}
        </div>
    );
};

export default GetUsers;
