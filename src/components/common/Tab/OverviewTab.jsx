import React from "react";
import { EnvelopeIcon, ParticipantsIcon, ShowIcon, Table } from "../..";

export default function OverviewTab({
  handleParticipants,
  handleSavings,
  handleBiddings,
  handleProducts,
  participantsOpen,
  participantsData,
  savingsOpen,
  biddingOpen,
  biddingData,
  overviewData,
  productOpen,
  termsOpen,
  orderConfOpen,
  orderDetails,
  handleTerms,
  handleOrderConf,
  handleOrderDetails,
  materialData,
  documentsOpen,
  documentsData,
  handleDocuments,
}) {
  const participants = [
    {
      label: "Total Participants",
      id: "total-participants",
      value: participantsData.total_participant,
    },
    {
      label: "Active participants",
      id: "active-participants",
      value: participantsData.active_participant,
    },
    {
      label: "Total Bids",
      id: "total-bids",
      value: participantsData.total_bids,
    },
    {
      label: "Revised bids",
      id: "revised-bids",
      value:
        participantsData.revised_bids == null
          ? 0
          : participantsData.revised_bids, // Assuming 1 if revised_bids exists
    },
    {
      label: "Counter offers",
      id: "counter-offers",
      value: participantsData.counter_office, // Assuming 1 if counter_office exists
    },
    {
      label: "Accepted Counter Offers",
      id: "accepted-counter-offers",
      value:
        participantsData.active_counter_offers == null
          ? 0
          : participantsData.revised_bids, // Assuming 1 if active_counter_offers exists
    },
    {
      label: "Dynamic time extended",
      id: "dynamic-time-extended",
      value:
        participantsData.dynamic_time_extension == null
          ? "0 mins"
          : participantsData.revised_bids,
    },
  ];

  const transformedData = biddingData.flatMap((vendor) =>
    vendor.materials.map((material) => ({
      vendor_name: vendor.vendor,
      material_name: material.name,
      price: material.price,
    }))
  );

  const calculateOrderDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const duration = new Date(endTime - startTime);
    const hours = duration.getUTCHours();
    const minutes = duration.getUTCMinutes();
    const seconds = duration.getUTCSeconds();
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const startTime = overviewData?.event_schedule?.start_time;

  const endTime = overviewData?.event_schedule?.end_time_duration;

  // const OrderEndTime = new Date(endTime);
  const formatDocDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const orderConfig = [
    {
      label: "Order Type",
      value: overviewData?.event_type_detail?.event_type || "_",
    },
    {
      label: "Order Mode",
      value: overviewData?.event_type_detail?.award_scheme || "_",
    },
    {
      label: "Started at",
      value:
        new Date(overviewData?.event_schedule?.start_time).toLocaleString() ||
        "_",
    },
    {
      label: "Ended at",
      value:
        new Date(overviewData?.event_schedule?.end_time).toLocaleString() ||
        "_",
    },
    {
      label: "Order Duration",
      value: calculateOrderDuration(startTime, endTime),
    },
    ,
    {
      label: "Evaluation Time",
      value: overviewData?.event_schedule?.evaluation_time || "_",
    },
    {
      label: "Delivery by",
      value: new Date(overviewData?.delivery_date).toLocaleString() || "_",
    },
    {
      label: "Order Description",
      value:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia corrupti odio quo illum veritatis odit consequuntur ex consequatur, dignissimos modi obcaecati fugiat voluptatem perferendis. Nostrum itaque, tempore minus, perspiciatis quibusdam cumque eaque minima accusantium asperiores eligendi aspernatur soluta cum fugiat nobis sequi explicabo suscipit, placeat ex quis dolor saepe! Consectetur eligendi ab nostrum a, reprehenderit magnam. Saepe neque reprehenderit ducimus id, cum consequatur sint consequuntur vitae quasi asperiores culpa inventore assumenda eos beatae aspernatur ipsa doloremque accusantium enim perferendis, reiciendis illum autem voluptate. Amet vero magni fugiat nesciunt explicabo reiciendis incidunt sunt, excepturi, ea atque nihil cumque ipsa deserunt placeat!",
    },
  ];

  // console.log("overviewData:-----", overviewData);

  const overviewDatas = materialData?.event_materials?.map((item) => ({
    inventoryName: item.inventory_name || "_",
    quantity: item.quantity || "_",
    uom: item.uom || "_",
    materialType: item.material_type || "_",
    location: item.location || "_",
    rate: item.rate || "_",
    amount: item.rate * item.quantity || "_",
    sectionName: item.section_name || "_",
    subSectionName: item.sub_section_name || "_",
  }));

  const formatValue = (value) => {
    if (typeof value === "string") {
      return value
        .split("_")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }
    return value;
  };

  return (
    <div
      className="tab-pane fade"
      id="overview"
      role="tabpanel"
      aria-labelledby="overview-tab"
      tabIndex={0}
    >
      <section className="Erp-overview overflow-auto">
        <div className="row my-2 mx-2">
          <div className="viewBy-main">
            <div className="viewBy-main-child2 mb-3">
              <div className="d-flex align-items-center">
                <p className="viewBy-main-child2P mb-0">
                  <ParticipantsIcon />
                  <span className="me-2">Participation:</span>
                </p>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="viewBy-main-child2-item d-flex align-items-center justify-content-center bg-light rounded-3 px-3 py-2"
                    aria-label="Participants"
                  >
                    <i className="bi bi-check2 me-2"></i>4
                  </div>
                  <div
                    className="viewBy-main-child2-item d-flex align-items-center justify-content-center bg-light rounded-3 px-3 py-2"
                    aria-label="Emails"
                  >
                    <EnvelopeIcon
                      // @ts-ignore
                      className="me-2"
                    />{" "}
                    4
                  </div>
                  <div
                    className="viewBy-main-child2-item d-flex align-items-center justify-content-center bg-light rounded-3 px-3 py-2"
                    aria-label="Views"
                  >
                    <ShowIcon
                      // @ts-ignore
                      className="me-2"
                    />{" "}
                    4
                  </div>
                  <div
                    className="viewBy-main-child2-item d-flex align-items-center justify-content-center bg-light rounded-3 px-3 py-2"
                    aria-label="Completed"
                  >
                    <i className="bi bi-check-circle me-2"></i> 4
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 my-3">
          <a
            className="btn"
            data-bs-toggle="collapse"
            href="#participation-summary"
            role="button"
            aria-expanded={participantsOpen}
            aria-controls="participation-summary"
            onClick={handleParticipants}
            style={{ fontSize: "16px", fontWeight: "normal" }}
          >
            <span id="participation-summary-icon" className="icon-1">
              {participantsOpen ? (
                <i className="bi bi-dash-lg"></i>
              ) : (
                <i className="bi bi-plus-lg"></i>
              )}
            </span>
            Participation Summary
          </a>
          {participantsOpen && (
            <div id="participation-summary" className="mx-5">
              <div className="card card-body p-2">
                <div className="participate-sec">
                  <div
                    className="totals-activity row mx-3"
                    style={{ gap: "0" }}
                  >
                    {participants.map((item) => (
                      <div
                        className="total-activity col-md-3 my-3"
                        key={item.id}
                      >
                        <p>{item.label}</p>
                        <p id={item.id}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-12 my-3">
          <a
            className="btn"
            data-bs-toggle="collapse"
            href="#document-attachment"
            role="button"
            aria-expanded={documentsOpen}
            aria-controls="document-attachment"
            onClick={handleDocuments}
            style={{ fontSize: "16px", fontWeight: "normal" }}
          >
            <span id="document-attachment-icon" className="icon-1">
              {documentsOpen ? (
                <i className="bi bi-dash-lg"></i>
              ) : (
                <i className="bi bi-plus-lg"></i>
              )}
            </span>
            Document Attachment
          </a>
        </div>

        {documentsOpen && (
          <div id="document-attachment" className="mx-4">
              {documentsData?.length > 0 ? (
                <div className="mt-2" style={{ paddingLeft: "24px" }}>
                  <div className="card card-body rounded-3 p-4">
                    {/* Document Details Table */}
                    <div className="tbl-container mt-3">
                      <table className="w-100 table">
                        <thead>
                          <tr>
                            <th className="text-start">Sr No</th>
                            <th className="text-start">File Name</th>
                            <th className="text-start">Uploaded At</th>
                            <th className="text-start">Download</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documentsData.map((attachment, index) => (
                            <tr key={attachment.id}>
                              <td className="text-start">{index + 1}</td>
                              <td className="text-start">
                                {attachment.filename}
                              </td>
                              <td className="text-start">
                                {formatDocDate(attachment.blob_created_at)}
                              </td>
                              <td className="text-start">
                                <a
                                  href={`path-to-your-files/${attachment.filename}`}
                                  download
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    style={{ fill: "black" }}
                                  >
                                    <g fill="currentColor">
                                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                                    </g>
                                  </svg>
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center mt-4">No attachments available.</p>
              )}
          </div>
        )}

        <div className="col-12 my-3">
          <a
            className="btn"
            data-bs-toggle="collapse"
            href="#bidding-summary"
            role="button"
            aria-expanded={biddingOpen}
            aria-controls="bidding-summary"
            onClick={handleBiddings}
            style={{ fontSize: "16px", fontWeight: "normal" }}
          >
            <span id="bidding-summary-icon" className="icon-1">
              {biddingOpen ? (
                <i className="bi bi-dash-lg"></i>
              ) : (
                <i className="bi bi-plus-lg"></i>
              )}
            </span>
            Bidding Summary
          </a>
          {biddingOpen && (
            <div id="bidding-summary" className="mx-5">
              <div className="card card-body p-4 rounded-3">
                <div style={{ boxShadow: "none" }}>
                  <h5>Line Item Wise</h5>
                  <table className="tbl-container w-100">
                    <thead>
                      <tr>
                        <th>Vendor</th>
                        <th>Material</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {biddingData.map((vendor, vendorIndex) => (
                        <React.Fragment key={vendorIndex}>
                          {vendor.materials.map((material, materialIndex) => (
                            <tr key={materialIndex}>
                              {materialIndex === 0 && (
                                <td rowSpan={vendor.materials.length}>
                                  {vendor.vendor}
                                </td>
                              )}
                              <td>{material.name}</td>
                              <td>{material.price}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 my-3">
          <a
            className="btn"
            data-bs-toggle="collapse"
            role="button"
            href="#product-sheet"
            aria-controls="product-sheet"
            aria-expanded={productOpen}
            onClick={handleProducts}
            style={{ fontSize: "16px", fontWeight: "normal" }}
          >
            <span id="product-sheet-icon" className="icon-1">
              {productOpen ? (
                <i className="bi bi-dash-lg"></i>
              ) : (
                <i className="bi bi-plus-lg"></i>
              )}
            </span>
            Product Sheet
          </a>
          {productOpen && (
            <div id="product-sheet" className="mx-5">
              <div className="card card-body p-4 rounded-3">
                <Table
                  columns={[
                    { label: "Inventory Name", key: "inventoryName" },
                    { label: "Quantity", key: "quantity" },
                    { label: "UOM", key: "uom" },
                    { label: "Material Type", key: "materialType" },
                    { label: "Location", key: "location" },
                    { label: "Rate", key: "rate" },
                    { label: "Amount", key: "amount" },
                    { label: "Section Name", key: "sectionName" },
                    { label: "Sub Section Name", key: "subSectionName" },
                  ]}
                  data={overviewDatas}
                />
              </div>
            </div>
          )}
        </div>
        {/* New Section: Terms and Conditions */}
        <div className="col-12 my-3">
          <a
            className="btn"
            data-bs-toggle="collapse"
            href="#terms-conditions"
            role="button"
            aria-expanded={termsOpen}
            aria-controls="terms-conditions"
            onClick={handleTerms}
            style={{ fontSize: "16px", fontWeight: "normal" }}
          >
            <span id="terms-conditions-icon" className="icon-1">
              {termsOpen ? (
                <i className="bi bi-dash-lg"></i>
              ) : (
                <i className="bi bi-plus-lg"></i>
              )}
            </span>
            Terms and Conditions
          </a>
          {termsOpen && (
            <div id="terms-conditions" className="mx-5">
              <div className="card card-body p-4">
                {overviewData?.resource_term_conditions.map((item, index) => {
                  return (
                    <>
                      <p key={index}>{`${index + 1}. ${
                        item.term_condition.condition
                      }`}</p>
                      <p>{item.condition}</p>
                    </>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* New Section: Order Configuration */}
        <div className="col-12 my-3">
          <a
            className="btn"
            data-bs-toggle="collapse"
            href="#order-configuration"
            role="button"
            aria-expanded={orderConfOpen}
            aria-controls="order-configuration"
            onClick={handleOrderConf}
            style={{ fontSize: "16px", fontWeight: "normal" }}
          >
            <span id="order-configuration-icon" className="icon-1">
              {orderConfOpen ? (
                <i className="bi bi-dash-lg"></i>
              ) : (
                <i className="bi bi-plus-lg"></i>
              )}
            </span>
            Order Configuration
          </a>
          {orderConfOpen && (
            <div id="order-configuration" className="mx-5">
              <div className="card card-body p-4">
                <div className="participate-sec">
                  <div className="totals-activity row" style={{ gap: "0" }}>
                    {orderConfig.map((item) => (
                      <div
                        className="total-activity col-md-3 my-3"
                        key={item.id}
                      >
                        <p>{item.label}</p>
                        <p
                          id={item.id}
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "normal",
                          }}
                        >
                          {formatValue(item.value)}
                        </p>{" "}
                        {/* Format the value */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* New Section: Order Details */}
        <div className="col-12 my-3">
          <a
            className="btn"
            data-bs-toggle="collapse"
            href="#order-details"
            role="button"
            aria-expanded={orderDetails}
            aria-controls="order-details"
            onClick={handleOrderDetails}
            style={{ fontSize: "16px", fontWeight: "normal" }}
          >
            <span id="order-details-icon" className="icon-1">
              {orderDetails ? (
                <i className="bi bi-dash-lg"></i>
              ) : (
                <i className="bi bi-plus-lg"></i>
              )}
            </span>
            Order Details
          </a>
          {orderDetails && (
            <div id="order-details" className="mx-5">
              <div className="card card-body p-4">
                <p>Event Title</p>
                <p>{`${overviewData.event_no}  ${overviewData.event_title}`}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
