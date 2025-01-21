import React from "react";

export default function ParticipantsRemarksTab({ data }) {
  const remarks = data?.event_vendor_remarks || [];

  return (
    <div
      className="tab-pane fade"
      id="participantRemarks"
      role="tabpanel"
      aria-labelledby="participantRemarks-tab"
      tabIndex={0}
    >
      <div className="priceTrends-list">
        {remarks.length > 0 ? (
          remarks.map((remarkItem) => (
            <div key={remarkItem.id} className="priceTrends-item my-3 d-flex">
              <div
                className="item-label rounded-circle bg-light me-2 d-flex justify-content-center align-items-center"
                style={{ width: "35px", height: "35px" }}
              >
                {remarkItem.event_vendor?.full_name?.[0]?.toUpperCase() || "N/A"}
              </div>
              <div className="priceTrends-list-child go-shadow-k p-3 rounded-2">
                <p className="eventList-p2 mb-0 fw-bold">
                  {remarkItem.event_vendor?.full_name || "_"} from{" "}
                  {remarkItem.event_vendor?.organization_name || "Unknown"}
                </p>
                <p className="eventList-p1 mb-0">{remarkItem.remark}</p>
              </div>
            </div>
          ))
        ) : (
          <h4 className="h-100 w-100 d-flex justify-content-center align-items-center pt-5">
            No Participant Remark Details found
          </h4>
        )}
      </div>
    </div>
  );
}
