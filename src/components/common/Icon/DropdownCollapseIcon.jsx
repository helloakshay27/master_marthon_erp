import React from "react";

export default function DropdownCollapseIcon({isCollapsed}) {
  return (
    <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx={16} cy={16} r={16} fill="#8B0203" />
      
      <path d={isCollapsed
                              ? "M16 24L9.0718 12L22.9282 12L16 24Z"
                              : "M16 8L22.9282 20L9.0718 20L16 8Z"} fill="white" />
    </svg>
  );
}
