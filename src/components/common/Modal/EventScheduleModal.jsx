import React, { useEffect, useState } from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import SelectBox from "../../base/Select/SelectBox";
import { toast } from "react-toastify";
// @ts-ignore
import format from "date-fns/format";

const EventScheduleModal = ({
  show,
  onHide,
  handleSaveSchedule,
  existingData,
  onLoadScheduleData,
  deliveryDate,
}) => {
  // Convert deliveryDate to the desired format
  const formattedDeliveryDate = deliveryDate.split("T")[0];

  console.log("existingData", existingData);
  

  const [isLater, setIsLater] = useState(false);
  const [isFixedEndTime, setIsFixedEndTime] = useState(false);
  const [isCustomEndTimeSelected, setIsCustomEndTimeSelected] = useState(false);
  const [isCustomEvaluationSelected, setIsCustomEvaluationSelected] =
    useState(false);
  const [customEvaluationDuration, setCustomEvaluationDuration] =
    useState("Mins");
  const [endTimeDuration, setEndTimeDuration] = useState("Mins");
  const [endTimeDurationVal, setEndTimeDurationVal] = useState("Mins");
  const [evaluationDurationVal, setEvaluationDurationVal] = useState("Mins");
  const [isCustomEvaluationDuration, setIsCustomEvaluationDuration] =
    useState(true);
  const [laterDate, setLaterDate] = useState("");
  const [laterTime, setLaterTime] = useState("");
  const [fixedEndDate, setFixedEndDate] = useState("");
  const [fixedEndTime, setFixedEndTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [formattedEndTime, setFormattedEndTime] = useState("");

  useEffect(() => {
    if (existingData) {
      // Handle existing data - parse UTC datetime directly
      if (existingData.start_time) {
        // Parse the ISO string directly without timezone conversion
        const startDate = new Date(existingData.start_time);
        if (!isNaN(startDate.getTime())) {
          // Format as local date/time inputs (this will show the UTC time as local)
          const year = startDate.getUTCFullYear();
          const month = String(startDate.getUTCMonth() + 1).padStart(2, '0');
          const day = String(startDate.getUTCDate()).padStart(2, '0');
          const hours = String(startDate.getUTCHours()).padStart(2, '0');
          const minutes = String(startDate.getUTCMinutes()).padStart(2, '0');
          
          setLaterDate(`${year}-${month}-${day}`);
          setLaterTime(`${hours}:${minutes}`);
          setIsLater(true); // Set to later since we have existing data
        }
      }
      
      if (existingData.end_time) {
        // Parse the ISO string directly without timezone conversion
        const endDateObj = new Date(existingData.end_time);
        if (!isNaN(endDateObj.getTime())) {
          // Format as local date/time inputs (this will show the UTC time as local)
          const year = endDateObj.getUTCFullYear();
          const month = String(endDateObj.getUTCMonth() + 1).padStart(2, '0');
          const day = String(endDateObj.getUTCDate()).padStart(2, '0');
          const hours = String(endDateObj.getUTCHours()).padStart(2, '0');
          const minutes = String(endDateObj.getUTCMinutes()).padStart(2, '0');
          
          setEndDate(`${year}-${month}-${day}`);
          setEndTime(`${hours}:${minutes}`);
        }
      }

      if (typeof existingData.evaluation_time === "string") {
        const [evaluationValue, evaluationUnit] =
          existingData.evaluation_time.split(" ");
        setEvaluationDurationVal(evaluationValue || "Mins");
        setCustomEvaluationDuration(evaluationUnit || "Mins");
      } else if (typeof existingData.evaluation_time === "number") {
        setEvaluationDurationVal(existingData.evaluation_time.toString());
        setCustomEvaluationDuration("Mins");
      } else {
        setEvaluationDurationVal("Mins");
        setCustomEvaluationDuration("Mins");
      }

      onLoadScheduleData(
        existingData.start_time,
        existingData.end_time,
        existingData.evaluation_time
      );
    }
  }, [existingData]);

  useEffect(() => {
    if (endDate && endTime) {
      // Create date without timezone conversion
      const endDateTime = new Date(`${endDate}T${endTime}`);
      setFormattedEndTime(format(endDateTime, "dd MMM yyyy 'at' hh:mm a"));
    }
  }, [endDate, endTime]);

  const handleEndDateChange = (e) => {
    const selectedDate = e.target.value;
    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + 30);
    const minEndDate = currentTime.toISOString().split("T")[0];
    // if (selectedDate >= minEndDate && selectedDate <= formattedDeliveryDate) {
    setEndDate(selectedDate);
    // }
  };

  const handleStartTimeChange = (value) => {
    const selectedValue = value;
    if (selectedValue === "Schedule for later") {
      setIsLater(true);
    } else {
      setIsLater(false);
      const currentTime = new Date();
      setLaterDate(currentTime.toISOString().split("T")[0]);
      setLaterTime(currentTime.toTimeString().split(" ")[0].substring(0, 5));
      setEndDate("");
      setEndTime("");
    }
  };

  const handleEndTimeDuration = (value) => {
    if (value === "Custom Duration") {
      // setIsCustomEndTimeSelected(true);
    } else {
      // setIsCustomEndTimeSelected(false);
      setEndTimeDuration(value);
    }
  };

  const handleCustomEvaluationDuration = (value) => {
    if (value === "Custom Duration") {
      // setIsCustomEvaluationSelected(true);
    } else {
      // setIsCustomEvaluationSelected(false);
      setCustomEvaluationDuration(value);
    }
  };

  const handleEndTimeChange = (e) => {
    const selectedTime = e.target.value;
    const selectedDateTime = new Date(`${endDate}T${selectedTime}`);

    let startDateTime;
    if (isLater) {
      // Use the scheduled later date/time
      startDateTime = new Date(`${laterDate}T${laterTime}`);
    } else {
      // Use the current date/time
      const now = new Date();
      // If endDate is today, use current time, else use 00:00
      if (endDate === now.toISOString().split("T")[0]) {
        startDateTime = now;
      } else {
        startDateTime = new Date(`${endDate}T00:00`);
      }
    }

    if (selectedDateTime <= startDateTime) {
      toast.info("End time must be after the start time.");
      return;
    }

    setEndTime(selectedTime);
  };

  const handleEvaluationChange = (value) => {
    const selectedValue = value;
    if (selectedValue === "Duration") {
      setIsCustomEvaluationDuration(true);
    } else {
      setIsCustomEvaluationDuration(false);
      setIsCustomEvaluationSelected(false);
      setEvaluationDurationVal("0");
      setCustomEvaluationDuration("Not Applicable");
    }
  };

  const handleSaveScheduleFun = () => {
    // Validation for start time
    if (isLater) {
      if (!laterDate || !laterTime) {
        toast.error("Please select both date and time for scheduled start.");
        return;
      }
    }

    // Validation for end time
    if (!endDate || !endTime) {
      toast.error("Please select both end date and end time.");
      return;
    }
    console.log(evaluationDurationVal, customEvaluationDuration);
    

    // Validation for evaluation time - only validate when Duration is selected
    if (isCustomEvaluationDuration) {
      if (!evaluationDurationVal || evaluationDurationVal.trim() === "" || !customEvaluationDuration ) {
        toast.error("Please enter a valid evaluation duration.");
        return;
      }
      // Check if evaluation duration value is a valid number
      const durationValue = parseInt(evaluationDurationVal);
      if (isNaN(durationValue) || durationValue <= 0) {
        toast.error("Please enter a valid positive number for evaluation duration.");
        return;
      }
    }

    // Properly format start time in UTC format with Z
    let startTime;
    if (isLater) {
      // Treat the selected time as the desired UTC time (no timezone conversion)
      const istDateTime = `${laterDate}T${laterTime}:00.000Z`;
      startTime = istDateTime;
    } else {
      // For "Start Now", get current time in IST and format as UTC
      const now = new Date();
      const istTime = new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now).replace(' ', 'T') + '.000Z';
      startTime = istTime;
    }
    
    console.log("startTime", startTime);

    // Create end time in UTC format with Z (treat selected time as desired UTC time)
    const endTimeFormatted =
      endDate && endTime
        ? `${endDate}T${endTime}:00.000Z`
        : "";

    const evaluationTimeFormatted = isCustomEvaluationDuration
      ? (evaluationDurationVal && customEvaluationDuration
          ? `${evaluationDurationVal} ${customEvaluationDuration}`
          : "Mins Mins")
      : "Not Applicable";

    const data = {
      start_time: startTime,
      end_time_duration: endTimeFormatted,
      evaluation_time: evaluationTimeFormatted,
    };

    handleSaveSchedule(data);
  };

  return (
    <DynamicModalBox
      size="md"
      modalType={true}
      show={show}
      onHide={onHide}
      title="Event Schedule"
      // footerButtons={[
      //   {
      //     label: "Back",
      //     onClick: onHide,
      //     props: {
      //       className: "purple-btn1",
      //     },
      //   },
      //   {
      //     label: "Save",
      //     onClick: handleSaveScheduleFun,
      //     props: {
      //       className: "purple-btn2",
      //     },
      //   },
      // ]}
    >
      <div className="pb-4">
        <p>
          Start Time <span style={{ color: "red" }}>*</span>
        </p>
        <div className="row">
          <div className="col-md-12">
            <SelectBox
              label={""}
              options={[
                { value: "Start Now", label: "Start Now" },
                { value: "Schedule for later", label: "Schedule for later" },
              ]}
              defaultValue={isLater ? "Schedule for later" : "Start Now"}
              onChange={handleStartTimeChange}
            />
          </div>
          {isLater && (
            <div className="mt-3">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={laterDate}
                    min={new Date().toISOString().split("T")[0]} // Restrict to today or future dates
                    onChange={(e) => setLaterDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={laterTime}
                    min={
                      laterDate === new Date().toISOString().split("T")[0]
                        ? new Date().toTimeString().split(" ")[0].substring(0, 5) // Restrict to current or future time if today
                        : undefined
                    }
                    onChange={(e) => setLaterTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <p className="mt-4">
          End Time <span style={{ color: "red" }}>*</span>
        </p>
        <div className="row">
          <div className="col-md-4">
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={handleEndDateChange}
              min={laterDate || new Date().toISOString().split("T")[0]} // Restrict to laterDate or today
              max={formattedDeliveryDate}
            />
          </div>
          <div className="col-md-4">
            <input
              type="time"
              className="form-control"
              value={endTime}
              onChange={handleEndTimeChange}
              min={
                endDate === laterDate
                  ? laterTime || "00:00" // Restrict to laterTime if endDate matches laterDate
                  : undefined
              }
            />
          </div>
        </div>
        <p className="my-2" style={{ color: "var(--light-grey)" }}>
          Event will end at {formattedEndTime}
        </p>
        <p className="mt-4">
          Evaluation time <span style={{ color: "red" }}>*</span>
        </p>
        <div className="d-flex gap-2 mt-2">
          <div className="col-md-4">
            <SelectBox
              label={""}
              options={[
                { value: "Duration", label: "Duration" },
                { value: "Not Applicable", label: "Not Applicable" },
              ]}
              defaultValue={"Duration"}
              onChange={handleEvaluationChange}
            />
          </div>
          {isCustomEvaluationDuration && customEvaluationDuration !== "" && (
            <>
              <input
                type="number"
                className="form-control"
                placeholder="Enter number of"
                inputMode="numeric"
                value={evaluationDurationVal || ""}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (
                    !/^\d$/.test(e.key) &&
                    !["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(
                      e.key
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) =>
                  setEvaluationDurationVal(e.target.value.replace(/\D/g, ""))
                }
              />

              <div className="col-md-4">
                <SelectBox
                  label={""}
                  options={[
                    { value: "Mins", label: "Min(s)" },
                    { value: "Hours", label: "Hour(s)" },
                    { value: "Days", label: "Day(s)" },
                  ]}
                  defaultValue={"Mins"}
                  onChange={handleCustomEvaluationDuration}
                />
              </div>
            </>
          )}
        </div>

        <div className="d-flex justify-content-center mt-4">
          <button className="purple-btn1" onClick={onHide}>
            Back
          </button>
          <button className="purple-btn2 my-2" onClick={handleSaveScheduleFun}>
            Save
          </button>
        </div>
      </div>
    </DynamicModalBox>
  );
};

export default EventScheduleModal;
