import React from "react";

export default function CheckedCircleIcon({...rest}) {
  return (
    <svg
      width={13}
      height={14}
      viewBox="0 0 14 15"
      fill="black"
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: "#000" }}
      {...rest}
    >
      <path
        d="M9.92183 5.26562H9.18902C9.02964 5.26562 8.87808 5.34219 8.78433 5.47344L6.32808 8.87969L5.21558 7.33594C5.12183 7.20625 4.97183 7.12813 4.81089 7.12813H4.07808C3.97652 7.12813 3.91714 7.24375 3.97652 7.32656L5.92339 10.0266C5.96938 10.0908 6.03001 10.1431 6.10026 10.1791C6.1705 10.2152 6.24833 10.2341 6.3273 10.2341C6.40627 10.2341 6.4841 10.2152 6.55434 10.1791C6.62458 10.1431 6.68521 10.0908 6.7312 10.0266L10.0218 5.46406C10.0828 5.38125 10.0234 5.26562 9.92183 5.26562Z"
        fill="white"
      />
      <path
        d="M7 0.75C3.13438 0.75 0 3.88438 0 7.75C0 11.6156 3.13438 14.75 7 14.75C10.8656 14.75 14 11.6156 14 7.75C14 3.88438 10.8656 0.75 7 0.75ZM7 13.5625C3.79063 13.5625 1.1875 10.9594 1.1875 7.75C1.1875 4.54063 3.79063 1.9375 7 1.9375C10.2094 1.9375 12.8125 4.54063 12.8125 7.75C12.8125 10.9594 10.2094 13.5625 7 13.5625Z"
        fill="white"
      />
    </svg>
  );
}