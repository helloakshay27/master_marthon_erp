import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";

export default function SelectBox({
  label,
  options,
  defaultValue,
  onChange,
  style = {},
  className = "",
  isDisableFirstOption = false, // New prop
  disabled = false, // Add disabled prop
  disabledOptions = [] // New prop to pass option labels to disable
}) {
  const [selectedOption, setSelectedOption] = useState(null); 

  useEffect(() => {
    if (defaultValue) {
      const defaultOption = options.find((option) => option.value === defaultValue);
      setSelectedOption(defaultOption);
    }
  }, [defaultValue, options]);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      maxHeight: "65px",
      overflowY: "auto",
      borderColor: state.isFocused ? "#8b0203" : base.borderColor,
      backgroundColor: disabled ? "#e9ecef" : base.backgroundColor, // Grey out when disabled
      pointerEvents: disabled ? "none" : "auto", // Disable pointer events when disabled
      "&:hover": {
        borderColor: disabled ? base.borderColor : "#8b0203",
      },
      boxShadow: state.isFocused ? "0 0 0 1px #8b0203" : base.boxShadow,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999, // Ensure the dropdown appears above other elements
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999, // Ensure portal menu is on top
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isDisabled
        ? "#e9ecef" // Grey background for disabled options
        : state.isSelected
        ? "#ccc"
        : state.isFocused
        ? "#8b0203"
        : base.backgroundColor,
      color: state.isDisabled
        ? "#6c757d" // Grey text for disabled options
        : state.isSelected
        ? "#000"
        : state.isFocused
        ? "#fff"
        : "#000", // Set text color to black
      cursor: state.isDisabled ? "not-allowed" : "default", // Show not-allowed cursor for disabled options
    }),
    multiValueRemove: (base, state) => ({
      ...base,
      color: state.isFocused ? "#8b0203" : base.color,
      "&:hover": {
        backgroundColor: "#8b0203",
        color: "#fff",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#333", // Dark grey color for selected value
    }),
    placeholder: (base) => ({
      ...base,
      color: "#666", // Dark grey color for placeholder
    }),
  };

  // Disable the first option if isDisableFirstOption is true
  const formattedOptions = options.map((option, index) => ({
    ...option,
    isDisabled:
      (isDisableFirstOption && index === 0) ||
      disabledOptions.includes(option.label), // Disable if label is in the array
  }));

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    onChange(selectedOption?.value);
  };

  return (
    <div className={`${className}`} style={style}>
      {label && <label>{label}</label>}
      <Select
        options={formattedOptions}
        value={selectedOption}
        onChange={handleChange}
        isOptionDisabled={(option) => option.isDisabled}
        isDisabled={disabled} // Pass disabled prop to react-select
        styles={customStyles}
        menuPortalTarget={document.body}
      />
    </div>
  );
}