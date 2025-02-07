import React from "react";
import Select, { components } from "react-select";

export default function SelectBox({
  label,
  options,
  defaultValue,
  onChange,
  style = {},
  className = "",
  isDisableFirstOption = false, // New prop
}) {
  const customStyles = {
    control: (base, state) => ({
      ...base,
      maxHeight: "65px",
      overflowY: "auto",
      borderColor: state.isFocused ? "#8b0203" : base.borderColor,
      "&:hover": {
        borderColor: "#8b0203",
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
      backgroundColor: state.isSelected ? "#ccc" : state.isFocused ? "#8b0203" : base.backgroundColor,
      color: state.isSelected ? "#000" : state.isFocused ? "#fff" : "#000", // Set text color to black
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
  const formattedOptions = isDisableFirstOption
    ? options.map((option, index) => ({
        ...option,
        isDisabled: index === 0,
      }))
    : options;

  // Handle default value
  const defaultOption = defaultValue
    ? options.find((option) => option.value === defaultValue)
    : null;
  return (
    <div className={`${className}`} style={style}>
      {label && <label>{label}</label>}
      <Select
        options={formattedOptions}
        defaultValue={defaultOption}
        onChange={(selectedOption) => onChange(selectedOption?.value)}
        isOptionDisabled={(option) => option.isDisabled} // Disabling logic
        styles={customStyles}
        menuPortalTarget={document.body} // Render dropdown outside the table
      />
    </div>
  );
}