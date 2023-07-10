import React, { ChangeEvent } from "react";

interface InputProps {
    label: string;
    value: string;
    type: string;
    name: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputText = ({ type, label, value, name, onChange }: InputProps) => {
    return (
        <div className='user-data-input text-over-background'>
            <label>{label}</label>
            <input type={type} value={value} name={name} onChange={onChange} />
        </div>
    );
};

export default InputText;
