import React, { useState } from "react";

function Burger() {
    const [isActive, setIsActive] = useState(false);

    const handleClick = () => {
        setIsActive(!isActive);
        const navigationElement = document.querySelector(".navigation");
        if (navigationElement) {
            navigationElement.classList.toggle("navigation_active");
        }
    };

    return (
        <div className="burgerContainer">
            <svg
                className={`burger-btn ${isActive ? "active" : ""}`}
                width="80"
                height="52"
                viewBox="0 0 40 26"
                xmlns="http://www.w3.org/2000/svg"
                onClick={handleClick}
            >
                <rect className="burger-btn--1" width="25" height="3" rx="3" ry="3" />
                <rect className="burger-btn--2" width="25" height="3" y="7" rx="3" ry="3" />
                <rect className="burger-btn--3" width="25" height="3" y="14" rx="3" ry="3" />
            </svg>
        </div>
    );
}

export default Burger;