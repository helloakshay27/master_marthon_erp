import React from "react";
import Table from "../../base/Table/Table";
import { eventProjectColumns, eventProjectData } from "../../../constant/data";

import { useNavigate } from "react-router-dom";

export default function VendorProjectTable({ eventData }) {
  const navigate = useNavigate();

  const flattenedData = eventData.map((event, index) => ({
    srNo: index + 1,
    ...event,

    event_type: event.event_type_detail?.event_type || "N/A", // Extract 'event_type'
    event_configuration: event.event_type_detail?.event_configuration || "N/A", // Extract 'event_configuration'
  }));

  // const handleActionClick = (row) => {
  //   // Navigate to detail price page with eventData.id
  //   navigate(`/user-list`);
  //   console.log("View details for:", row);
  // };

  const handleActionClick = (row) => {
    const eventId = row.id; // Access the event ID from the row
    navigate(`/user-list/${eventId}`);
    // navigate(`/user-overview/${eventId}`); // Pass the ID as a query parameter or dynamic route segment
    console.log("View details for Event ID:", eventId);
  };

  return (
    <Table
      columns={eventProjectColumns}
      data={flattenedData}
      // showCheckbox={true}
      actionIcon={true}
      // onRowSelect={undefined}
      // handleCheckboxChange={undefined}
      onActionClick={handleActionClick} // Pass the callback
      onRowSelect={undefined}
      resetSelectedRows={undefined}
      onResetComplete={undefined}
    />
  );
}
