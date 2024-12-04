import React from 'react'
import Select from 'react-select';

export default function MultiSelector({ options, value, onChange, placeholder }) {
    const customStyles = {
        control: (base) => ({
          ...base,
          maxHeight: "65px", 
          overflowY: "auto",
        })
      };
    return (
        <Select
          isMulti
          options={options}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="basic-multi-select"
          classNamePrefix="select"
          styles={customStyles}
        />
      );
}
