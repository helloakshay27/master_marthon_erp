import React from "react";
import Select from "react-select";

export default function SingleSelector({
  options,
  value,
  onChange,
  placeholder,
  isDisabled,
}) {
  const customStyles = {
    control: (base) => ({
      ...base,
      maxHeight: "50px",
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
      options={options} // Options for dropdown
      value={value} // Currently selected value
      onChange={onChange} // Callback for when value changes
      placeholder={placeholder} // Placeholder text
      className="basic-single-select" // Custom class
      classNamePrefix="select"
      styles={customStyles}
      isDisabled={isDisabled}
      isSearchable={true} // Enable the search bar
      isClearable={true} // Enable the clear (cancel) functionality for the selected value
      closeMenuOnSelect={true} // Optionally close the menu when a selection is made
      // menuPlacement="top" // Make dropdown appear above the input field
      // menuPosition="fixed" 

      // className="basic-single-select custom-select"
      // classNamePrefix="select"
      // classNamePrefix="react-select"


    />
  );
}
