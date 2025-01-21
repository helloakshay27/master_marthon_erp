// import React from 'react';

// export default function SelectBox({
//   label,
//   options,
//   defaultValue,
//   onChange,
//   style = {},
//   className = "form-control form-select",
//   isDisableFirstOption = false, // New prop
// }) {
//   return (
//     <div className="form-group">
//       {label && <label>{label}</label>}
//       <select
//         className={className}
//         style={{ width: "100%", ...style }}
//         defaultValue={defaultValue}
//         onChange={onChange}
//       >
//         {options.map((option, index) => (
//           <option
//             key={index}
//             value={option.value}
//             selected={isDisableFirstOption && index === 0} 
//             hidden={isDisableFirstOption && index === 0} 
//           >
//             {option.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }
import React from "react";
import Select from "react-select";

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
    control: (base) => ({
      ...base,
      maxHeight: "65px",
      overflowY: "auto",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999, // Ensure the dropdown appears above other elements
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999, // Ensure portal menu is on top
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
