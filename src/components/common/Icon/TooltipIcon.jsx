import React, { useState } from "react";

const TooltipIcon = ({ message }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 512 512"
        style={{ marginLeft: "8px", cursor: "pointer" }}
      >
        <circle cx="250" cy="250" r="250" fill="black" />
        <path
          fill="white"
          d="M256 128c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm16 80h-32c-8.837 0-16 7.163-16 16v160c0 8.837 7.163 16 16 16h32c8.837 0 16-7.163 16-16V224c0-8.837-7.163-16-16-16z"
        />
      </svg>

      {/* Tooltip */}
      {showTooltip && <div className="custom-tooltip">{message}</div>}
    </div>
  );
};

export default TooltipIcon;
