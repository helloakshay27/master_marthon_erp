import React from 'react'
import Select from 'react-select';

export default function MultiSelector({ options, value, onChange, placeholder }) {
    // const customStyles = {
    //     // control: (base) => ({
    //     //   ...base,
    //     //   maxHeight: "65px", 
    //     //   overflowY: "auto",
    //     //   position: "relative", // Ensures proper positioning
    //     //   zIndex: 10, // Make sure it's above other elements like the table
    //     // })


    //     control: (base) => ({
    //       ...base,
    //       maxHeight: "65px", 
    //       overflowY: "auto",
    //       position: "relative", // Ensures proper positioning
    //       zIndex: 10, // Make sure it's above other elements like the table
    //     }),
    //     menu: (base) => ({
    //       ...base,
    //       zIndex: 9999, // Ensure the dropdown menu is on top
    //       position: "absolute", // Absolute positioning to pop out above table
    //       top: "100%", // Position the dropdown right below the control (adjust if needed)
    //     }),
    //     option: (base) => ({
    //       ...base,
    //       zIndex: 9999, // Ensure individual options are on top of other elements
    //     }),
    //   };

      const customStyles = {
        control: (base) => ({
          ...base,
          maxHeight: "65px",
          overflowY: "auto",
          position: "relative",
          zIndex: 10,
          border: "1px solid #ccc", // Custom border for control
        }),
        menu: (base) => ({
          ...base,
          zIndex: 9999,
          position: "absolute",
          top: "100%",
        }),
        option: (base, state) => ({
          ...base,
          zIndex: 9999,
          backgroundColor: state.isSelected
            ? "#D3D3D3" // Gray background for selected option in the dropdown
            : state.isFocused
            ? "#8b0203" // Custom background color on hover
            : "transparent", // Default background is transparent
          color: state.isSelected
            ? "#333" // Keep selected option text color dark
            : state.isFocused
            ? "white" // White text when hovering over an option
            : "black", // Default text color
          cursor: "pointer",
          padding: "10px", // Optional padding to make options more clickable
          borderRadius: "4px", // Optional border radius for rounded options
        }),
        singleValue: (base) => ({
          ...base,
          color: "#333", // Custom color for selected value text
          backgroundColor: "transparent", // Ensure no background color is applied when selected
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: "#8b0203", // Change the dropdown arrow color
        }),
        clearIndicator: (base) => ({
          ...base,
          color: "#8b0203", // Color of the 'clear' X icon when an option is selected
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
