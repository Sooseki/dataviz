import { ReactNode } from "react";

export interface TabProps {
    component: ReactNode;
    label: string;
}

const Tab = ({ component }: TabProps) => {
    return (
        <div>
            {component}
        </div>
    );
};

export default Tab;