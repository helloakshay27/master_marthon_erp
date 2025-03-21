import React from "react";

const FormatDate = ({ timestamp }) => {
  if (!timestamp) return <div>N/A</div>;

  const date = new Date(timestamp);

  const formattedDate = date.toLocaleDateString("en-GB", {
    // 'en-GB' ensures DD-MM-YYYY format
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // const formattedTime = date.toLocaleTimeString("en-US", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   // second: "2-digit",
  //   hour12: false, // 24-hour format
  // });

  return <div>{`${formattedDate}`}</div>;
};

export default FormatDate;
