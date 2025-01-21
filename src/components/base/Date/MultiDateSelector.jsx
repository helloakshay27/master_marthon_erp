import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";

export default function RangeDateSelector() {
  const [dateRange, setDateRange] = useState([null, null]);

  const today = new Date();

  return (
    <div className="mb-3 w-100">
      <p>
        Duration
      </p>
      <DatePicker
        id="dateRange"
        value={dateRange}
        onChange={(range) => setDateRange(range)}
        range 
        maxDate={today} 
        format="YYYY-MM-DD" 
        placeholder="Select duration date"
        inputClass="form-control" 
        style={{width:'100% !important'}}
      />
      {/* <div className="mt-2">
        <strong>Selected Range:</strong>{" "}
        {dateRange[0] && dateRange[1]
          ? `${dateRange[0].format("YYYY-MM-DD")} to ${dateRange[1].format("YYYY-MM-DD")}`
          : "No range selected"}
      </div> */}
    </div>
  );
}
