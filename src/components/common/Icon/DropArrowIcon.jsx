import React from "react";

export default function DropArrowIcon({isOpen}) {
  return (
    <svg
      width={24}
      height={27}
      viewBox="0 0 24 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: isOpen ? "rotate(0deg)" : "rotate(300deg)",
        transition: "transform 0.3s",
      }}
    >
      <g filter="url(#filter0_d_105_1158)">
        <rect
          y="0.5"
          width={24}
          height={24}
          rx={12}
          fill="white"
          shapeRendering="crispEdges"
        />
        <rect
          x="0.5"
          y={1}
          width={23}
          height={23}
          rx="11.5"
          stroke="#E2E8F0"
          shapeRendering="crispEdges"
        />
        <path
          d="M16.49 9.10156H7.51035C7.24102 9.10156 7.09063 9.38594 7.25742 9.58008L11.7473 14.7863C11.8758 14.9354 12.1232 14.9354 12.2531 14.7863L16.743 9.58008C16.9098 9.38594 16.7594 9.10156 16.49 9.10156Z"
          fill="#334155"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_105_1158"
          x={0}
          y="0.5"
          width={24}
          height={26}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.016 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_105_1158"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_105_1158"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
