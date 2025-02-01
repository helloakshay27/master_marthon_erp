import React from "react";
import { toast } from 'react-toastify'; // Import toast

const EventScheduleInput = ({ handleEventScheduleModalShow, eventScheduleText }) => {
  const showToasterMessage = () => {
    toast.warn("Please fill the delivery date on Event Type modal.");
  };

  return (
    <input
      className="form-control"
      onClick={() => {
        showToasterMessage();
        handleEventScheduleModalShow();
      }}
      placeholder="From [dd-mm-yy hh:mm] To [dd-mm-yy hh:mm] ([DD] Days [HH] Hrs [MM] Mins)"
      value={eventScheduleText} // Display the selected event schedule
      readOnly
    />
  );
};

export default EventScheduleInput;
