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
      position: "relative",
      zIndex: 10,
      border: "1px solid #ccc",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      position: "absolute",
      top: "100%",
      maxHeight: "300px",
      overflowY: "auto",
      background: "white",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999, // Ensures dropdown appears above everything
    }),
  };

  return (
    <Select
      options={options}
      value={options.find((opt) => opt.value === value?.value) || null}
      onChange={onChange}
      placeholder={placeholder}
      className="basic-single-select"
      classNamePrefix="select"
      styles={customStyles}
      isDisabled={isDisabled}
      isSearchable={true}
      isClearable={true}
      closeMenuOnSelect={true}
      menuPortalTarget={document.body} // ⬅️ Moves the dropdown outside the table
    />
  );
}
