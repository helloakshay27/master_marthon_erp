import React from "react";

export default function Select({
  label,
  options = [], // Default to an empty array
  defaultValue,
  onChange,
  style = {},
  className = "form-control form-select",
}) {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <select
        className={className}
        style={{ width: "100%", ...style }}
        defaultValue={defaultValue}
        onChange={onChange}
      >
        {options.length > 0 ? (
          options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))
        ) : (
          <option value="">No options available</option> // Fallback message
        )}
      </select>
    </div>
  );
}
