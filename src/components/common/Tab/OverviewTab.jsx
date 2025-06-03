import React, { useEffect, useState } from "react";
import {
  EnvelopeIcon,
  ParticipantsIcon,
  SelectBox,
  ShowIcon,
  Table,
} from "../..";
import axios from "axios";
import { useParams } from "react-router-dom";
import { baseURL } from "../../../confi/apiDomain";
import {
  auditLogColumns,
  specificationColumns,
  deliveryColumns,
} from "../../../constant/data";
import DropdownCollapseIcon from "../Icon/DropdownCollapseIcon";
import DownloadPdfButton from "../DownloadPdfButton"

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
  const [participationSummary, setParticipationSummary] = useState({
    invited_vendor: 0,
    participated_vendor: 0,
  });
  const [error, setError] = useState(null);
  const [additionalFields, setAdditionalFields] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [deliverySchedule, setDeliverySchedule] = useState(false);
  const [specificationData, setSpecificationData] = useState([]);
  const [specification, setSpecification] = useState(false);
  const [auditLogData, setAuditLogData] = useState([]);
  const [auditLog, setAuditLog] = useState(false);
  const [activityLogAccordion, setActivityLogAccordion] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityLogsLoading, setActivityLogsLoading] = useState(false);

  // Local state for expand/collapse
  const [openDelivery, setOpenDelivery] = useState(false);
  const [openDynamic, setOpenDynamic] = useState(false);
  const [openAttachments, setOpenAttachments] = useState(false);
  const [sectionOptions, setSectionOptions] = useState([]);
  
  // Accordion row states for each material row
  const [openDeliveryRows, setOpenDeliveryRows] = useState({});
  const [openDynamicRows, setOpenDynamicRows] = useState({});
  const [openAttachmentsRows, setOpenAttachmentsRows] = useState({});

  const { eventId } = useParams();

  const handledeliverySchedule = () => {
    setDeliverySchedule(!deliverySchedule);
  };

  const handleSpecification = () => {
    setSpecification(!specification);
  };

  const handleAuditLog = () => {
    setAuditLog(!auditLog);
  };

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/material_types?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );

        if (response.data && Array.isArray(response.data.inventory_types)) {
          setSectionOptions(
            response.data.inventory_types.map((section) => ({
              label: section.name,
              value: section.value,
            }))
          );
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };
    fetchSections();
  }, []);

  useEffect(() => {
    if (!activityLogAccordion) return;
    setActivityLogsLoading(true);
    axios
      .get(
        `${baseURL}rfq/events/${eventId}/activity_logs?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((res) => {
        setActivityLogs(res.data.activity_logs || []);
      })
      .catch(() => setActivityLogs([]))
      .finally(() => setActivityLogsLoading(false));
  }, [activityLogAccordion, eventId]);


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

  useEffect(() => {
    const fetchParticipationSummary = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/${eventId}/event_participate_summary?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        setParticipationSummary(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchAdditionalFields = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/${eventId}/applied_event_templates?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        const additionalFields =
          response.data.applied_bid_material_template_fields.map((field) => ({
            label: field.field_name,
            value: "",
          }));
        setAdditionalFields(additionalFields);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchParticipationSummary();
    fetchAdditionalFields();
  }, [eventId]);

  const transformedData = biddingData.flatMap((vendor) =>
    vendor.materials.map((material) => ({
      vendor_name: vendor.vendor,
      material_name: material.name,
      price: material.price,
    }))
  );

  const calculateOrderDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = end ? new Date(end) : null; // Handle undefined endTime

    // Validate startTime and endTime
    if (isNaN(startTime.getTime()) || !endTime || isNaN(endTime.getTime())) {
      return "Invalid duration: Invalid date format";
    }

    // Check if endTime is earlier than startTime
    if (endTime < startTime) {
      console.warn(
        "End time is earlier than start time. Please check the data source."
      );
      return "Invalid duration: End time is earlier than start time";
    }

    const durationInMs = endTime - startTime;

    const days = Math.floor(durationInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (durationInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationInMs % (1000 * 60)) / 1000);

    // Format the duration for better UX
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);

    return parts.length > 0 ? parts.join(" ") : "0s";
  };

  const startTime = overviewData?.event_schedule?.start_time;

  const endTime = overviewData?.event_schedule?.end_time;
  // const OrderEndTime = new Date(endTime);
  const formatDocDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const orderConfig = [
    {
      label: "Order Type",
      value: (overviewData?.event_type_detail?.event_type || "_"),
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
  ];

  const overviewDatas = materialData?.event_materials?.map((item) => ({
    inventoryName: item.inventory_name || "_",
    quantity: item.quantity || "_",
    uom: item.uom || "_",
    // materialType: item.material_type || "_",
    location: item.location || "_",
    rate: item.rate || "_",
    amount: item.rate * item.quantity || "_",
    sectionName: item.material_type || "_",
    subSectionName: item.inventory_sub_type || "_",
    pmsBrand: item.brand?.brand_name || "_",
    pmsColour: item.colour?.colour || "_",
    genericInfo: item.generic_info?.generic_info || "_",
  }));

  useEffect(() => {
    setDeliveryData(overviewData?.delivery_schedules);
    setSpecificationData(overviewData?.mor_inventory_specifications);
    const sanitizedStatusLogs = overviewData?.status_logs?.map((log) => {
      return Object.fromEntries(
        Object.entries(log).map(([key, value]) => [
          key,
          value === null ? "-" : value,
        ])
      );
    });
    setAuditLogData(sanitizedStatusLogs);
  }, [overviewData]);

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

  const columns = [
    { label: "Sr No", key: "srNo" }, // Add serial number column
    { label: "Material Type ", key: "sectionName" },
    { label: "Sub Material Type ", key: "subSectionName" },
    { label: "Material Name", key: "inventoryName" },
    { label: "Quantity", key: "quantity" },
    { label: "UOM", key: "uom" },
    { label: "Location", key: "location" },
    { label: "Rate", key: "rate" },
    { label: "Amount", key: "amount" },
    { label: "Brand", key: "pmsBrand" },
    { label: "Colour", key: "pmsColour" },
    { label: "Generic Info", key: "genericInfo" },
    ...additionalFields,
  ];

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
                    <i className="bi bi-check2 me-2"></i>
                    {participationSummary.added_vendor || 0}
                  </div>
                  <div
                    className="viewBy-main-child2-item d-flex align-items-center justify-content-center bg-light rounded-3 px-3 py-2"
                    aria-label="Emails"
                  >
                    <i className="bi bi-envelope me-2"></i>
                    {participationSummary.invited_vendor || 0}
                  </div>
                  <div
                    className="viewBy-main-child2-item d-flex align-items-center justify-content-center bg-light rounded-3 px-3 py-2"
                    aria-label="Views"
                  >
                    <i className="bi bi-eye me-2"></i>
                    {participationSummary.participanted_vendor}
                  </div>
                  <div
                    className="viewBy-main-child2-item d-flex align-items-center justify-content-center bg-light rounded-3 px-3 py-2"
                    aria-label="Completed"
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    {participationSummary.participanted_vendor}
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
                      {biddingData && biddingData.length > 0 ? (
                        biddingData.map((vendor, vendorIndex) => (
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3">
                            <p style={{ textAlign: "center" }}>
                              No data available
                            </p>
                          </td>
                        </tr>
                      )}
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
            Material Sheet
          </a>
          {productOpen && (
            <div id="product-sheet" className="mx-5">
              <div className="">
                {overviewData?.grouped_event_materials &&
                  Object.entries(overviewData.grouped_event_materials).map(
                    ([materialType, groups], typeIdx) => {
                      const materialsArr = Object.values(groups).flat();
                      if (!materialsArr.length) return null;
                      const rowKey = `${materialType}_${typeIdx}`;
                      return (
                        <div
                          key={rowKey}
                          className="mb-4 card card-body rounded-3 p-0"
                          style={{
                            border: "1px solid #eee",
                            borderRadius: "8px",
                            marginBottom: "24px",
                            background: "#fff",
                          }}
                        >
                          {/* Header with Material Type and SelectBox */}
                          <div
                            className="card-header3"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "24px",
                              padding: "16px 0 8px 5px",
                            }}
                          >
                            <h3
                              className="card-title"
                              style={{ fontWeight: 500, fontSize: "16px" }}
                            >
                              Material Type {typeIdx + 1} of{" "}
                              {
                                Object.keys(
                                  overviewData.grouped_event_materials
                                ).length
                              }
                            </h3>
                            <SelectBox
                              label={"Select Material Type"}
                              options={sectionOptions}
                              defaultValue={
                                sectionOptions.find(
                                  (option) => option.label === materialType
                                )?.value
                              }
                              disabled={true}
                              style={{
                                minWidth: 180,
                                padding: "0 20px",
                                borderRadius: 4,
                                marginTop: "48px",
                              }}
                            />
                          </div>
                          {/* Table for all materials of this type */}
                          <div className="p-4 pt-0">
                            <Table
                              columns={[
                                { key: "srNo", label: "Sr.No." },
                                {
                                  key: "material_type",
                                  label: "Material Type",
                                },
                                {
                                  key: "inventory_sub_type",
                                  label: "Material Sub Type",
                                },
                                {
                                  key: "inventory_name",
                                  label: "Material Name",
                                },
                                { key: "quantity", label: "Quantity" },
                                { key: "uom", label: "UOM" },
                                { key: "location", label: "Location" },
                                { key: "rate", label: "Rate" },
                                { key: "amount", label: "Amount" },
                                { key: "pms_brand_name", label: "Brand" },
                                { key: "pms_colour_name", label: "Colour" },
                                {
                                  key: "generic_info_name",
                                  label: "Generic Info",
                                },
                                ...(materialsArr[0]?.extra_data
                                  ? Object.keys(materialsArr[0].extra_data).map(
                                      (key) => ({
                                        key,
                                        label: key
                                          .replace(/_/g, " ")
                                          .toUpperCase(),
                                      })
                                    )
                                  : []),
                              ]}
                              data={materialsArr.map((material, idx) => ({
                                ...material,
                                srNo: idx + 1,
                              }))}
                              isAccordion={true}
                              enableHoverEffect={true}
                              isMinWidth={true}
                              accordionRender={(_, rowIndex) => {
                                const material = materialsArr[rowIndex];
                                const deliverySchedules =
                                  material.delivery_schedules || [];
                                const morInventorySpecifications =
                                  material.mor_inventory_specifications || [];
                                const attachmentsData =
                                  material.attachments || [];
                                const rowKey =
                                  material.id || `${materialType}_${rowIndex}`;
                                  
                                return (
                                  <div
                                    style={{
                                      width: "85vw",
                                      marginLeft: "20px",
                                      position: "sticky",
                                      left: 0,
                                      zIndex: 1,
                                      backgroundColor: "white",
                                      padding: "0",
                                    }}
                                  >
                                    {/* Delivery Schedules Accordion */}
                                    <div className="mb-3 card card-body p-0">
                                      <div
                                        style={{
                                          cursor: "pointer",
                                          padding: "12px 20px",
                                          background: "#f8f9fa",
                                          borderBottom: "1px solid #eee",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                        onClick={() =>
                                          setOpenDeliveryRows((prev) => ({
                                            ...prev,
                                            [rowKey]: !prev[rowKey],
                                          }))
                                        }
                                      >
                                        <span
                                          style={{
                                            fontWeight: 600,
                                            fontSize: "16px",
                                          }}
                                        >
                                          Delivery Schedules
                                        </span>
                                        <button
                                          className="purple-btn2 d-flex align-items-center"
                                          style={{
                                            borderRadius: "50%",
                                            width: "32px",
                                            height: "32px",
                                            padding: "0",
                                            background: "transparent",
                                            border: "none",
                                          }}
                                          tabIndex={-1}
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDeliveryRows((prev) => ({
                                              ...prev,
                                              [rowKey]: !prev[rowKey],
                                            }));
                                          }}
                                        >
                                          <DropdownCollapseIcon
                                            isCollapsed={
                                              !openDeliveryRows[rowKey]
                                            }
                                          />
                                        </button>
                                      </div>
                                      {openDeliveryRows[rowKey] && (
                                        <div style={{ padding: "24px" }}>
                                          <table className="table table-bordered">
                                            <thead>
                                              <tr>
                                                <th
                                                  style={{
                                                    textAlign: "center",
                                                  }}
                                                >
                                                  Expected Date
                                                </th>
                                                <th
                                                  style={{
                                                    textAlign: "center",
                                                  }}
                                                >
                                                  Expected Quantity
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {deliverySchedules.length ===
                                              0 ? (
                                                <tr>
                                                  <td
                                                    colSpan={2}
                                                    style={{
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    No delivery schedules
                                                    available.
                                                  </td>
                                                </tr>
                                              ) : (
                                                deliverySchedules.map(
                                                  (schedule, idx) => (
                                                    <tr key={idx}>
                                                      <td>
                                                        {schedule.expected_date}
                                                      </td>
                                                      <td>
                                                        {
                                                          schedule.expected_quantity
                                                        }
                                                      </td>
                                                    </tr>
                                                  )
                                                )
                                              )}
                                            </tbody>
                                          </table>
                                        </div>
                                      )}
                                    </div>
                                    {/* Dynamic Details Accordion */}
                                    <div className="mb-3 card card-body p-0">
                                      <div
                                        style={{
                                          cursor: "pointer",
                                          padding: "12px 20px",
                                          background: "#f8f9fa",
                                          borderBottom: "1px solid #eee",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                        onClick={() =>
                                          setOpenDynamicRows((prev) => ({
                                            ...prev,
                                            [rowKey]: !prev[rowKey],
                                          }))
                                        }
                                      >
                                        <span
                                          style={{
                                            fontWeight: 600,
                                            fontSize: "16px",
                                          }}
                                        >
                                          Dynamic Details
                                        </span>
                                        <button
                                          className="purple-btn2 d-flex align-items-center"
                                          style={{
                                            borderRadius: "50%",
                                            width: "32px",
                                            height: "32px",
                                            padding: "0",
                                            background: "transparent",
                                            border: "none",
                                          }}
                                          tabIndex={-1}
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDynamicRows((prev) => ({
                                              ...prev,
                                              [rowKey]: !prev[rowKey],
                                            }));
                                          }}
                                        >
                                          <DropdownCollapseIcon
                                            isCollapsed={
                                              !openDynamicRows[rowKey]
                                            }
                                          />
                                        </button>
                                      </div>
                                      {openDynamicRows[rowKey] && (
                                        <div style={{ padding: "24px" }}>
                                          <table className="table table-bordered">
                                            <thead>
                                              <tr>
                                                <th
                                                  style={{
                                                    textAlign: "center",
                                                  }}
                                                >
                                                  Field
                                                </th>
                                                <th
                                                  style={{
                                                    textAlign: "center",
                                                  }}
                                                >
                                                  Specification
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {morInventorySpecifications.length ===
                                              0 ? (
                                                <tr>
                                                  <td
                                                    colSpan={2}
                                                    style={{
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    No dynamic details
                                                    available.
                                                  </td>
                                                </tr>
                                              ) : (
                                                morInventorySpecifications.map(
                                                  (spec, idx) => (
                                                    <tr key={idx}>
                                                      <td>{spec.field}</td>
                                                      <td>
                                                        {spec.specification ||
                                                          "N/A"}
                                                      </td>
                                                    </tr>
                                                  )
                                                )
                                              )}
                                            </tbody>
                                          </table>
                                        </div>
                                      )}
                                    </div>
                                    {/* Attachments Accordion */}
                                    <div className="mb-3 card card-body p-0">
                                      <div
                                        style={{
                                          cursor: "pointer",
                                          padding: "12px 20px",
                                          background: "#f8f9fa",
                                          borderBottom: "1px solid #eee",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                        onClick={() =>
                                          setOpenAttachmentsRows((prev) => ({
                                            ...prev,
                                            [rowKey]: !prev[rowKey],
                                          }))
                                        }
                                      >
                                        <span
                                          style={{
                                            fontWeight: 600,
                                            fontSize: "16px",
                                          }}
                                        >
                                          Attachments
                                        </span>
                                        <button
                                          className="purple-btn2 d-flex align-items-center"
                                          style={{
                                            borderRadius: "50%",
                                            width: "32px",
                                            height: "32px",
                                            padding: "0",
                                            background: "transparent",
                                            border: "none",
                                          }}
                                          tabIndex={-1}
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenAttachmentsRows((prev) => ({
                                              ...prev,
                                              [rowKey]: !prev[rowKey],
                                            }));
                                          }}
                                        >
                                          <DropdownCollapseIcon
                                            isCollapsed={
                                              !openAttachmentsRows[rowKey]
                                            }
                                          />
                                        </button>
                                      </div>
                                      {openAttachmentsRows[rowKey] && (
                                        <div style={{ padding: "24px" }}>
                                          <table className="table table-bordered">
                                            <thead>
                                              <tr>
                                                <th
                                                  style={{
                                                    textAlign: "center",
                                                  }}
                                                >
                                                  Filename
                                                </th>
                                                <th
                                                  style={{
                                                    textAlign: "center",
                                                  }}
                                                >
                                                  Action
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {attachmentsData.length === 0 ? (
                                                <tr>
                                                  <td
                                                    colSpan={2}
                                                    style={{
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    No attachments available.
                                                  </td>
                                                </tr>
                                              ) : (
                                                attachmentsData.map(
                                                  (attachment, idx) => (
                                                    <tr key={idx}>
                                                      <td>
                                                        {attachment.filename}
                                                      </td>
                                                      <td
                                                        style={{
                                                          display: "flex",
                                                          gap: "10px",
                                                          justifyContent:
                                                            "center",
                                                          width: "100%",
                                                        }}
                                                      >
                                                        <a
                                                          href={`${baseURL}rfq/events/${eventId}/download?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&blob_id=${attachment.blob_id}`}
                                                          download={
                                                            attachment.filename
                                                          }
                                                          className="purple-btn2"
                                                          style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            padding: "0",
                                                            display: "flex",
                                                            alignItems:
                                                              "center",
                                                            justifyContent:
                                                              "center",
                                                          }}
                                                        >
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 16 16"
                                                            style={{
                                                              fill: "black",
                                                            }}
                                                          >
                                                            <g fill="white">
                                                              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                                              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                                                            </g>
                                                          </svg>
                                                        </a>
                                                      </td>
                                                    </tr>
                                                  )
                                                )
                                              )}
                                            </tbody>
                                          </table>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              }}
                              customRender={{
                                material_type: (value) =>
                                  value === undefined || value === null || value === "" ? "-" : value,
                                inventory_sub_type: (value) =>
                                  value === undefined || value === null || value === "" ? "-" : value,
                                inventory_name: (value) =>
                                  value === undefined || value === null || value === "" ? "-" : value,
                                quantity: (value) =>
                                  value === undefined || value === null || value === "" ? "-" : value,
                                uom: (value) =>
                                  value === undefined || value === null || value === "" ? "-" : value,
                                location: (value) =>
                                  value === undefined || value === null || value === "" ? "-" : value,
                                rate: (value) =>
                                  value === undefined || value === null || value === "" ? "-" : value,
                                amount: (value) =>
                                  value === undefined || value === null || value === "" ? "-" : value,
                                pms_brand_name: (value) =>
                                  value === undefined || value === null || value === "" ? "-" : value,
                                pms_colour_name: (value) =>
                                  value === undefined || value === null || value === "" ? "-" : value,
                                generic_info_name: (value) =>
                                  value === undefined || value === null || value === "" ? "-" : value,
                                ...(materialsArr[0]?.extra_data
                                  ? Object.keys(materialsArr[0].extra_data).reduce((acc, key) => {
                                      acc[key] = (value) =>
                                        value?.value === undefined ||
                                        value?.value === null ||
                                        value?.value === ""
                                          ? "-"
                                          : value?.value;
                                      return acc;
                                    }, {})
                                  : {}),
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
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
                        {documentsData.map((attachment, index) => {
                          console.log("attachment:-",attachment);
                          
                          return (
                            <tr key={attachment.id}>
                              <td className="text-start">{index + 1}</td>
                              <td className="text-start">
                                {attachment.filename}
                              </td>
                              <td className="text-start">
                                {formatDocDate(attachment.blob_created_at)}
                              </td>
                              <td className="text-start">
                                {/* <a
                                  href={`${baseURL}rfq/events/${eventId}/download?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&blob_id=${attachment.blob_id}`}
                                  download={attachment.filename}
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
                                </a> */}
                                <DownloadPdfButton apiUrl={`${baseURL}/rfq/events/${eventId}/download?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&blob_id=${attachment.blob_id}`} />
                              </td>
                            </tr>
                          );
                        })}
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
                {overviewData?.resource_term_conditions &&
                overviewData.resource_term_conditions.length > 0 ? (
                  overviewData.resource_term_conditions.map((item, index) => (
                    <div key={index}>
                      <p>{`${index + 1}. ${
                        item.term_condition?.condition ||
                        "No condition available"
                      }`}</p>
                      <p>
                        {item.condition || "No additional details available"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: "center" }}>
                    No terms and conditions available
                  </p>
                )}
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
            Event Configuration
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
                        <p>{item.label} :</p>
                        <p
                          id={item.id}
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "normal",
                            textTransform: item.value === 'rfq' ? 'uppercase' : 'capitalize',
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
              <div className="card card-body d-flex p-4">
                <div className="d-flex">
                  <p>Event Title : </p>{" "}
                  <p
                    style={{ marginLeft: "5px" }}
                  >{`${overviewData.event_no}  ${overviewData.event_title}`}</p>
                </div>
                <div className="d-flex">
                  <p>Event Description :</p>{" "}
                  <p style={{ marginLeft: "5px" }}>
                    {overviewData.event_description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 my-3">
          <a
            className="btn"
            data-bs-toggle="collapse"
            href="#auditLog"
            role="button"
            aria-expanded={auditLog}
            aria-controls="auditLog"
            onClick={handleAuditLog}
            style={{ fontSize: "16px", fontWeight: "normal" }}
          >
            <span
              id="audit-log-icon"
              className="icon-1"
              style={{
                marginRight: "8px",
                border: "1px solid #dee2e6",
                paddingTop: "10px",
                paddingBottom: "10px",
                paddingLeft: "8px",
                paddingRight: "8px",
                fontSize: "12px",
              }}
            >
              {auditLog ? (
                <i className="bi bi-dash-lg"></i>
              ) : (
                <i className="bi bi-plus-lg"></i>
              )}
            </span>
            Audit Log
          </a>
          {auditLog && (
            <div id="auditLog" className="mx-5">
              <div className="card card-body p-4">
                {auditLogData?.length > 0 ? (
                  <Table
                    columns={[
                      { label: "Sr No", key: "srNo" }, // Add serial number column
                      ...auditLogColumns,
                    ]}
                    data={auditLogData.map((item, index) => ({
                      ...item,
                      srNo: index + 1, // Add serial number to each row
                      created_at: new Date(item.created_at).toLocaleString(),
                    }))}
                  />
                ) : (
                  <p className="text-center mt-4">
                    No Audit Log available for this event.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        {/* <div className="col-12 my-3">
          <a
            className="btn"
            data-bs-toggle="collapse"
            href="#activity-logs"
            role="button"
            aria-expanded={activityLogAccordion}
            aria-controls="activity-logs"
            onClick={() => setActivityLogAccordion((prev) => !prev)}
            style={{ fontSize: "16px", fontWeight: "normal" }}
          >
            <span id="activity-logs-icon" className="icon-1">
              {activityLogAccordion ? (
                <i className="bi bi-dash-lg"></i>
              ) : (
                <i className="bi bi-plus-lg"></i>
              )}
            </span>
            Activity Logs
          </a>
          {activityLogAccordion && (
            <div id="activity-logs" className="mx-5">
              <div className="card card-body p-4">
                {activityLogsLoading ? (
                  <div>Loading...</div>
                ) : activityLogs.length > 0 ? (
                  <Table
                    columns={[
                      { label: "Activity Name", key: "activity_name" },
                      { label: "Activity Type", key: "activity_type" },
                      { label: "Created By", key: "created_by_name" },
                      { label: "Created Date", key: "created_at" },
                    ]}
                    data={activityLogs.map((log, idx) => ({
                      ...log,
                      created_at: new Date(log.created_at).toLocaleString(),
                    }))}
                  />
                ) : (
                  <p className="text-center mt-4">
                    No Activity Logs available for this event.
                  </p>
                )}
              </div>
            </div>
          )}
        </div> */}
      </section>
    </div>
  );
}
