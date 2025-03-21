import { MultiSelect } from '@mantine/core';
import {useState} from 'react';
import React from 'react';

interface SelectProps {
    label: string;
    options: string[];
    placeholder: string;
    onChange: (selected: string[]) => void;
  }

const Select: React.FC<SelectProps> = ({ options, label, placeholder, onChange }) => {
    const [value, setValue] = useState<string[]>([]);

    const handleChange = (selectedValues: string[]) => {
        setValue(selectedValues);
        onChange(selectedValues);
    }

    return (
        <MultiSelect
        label= {label}
        placeholder= {placeholder}
        data={options} 
        value={value} 
        onChange={handleChange}
        clearable
        styles={() => ({
            wrapper: { 
              width: 700
            },
          })}
        />
    );
}

export default Select;