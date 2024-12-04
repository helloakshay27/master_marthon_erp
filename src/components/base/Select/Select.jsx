import React from 'react'

export default function Select({
  label,
  options,
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
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )
}
