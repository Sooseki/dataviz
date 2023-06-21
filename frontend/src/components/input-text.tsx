import React, { ChangeEvent } from 'react';

interface InputProps {
    label: string;
    value: string;
    type: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputText = ({ type, label, value, onChange }: InputProps) => {
    return (
        <div className='user-data-input'>
            <label>{label}</label>
            <input type={type} value={value} onChange={onChange} />
        </div>
    );
};

export default InputText;
