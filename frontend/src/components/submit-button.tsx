import React, { MouseEventHandler } from 'react';

interface ButtonProps {
    text: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
}

const SubmitButton = ({ text, onClick }: ButtonProps) => {
    return (
        <button type="submit" onClick={onClick}>{text}</button>
    );
};

export default SubmitButton;
