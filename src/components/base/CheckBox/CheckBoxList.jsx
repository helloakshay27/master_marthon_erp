import React, { useState, useEffect } from "react";

export default function CheckBoxList({ title, items, onChange, isAllSelected, ...rest }) {
  const [selectedItems, setSelectedItems] = useState([]);

  // Sync with isAllSelected prop
  useEffect(() => {
    if (isAllSelected) {
      setSelectedItems(items); // Select all items
      if (onChange) onChange(items); // Trigger parent callback
    } else {
      setSelectedItems([]); // Deselect all items
      if (onChange) onChange([]); // Trigger parent callback
    }
    console.log("isAllSelected :----",isAllSelected);
    
  }, [isAllSelected, items, onChange]);

  // Handle individual checkbox changes
  const handleCheckboxChange = (item) => {
    const updatedItems = selectedItems.includes(item)
      ? selectedItems.filter((i) => i !== item) // Remove item if already selected
      : [...selectedItems, item]; // Add item if not selected

    setSelectedItems(updatedItems);
    if (onChange) onChange(updatedItems); // Trigger parent callback
  };

  // Handle "Select All" checkbox changes
  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    const updatedItems = isChecked ? items : [];
    setSelectedItems(updatedItems);
    if (onChange) onChange(updatedItems); // Trigger parent callback
  };

  return (
    <div className="mb-3" {...rest}>
      {/* Select All Checkbox */}
      <div className="d-flex align-items-center mb-3">
        <input
          type="checkbox"
          className="form-check-input me-2"
          checked={selectedItems.length === items.length && items.length > 0}
          onChange={handleSelectAllChange}
        />
        <p className="mb-0">{title}</p>
      </div>
      {/* Individual Checkboxes */}
      <div className="row border-bottom">
        {items.map((item, index) => (
          <div className="col-md-6" key={index}>
            <label className="form-check-label d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-2"
                value={item}
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
