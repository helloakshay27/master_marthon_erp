import React from "react";

const FormatDateTime = ({ timestamp }) => {
  if (!timestamp) return <div>-</div>;

  const date = new Date(timestamp);

  const options = { year: "numeric", month: "long", day: "numeric" };
  const datePart = date.toLocaleDateString("en-US", options);

  let hours = date.getHours();
  const ampm = hours >= 12 ? "p.m." : "a.m.";
  hours = hours % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return (
    <div>
      {`${datePart} at ${hours}:${minutes} ${ampm}`}
    </div>
  );
};

export default FormatDateTime;