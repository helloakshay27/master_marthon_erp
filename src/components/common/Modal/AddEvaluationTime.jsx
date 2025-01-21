import React, { useState } from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";

const AddEvaluationTimeModal = ({ show, handleClose }) => {
  const [selectedOption, setSelectedOption] = useState(
    "Edit evaluation duration"
  ); // Default selection
  const [customEventDurationValue, setCustomEventDurationValue] = useState(""); // For custom duration
  const [customEventUnit, setCustomEventUnit] = useState("Min(s)"); // Default unit for duration
  const [fixedDateTime, setFixedDateTime] = useState(""); // For date-time input
  const [actionType, setActionType] = useState("increaseBy"); // New state for 'Increase By'/'Decrease By'
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    // Reset fields based on selection
    if (e.target.value !== "Edit evaluation duration") {
      setCustomEventDurationValue("");
      setCustomEventUnit("Min(s)");
      setActionType("increaseBy");
    }
    if (e.target.value !== "Edit evaluation ending time") {
      setFixedDateTime("");
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      console.log("Selected Option:", selectedOption); // Debugging log

      let payload = {};

      // Check for "Edit evaluation duration"
      if (selectedOption.trim() === "Edit evaluation duration") {
        const adjustmentType =
          actionType === "increaseBy" ? "increase" : "decrease";

        // Validate customEventDurationValue
        if (!customEventDurationValue || isNaN(customEventDurationValue)) {
          alert("Please enter a valid duration value.");
          setIsLoading(false);
          return;
        }

        const adjustmentValue = {};
        if (customEventUnit === "Min(s)") {
          adjustmentValue.minutes = parseInt(customEventDurationValue, 10);
        } else if (customEventUnit === "Hour(s)") {
          adjustmentValue.hours = parseInt(customEventDurationValue, 10);
        } else if (customEventUnit === "Day(s)") {
          adjustmentValue.days = parseInt(customEventDurationValue, 10);
        } else {
          alert("Invalid option selected for duration unit.");
          setIsLoading(false);
          return;
        }

        // Correct payload
        payload = {
          adjustment_type: adjustmentType,
          adjustment_value: adjustmentValue, // Now directly passing the object
        };
      } else if (selectedOption.trim() === "Edit evaluation ending time") {
        // Handle "Edit evaluation ending time" case
        if (!fixedDateTime) {
          alert("Please select a valid date and time.");
          setIsLoading(false);
          return;
        }

        payload = {
          adjustment_type: "fixed_time",
          adjustment_value: { fixed_time: fixedDateTime },
        };
      } else {
        alert("Invalid option selected for duration.");
        setIsLoading(false);
        return;
      }

      console.log("Payload:", payload);

      // API Call
      const response = await fetch(
        "https://vendors.lockated.com/rfq/events/51/edit_evaluation_time?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&event_vendor_id=7397",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        alert("Evaluation time updated successfully!");
        handleClose();
      } else {
        alert(`Error: ${result.error || "Failed to update evaluation time"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating evaluation time.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DynamicModalBox
      show={show}
      onHide={handleClose}
      title="Edit Evaluation Time"
      footerButtons={[
        {
          label: "Cancel",
          onClick: handleClose,
          props: { className: "purple-btn1" },
        },
        {
          label: isLoading ? "Saving..." : "Save",
          onClick: handleSave,
          props: { className: "purple-btn2", disabled: isLoading },
        },
      ]}
    >
      <div className="row justify-content-between align-items-center">
        {["Edit evaluation duration"].map((option, index) => (
          <div className="col-md-6" key={index}>
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="evaluationTime"
                  value={option} // Value set here
                  checked={selectedOption === option}
                  onChange={handleOptionChange}
                />
                <label className="form-check-label">{option}</label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Inputs Based on Selection */}
      {selectedOption === "Edit evaluation duration" && (
        <div className="mt-2">
          <div className="form-group">
            <p>Enter event duration</p>
            <div className="d-flex" style={{ width: "100%" }}>
              <select
                style={{ width: "30%" }}
                className="form-control"
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
              >
                <option value="increaseBy">Increase By</option>
                <option value="decreaseBy">Decrease By</option>
              </select>
              <input
                style={{ width: "40%" }}
                className="form-control"
                placeholder="Enter value"
                type="number"
                value={customEventDurationValue}
                onChange={(e) => setCustomEventDurationValue(e.target.value)}
              />
              <select
                style={{ width: "30%" }}
                className="form-control"
                value={customEventUnit}
                onChange={(e) => setCustomEventUnit(e.target.value)}
              >
                <option value="Min(s)">Min(s)</option>
                <option value="Hour(s)">Hour(s)</option>
                <option value="Day(s)">Day(s)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* {selectedOption === "Edit evaluation ending time" && (
        <div className="mt-2">
          <div className="form-group">
            <p>Select Date and Time</p>
            <input
              type="datetime-local"
              className="form-control"
              value={fixedDateTime}
              onChange={(e) => setFixedDateTime(e.target.value)}
            />
          </div>
        </div>
      )} */}
    </DynamicModalBox>
  );
};

export default AddEvaluationTimeModal;
