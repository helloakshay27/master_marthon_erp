import React from "react";
import "./Tooltip.css";

export default function Tooltip({ content, children }) {
  return (
    <div className="tooltip-container">
      {children}
      <div className="tooltip-content">{content}</div>
    </div>
  );
}
