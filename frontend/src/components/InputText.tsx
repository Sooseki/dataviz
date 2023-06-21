import React, { ChangeEvent } from 'react';

interface InputProps {
    label: string;
    value: string;
    type: string;
    name: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputText = ({ type, label, value, name, onChange }: InputProps) => {
    return (
<<<<<<< HEAD:frontend/src/components/input-text.tsx
        <div className='user-data-input'>
=======
        <div className='user-data-input text-over-background'>
>>>>>>> cf251fdac051715cd307d86c2e10fe9c4c7f5193:frontend/src/components/InputText.tsx
            <label>{label}</label>
            <input type={type} value={value} name={name} onChange={onChange} />
        </div>
    );
};

export default InputText;
