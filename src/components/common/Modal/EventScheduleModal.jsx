import React, { useEffect, useState } from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import SelectBox from "../../base/Select/SelectBox";
// @ts-ignore
import format from "date-fns/format";
import { event } from "jquery";

const EventScheduleModal = ({ show, onHide, handleSaveSchedule }) => {
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
  const [formattedEndTime, setFormattedEndTime] = useState('');

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleStartTimeChange = (value) => {
    const selectedValue = value;
    if (selectedValue === "Schedule for later") {
      setIsLater(true);
    } else {
      setIsLater(false);
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
  const handleEndTimeChange = (value) => {
    const selectedValue = value;
    if (selectedValue === "Fixed Time") {
      setIsCustomEndTimeSelected(false);
      setIsFixedEndTime(true);
      setEndTimeDuration("");
    } else {
      setIsFixedEndTime(false);
      setEndTimeDuration("30 mins");
    }
  };
  const handleEvaluationChange = (value) => {
    const selectedValue = value;
    if (selectedValue === "Duration") {
      setIsCustomEvaluationDuration(true);
    } else {
      setIsCustomEvaluationDuration(false);
      setIsCustomEvaluationSelected(false);
      setCustomEvaluationDuration("30 mins");
    }
  };

  useEffect(() => {
    if (endDate && endTime) {
      const endDateTime = new Date(`${endDate}T${endTime}`);
      setFormattedEndTime(format(endDateTime, "dd MMM yyyy 'at' hh:mm a"));
    }
  }, [endDate, endTime]);

  const handleSaveScheduleFun = () => {
    const startTime = isLater
      ? `${laterDate}T${laterTime}:00Z`
      : new Date().toISOString();

    // const endTimeDurationFormatted = isFixedEndTime
    //   ? `${fixedEndDate}T${fixedEndTime}:00Z`
    //   : `${endTimeDurationVal} ${endTimeDuration}`;
    const endTimeFormatted = `${endDate}T${endTime}:00Z`;

    const evaluationTimeFormatted = `${evaluationDurationVal} ${customEvaluationDuration}`;

    console.log("eve",typeof evaluationTimeFormatted, evaluationTimeFormatted);
    

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
      footerButtons={[
        {
          label: "Back",
          onClick: onHide,
          props: {
            className: "purple-btn1",
          },
        },
        {
          label: "Save",
          onClick: handleSaveScheduleFun,
          props: {
            className: "purple-btn2",
          },
        },
      ]}
    >
      <div className="pb-4">
        <p>
          Start Time <span style={{ color: "red" }}>*</span>
        </p>
        <div className="row">
          <div className="col-md-4">
            <SelectBox
              label={""}
              options={[
                { value: "Start Now", label: "Start Now" },
                { value: "Schedule for later", label: "Schedule for later" },
              ]}
              defaultValue={"Start Now"}
              onChange={handleStartTimeChange}
            />
          </div>
          {isLater && (
            <>
              <div className="col-md-4">
                <input
                  type="date"
                  className="form-control"
                  value={laterDate}
                  onChange={(e) => setLaterDate(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="time"
                  className="form-control"
                  value={laterTime}
                  onChange={(e) => setLaterTime(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
        <p className="mt-2">
          End Time <span style={{ color: "red" }}>*</span>
        </p>
        <div className="row">
          <div className="col-md-4">
            {/* <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={handleEndDateChange}
              min={isLater ? laterDate : new Date().toISOString().split("T")[0]}
            /> */}
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="time"
              className="form-control"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        <p className="my-2" style={{ color: "var(--light-grey)" }}>
          Event will end at {formattedEndTime}
        </p>
        <p className="mt-2">
          Evaluation time <span style={{ color: "red" }}>*</span>
        </p>
        <div className="d-flex gap-2   mt-2">
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
                value={evaluationDurationVal}
                onChange={(e) => setEvaluationDurationVal(e.target.value)}
              />
              <div className="col-md-4">
                <SelectBox
                  label={""}
                  options={[
                    { value: "Mins", label: "Min(s)" },
                    { value: "Hours", label: "Hour(s)" },
                    { value: "Days", label: "Day(s)" },
                    // { value: "Custom Duration", label: "Custom Duration" },
                  ]}
                  defaultValue={"Mins"}
                  onChange={handleCustomEvaluationDuration}
                />
              </div>
            </>
          )}
          {/* {isDurationTime && (
            <SelectBox
              label={""}
              options={[
                { value: "Mins(s)", label: "Mins(s)" },
                { value: "Hour(s)", label: "Hour(s)" },
                { value: "Day(s)", label: "Day(s)" },
                { value: "Custom Duration", label: "Custom Duration" },
              ]}
              defaultValue={"Mins(s)"}
              onChange={handleEvaluationTimeDurationChange}
            />
          )} */}

          {/* {isCustomEvaluationDuration && isCustomEvaluationSelected && (
            <div className="col-md-4">
              <input type="time" className="form-control" />
            </div>
          )} */}
        </div>
      </div>
    </DynamicModalBox>
  );
};

export default EventScheduleModal;
