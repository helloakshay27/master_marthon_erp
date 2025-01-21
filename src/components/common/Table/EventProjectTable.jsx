import React from "react";
import Table from "../../base/Table/Table";
import { eventProjectColumns, eventProjectData } from "../../../constant/data";

import { useNavigate } from "react-router-dom";

export default function EventProjectTable({ eventData }) {
  const navigate = useNavigate();

  const flattenedData = eventData.map((event, index) => ({
    srNo: index + 1,
    ...event,
    event_type: event.event_type_detail?.event_type || "N/A", // Extract 'event_type'
    event_configuration: event.event_type_detail?.event_configuration || "N/A", // Extract 'event_configuration'
  }));

  const handleActionClick = (row) => {
    // Navigate to detail price page with eventData.id
    navigate(`/erp-rfq-detail-price-trends4h/${row.id}`);
    console.log("View details for:", row);
  };

  return (
    <Table
      columns={eventProjectColumns}
      data={flattenedData}
      showCheckbox={true}
      onRowSelect={undefined}
      handleCheckboxChange={undefined}
      resetSelectedRows={undefined}
      onResetComplete={undefined}
      actionIcon={true}
      onActionClick={handleActionClick}
    />
  );
}
