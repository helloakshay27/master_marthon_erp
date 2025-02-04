import React from "react";
import "./Tooltip.css"; // Import Tooltip styles

export default function Tooltip({ content, children }) {
  return (
    <div className="tooltip-container">
      {children}
      <div className="tooltip-content">{content}</div>
    </div>
  );
}
