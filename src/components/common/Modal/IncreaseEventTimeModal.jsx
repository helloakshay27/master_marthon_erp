import React, { useState } from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import { evaluationOptions } from "../../../constant/data";

const IncreaseEventTimeModal = ({ show, handleClose }) => {
  const [selectedDuration, setSelectedDuration] = useState(
    evaluationOptions[0].value
  );
  const [customEventDurationValue, setCustomEventDurationValue] = useState("");
  const [customEventUnit, setCustomEventUnit] = useState("Min(s)");
  const [fixedDateTime, setFixedDateTime] = useState("");

  const handleEventDurationChange = (duration) => {
    setSelectedDuration(duration);
    if (duration !== "Custom") {
      setCustomEventDurationValue("");
      setCustomEventUnit("Min(s)");
    }
    if (duration !== "Fixed Time") {
      setFixedDateTime("");
    }
    console.log("selectedDuration :-", selectedDuration);
  };

  const handleSave = async () => {
    let payload = {};

    if (selectedDuration === "Custom") {
      // Construct payload for custom duration
      const duration = parseInt(customEventDurationValue, 10);
      let durationInDays = 0;
      if (customEventUnit === "Min(s)") {
        durationInDays = duration / (24 * 60); // Convert minutes to days
      } else if (customEventUnit === "Hour(s)") {
        durationInDays = duration / 24; // Convert hours to days
      } else if (customEventUnit === "Day(s)") {
        durationInDays = duration; // Already in days
      }
      payload = {
        update_type: "custom",
        duration: { days: durationInDays },
      };
    } else if (
      evaluationOptions.some((option) => option.value === selectedDuration)
    ) {
      // Handle predefined duration options like "10 Minutes", "30 Minutes", etc.
      const durationMinutes = parseInt(selectedDuration.split(" ")[0], 10); // Extract minutes
      payload = {
        update_type: "custom",
        duration: { minutes: durationMinutes }, // Send as minutes
      };
    } else if (selectedDuration === "Fixed Time") {
      // Construct payload for fixed time
      payload = {
        update_type: "fixed_time",
        fixed_time: fixedDateTime,
      };
    }

    try {
      const response = await fetch(
        "https://vendors.lockated.com/rfq/events/8/extend_event_time?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&event_vendor_id=7397",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Handle success
        console.log("Event extended successfully:", data);
        alert(" Event extended successfully");
        handleClose(); // Close the modal
      } else {
        // Handle error
        console.error("Error extending event:", data);
        alert("Failed to extend event. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <DynamicModalBox
        show={show}
        onHide={handleClose}
        title="Increased Event Time"
        footerButtons={[
          // @ts-ignore
          {
            label: "Cancel",
            onClick: handleClose,
            props: { className: "purple-btn1" },
          },
          // @ts-ignore
          {
            label: "Save",
            onClick: handleSave, // Call handleSave function on Save
            props: { className: "purple-btn2" },
          },
        ]}
      >
        <div className="row justify-content-between align-items-center">
          {evaluationOptions.map((option, index) => (
            <div className="col-md-3" key={index}>
              <div className="form-group">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="eventTime"
                    value={option.value}
                    defaultChecked={index === 0}
                    checked={selectedDuration === option.value}
                    onChange={() => handleEventDurationChange(option.value)}
                  />
                  <label className="form-check-label">{option.label}</label>
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedDuration === "Custom" && (
          <div className="mt-2">
            <div className="form-group">
              <p>Enter event duration</p>
              <div className="d-flex" style={{ width: "100%" }}>
                <input
                  style={{ width: "70%" }}
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

        {selectedDuration === "Fixed Time" && (
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
        )}
      </DynamicModalBox>
    </>
  );
};

export default IncreaseEventTimeModal;
