import React from "react";

const FormatDateTime = ({ timestamp }) => {
  if (!timestamp) return <div>-</div>;

  const date = new Date(timestamp);

  // Format date as DD/MM/YYYY
  const datePart = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return (
    <div>
      {`${datePart} ${hours}:${minutes} ${ampm}`}
    </div>
  );
};

export default FormatDateTime;