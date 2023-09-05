import { useAuth } from "@/context/AuthContext";
import { FormEvent, useState } from "react";
import InputText from "../../InputText";
import SubmitButton from "../../button/SubmitButton";

const InfoSettings = () => {
    const { changeOtherInfo } = useAuth();
    const [userName, setUserName] = useState("");
    const [userMail, setUserMail] = useState("");

    if (!changeOtherInfo) return null;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        changeOtherInfo(userMail, userName);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="password-settings">
                <InputText
                    name="userName"
                    onChange={(event) => setUserName(event.target.value)}
                    label="user name"
                    type="text"
                    value={userName}
                />
                <InputText
                    name="userMail"
                    onChange={(event) => setUserMail(event.target.value)}
                    label="New mail"
                    type="text"
                    value={userMail}
                />
                <SubmitButton text="Submit" />
            </form>
        </>
    );
};

export default InfoSettings;