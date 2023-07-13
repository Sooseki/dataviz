import { useAuth } from "@/context/AuthContext";
import { FormEvent, useState } from "react";
// import { useRouter } from "next/navigation";
import InputText from "../InputText";
import { toast } from "react-toastify";
import SubmitButton from "../button/SubmitButton";


const InfoSettings = () => {
    // const router = useRouter();
    const { user, changeOtherInfo } = useAuth();
    const [inputError, setInputError] = useState("");
    const [userName, setUserName] = useState("");

    const [userMail, setUserMail] = useState("");

    if (!changeOtherInfo) return null;
    // console.log(user);
    // console.log("userName");
    // console.log(user?.name);
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            changeOtherInfo(userMail, userName, user?.id);
            console.log(userMail, userName, user?.id);
            toast(
                "Password changed successfully !",
                {
                    type: "success",
                    theme: "colored",
                    position: "bottom-left"
                }
            );
        } catch (err) {
            toast(
                "There has been an error in reseting your password. Please try again.",
                {
                    type: "error",
                    theme: "colored",
                    position: "bottom-left"
                }
            );
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="password-settings">
                {inputError &&
                    <div className="form-input-error">{inputError}</div>
                }
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