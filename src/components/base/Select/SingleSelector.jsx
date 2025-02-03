import React from 'react'
import Select from 'react-select';

export default function SingleSelector({ options, value, onChange, placeholder,isDisabled }) {
    const customStyles = {
      // control: (base) => ({
      //   ...base,
      //   maxHeight: "65px",
      //   overflowY: "auto",
      // }),
      control: (base) => ({
        ...base,
        maxHeight: "65px", 
        overflowY: "auto",
        position: "relative", // Ensures proper positioning
        zIndex: 10, // Make sure it's above other elements like the table
      }),
      menu: (base) => ({
        ...base,
        zIndex: 9999, // Ensure the dropdown menu is on top
        position: "absolute", // Absolute positioning to pop out above table
        top: "100%", // Position the dropdown right below the control (adjust if needed)
      }),
      option: (base) => ({
        ...base,
        zIndex: 9999, // Ensure individual options are on top of other elements
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
        isDisabled={isDisabled}
      />
    );
  }
  