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
      backgroundColor: state.isFocused
        ? "#8b0203" // Custom background color on hover
        : "transparent", // Default background is transparent
      color: state.isFocused ? "white" : "black", // White text on hover
      cursor: "pointer",
      padding: "10px", // Optional padding to make options more clickable
      borderRadius: "4px", // Optional border radius for rounded options
    }),
    singleValue: (base) => ({
      ...base,
      color: "#333", // Custom color for selected value
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "gray", // Change the dropdown arrow color
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
      isClearable={true} //
      isSearchable={true} // Enable the search bar
      closeMenuOnSelect={true} // Optionally close the menu when a selection is made
    />
  );
}
