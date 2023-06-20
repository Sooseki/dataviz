import React, { ChangeEvent } from 'react';

interface InputProps {
    label: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputText: React.FC<InputProps> = ({ label, value, onChange }) => {
    return (
        <div className='user-data-input'>
            <label>{label}</label>
            <input type="text" value={value} onChange={onChange} />
        </div>
    );
};

export default InputText;
