import React from 'react'
import Select from 'react-select';

export default function SingleSelector({ options, value, onChange, placeholder }) {
    const customStyles = {
      control: (base) => ({
        ...base,
        maxHeight: "65px",
        overflowY: "auto",
      }),
    };
  
    return (
      <Select
        options={options} // Options for dropdown
        value={value} // Currently selected value
        onChange={onChange} // Callback for when value changes
        placeholder={placeholder} // Placeholder text
        className="basic-single-select" // Custom class
        classNamePrefix="select"
        styles={customStyles}
      />
    );
  }
  