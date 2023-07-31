"use client";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

const Home = () => {

    return (
        <div>
            <h1>Dashboard</h1>
            <Breadcrumb items={[
                {
                    label: "Dashboard",
                    path: "/"
                }
            ]}/>
        </div>
    );
};

export default Home;
