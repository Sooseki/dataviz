import { useState } from "react";
import Tab, { TabProps } from "./Tab";

interface Props {
    tabs: TabProps[];
}

const Tabs = ({ tabs }: Props) => {
    const [currentTab, setCurrentTab] = useState(tabs[0]);

    const handleClick = (tab: TabProps) => {
        setCurrentTab(tab);
    }

    return (
        <div className="tabs">
            <div className="tabs-nav">
                {tabs.map((tab) => {
                    return (
                        <button className="tab-button" onClick={() => handleClick(tab)}>
                            {tab.label}
                        </button>
                    )
                })}
            </div>
            <Tab {...currentTab} />
        </div>
    );
}

export default Tabs;