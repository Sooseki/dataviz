import {faChartSimple, faSitemap, faPeopleCarry
    //faChartPie, faChartLine 
} from "@fortawesome/free-solid-svg-icons";

export const navConfig = {
    "Dashboard": {
        name: "Dashboard",
        href: "/dashboard",
        icon: faSitemap
    },
    "Domains": {
        name: "Domains",
        href: "/dashboard/domains",
        icon: faChartSimple
    },
    "User Manager": {
        name: "User Manager",
        href: "/dashboard/user/manager",
        icon: faPeopleCarry
    },
};
