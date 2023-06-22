import React from 'react';

interface ButtonProps {
    text: string;
}

const SubmitButton = ({ text }: ButtonProps) => {
    return (
        <button type="submit" className="main-button">{text}</button>
    );
};

export default SubmitButton;
