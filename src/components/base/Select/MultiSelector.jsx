import React from 'react'
import Select from 'react-select';

export default function MultiSelector({ options, value, onChange, placeholder }) {
    const customStyles = {
        // control: (base) => ({
        //   ...base,
        //   maxHeight: "65px", 
        //   overflowY: "auto",
        //   position: "relative", // Ensures proper positioning
        //   zIndex: 10, // Make sure it's above other elements like the table
        // })


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
