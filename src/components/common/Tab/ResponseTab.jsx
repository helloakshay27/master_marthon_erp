// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import FullClipIcon from "../Icon/FullClipIcon";
import FullScreenIcon from "../Icon/FullScreenIcon";
import ShowIcon from "../Icon/ShowIcon";
import ParticipantsIcon from "../Icon/ParticipantsIcon";
import Accordion from "../../base/Accordion/Accordion";
import ResponseVendor from "../ResponseVendor";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import BulkCounterOfferModal from "../Modal/BulkCounterOfferModal";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { da } from "date-fns/locale";
import { SegregatedBidMaterials } from "../../../utils/SegregatedBidMaterials";
import { baseURL } from "../../../confi/apiDomain";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import SelectBox from "../../base/Select/SelectBox";
import { set } from "lodash";
import { toast, ToastContainer } from "react-toastify"; // Ensure toast is imported

export default function ResponseTab({ isCounterOffer }) {
  const [isVendor, setIsVendor] = useState(false);
  const [counterModal, setCounterModal] = useState(false);
  const [BidCounterData, setBidCounterData] = useState(null);
  const [response, setResponse] = useState([]);
  const [responseTableData, setResponseTableData] = useState([]);
  const [materialData, setMaterialData] = useState({});
  const [bidId, setBidId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handle = useFullScreenHandle();
  const [activeIndexes, setActiveIndexes] = useState({});
  const [eventVendors, setEventVendors] = useState([]);
  const [segeregatedMaterialData, setSegeregatedMaterialData] = useState([]);
  const tableRef = useRef(null);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [taxOptions, setTaxOptions] = useState([]); // State for tax options
  const [deductionTaxOptions, setDeductionTaxOptions] = useState([]); // State for deduction tax options
  const [participationSummary, setParticipationSummary] = useState({
    invited_vendor: 0,
    participanted_vendor: 0,
    added_vendor: 0,
    seen_vendor: 0,
  });
  const [openModals, setOpenModals] = useState({});
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(0);
  const [bidMaterialIndex, setBidMaterialIndex] = useState(0);
  const [showCounterOfferDiv, setShowCounterOfferDiv] = useState(false);
  const [showDeliveryStatsModal, setShowDeliveryStatsModal] = useState(false); // State for Delivery Stats Modal
  const [showCounterOfferPopup, setShowCounterOfferPopup] = useState(false); // State for popup visibility
  const [isOfferAccepted, setIsOfferAccepted] = useState(false); // State to track offer acceptance

  const [participants, setParticipants] = useState([]);
  const [currentReminderPage, setCurrentReminderPage] = useState(1);
  const reminderPageSize = 10; // Number of items per page
  const [totalReminderPages, setTotalReminderPages] = useState(1);

  const fetchParticipants = async (page = 1) => {
    try {
      const response = await fetch(
        `${baseURL}rfq/events/${eventId}/event_vendors?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=${page}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setParticipants(data?.event_vendors || []);
      setTotalReminderPages(data?.pagination?.total_pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants(currentReminderPage);
  }, [currentReminderPage]);

  const handleReminderPageChange = (page) => {
    if (page >= 1 && page <= totalReminderPages) {
      setCurrentReminderPage(page);
    }
  };

  const getReminderPageRange = () => {
    const range = [];
    const maxPagesToShow = 5;
    let start = Math.max(1, currentReminderPage - 2);
    let end = Math.min(totalReminderPages, start + maxPagesToShow - 1);

    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  const navigate = useNavigate();

  useEffect(() => {
    setSegeregatedMaterialData(SegregatedBidMaterials(eventVendors));
  }, [eventVendors]);

  useEffect(() => {
    if (segeregatedMaterialData.length > 0) {
      setMaterialData(segeregatedMaterialData[0]); // Set the first material data as default
    }
  }, [segeregatedMaterialData]);

  const { eventId } = useParams();

  const handleCounterModalShow = () => {
    setCounterModal(true);
  };

  const handleCounterModalClose = () => {
    setCounterModal(false);
  };

  const handleTaxModalOpen = (material, index) => {
    setSelectedMaterialIndex(index);
    setShowTaxModal(true);
  };

  const handleTaxModalClose = () => {
    setShowTaxModal(false);
  };

  const handleSaveTaxChanges = () => {
    setShowTaxModal(false);
  };

  const handleShowModal = () => {
    setShowTaxModal(true);
  };

  const handleChange = (event) => {
    if (event.target.value === "vendor") {
      setIsVendor(true);
    } else {
      setIsVendor(false);
    }
  };

  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/taxes_dropdown?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );

        if (response.data?.taxes) {
          const formattedOptions = response.data.taxes.map((tax) => ({
            value: tax.name,
            label: tax.name,
            id: tax.id,
            taxChargeType: tax.type,
          }));

          setTaxOptions([
            { value: "", label: "Select Tax & Charges" },
            ...formattedOptions,
          ]);
        }
      } catch (error) {
        console.error("Error fetching tax data:", error);
      }
    };

    fetchTaxes();
  }, []);

  useEffect(() => {
    const fetchDeductionTaxes = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/deduction_tax_details?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );

        if (response.data?.taxes) {
          const formattedOptions = response.data.taxes.map((tax) => ({
            value: tax.name,
            label: tax.name,
            id: tax.id,
            type: tax.type,
          }));

          setDeductionTaxOptions([
            { value: "", label: "Select Tax & Charges" },
            ...formattedOptions,
          ]);
        }
      } catch (error) {
        console.error("Error fetching deduction tax data:", error);
      }
    };

    fetchDeductionTaxes();
  }, []);

  const fetchRevisionData = async (
    vendorId,
    revisionNumber,
    isCurrent = false
  ) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (isCurrent) {
        const response = await fetch(
          `${baseURL}rfq/events/${eventId}/event_responses?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        let data = Array.isArray(responseData.vendors)
          ? responseData.vendors.find((vendor) => vendor.id === vendorId)
          : null;

        if (!data) {
          throw new Error("Vendor not found or invalid response format");
        }

        setEventVendors((prev) =>
          prev.map((vendor) =>
            vendor.id === vendorId ? { ...vendor, ...data } : vendor
          )
        );
      } else {
        // Use revision data
        const response = await axios.get(
          `${baseURL}rfq/events/${eventId}/bids/bids_by_revision?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&revision_number=${revisionNumber}&q[event_vendor_id_in]=${vendorId}`
        );
        data = response.data;

        const updatedEventVendors = eventVendors.map((vendor) => {
          if (vendor.id === vendorId) {
            return {
              ...vendor,
              bids: [
                {
                  ...data,
                  bid_materials: data.bid_materials || [],
                },
              ],
            };
          }
          return vendor;
        });
        setEventVendors(updatedEventVendors);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchEventResponses = async () => {
      try {
        const response = await fetch(
          `${baseURL}rfq/events/${eventId}/event_responses?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setResponse(data);
        setEventVendors(Array.isArray(data?.vendors) ? data.vendors : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventResponses();
  }, [isOfferAccepted]);

  const handleCarouselChange = async (vendorId, selectedIndex) => {
    setActiveIndexes((prevIndexes) => ({
      ...prevIndexes,
      [vendorId]: selectedIndex,
    }));

    if (selectedIndex === 0) {
      // Fetch current bid data
      await fetchRevisionData(vendorId, null, true);
    } else {
      // Fetch revision data for the selected revision
      const revisionNumber = selectedIndex - 1;
      await fetchRevisionData(vendorId, revisionNumber);
    }
  };

  const handlePrev = async (vendorId) => {
    const currentIndex = activeIndexes[vendorId] ?? 0;
    const newIndex = currentIndex > 0 ? currentIndex - 1 : 0;

    await handleCarouselChange(vendorId, newIndex);
  };

  const handleNext = async (vendorId) => {
    const currentIndex = activeIndexes[vendorId] ?? 0;

    // Get bid length from vendor object
    const vendor = eventVendors.find((v) => v.id === vendorId);
    const bidLength = vendor?.bid_length || 0;

    // Limit max index to bidLength - 1
    const newIndex =
      currentIndex < bidLength - 1 ? currentIndex + 1 : currentIndex;

    await handleCarouselChange(vendorId, newIndex);
  };

  useEffect(() => {
    const fetchRemarks = async () => {
      try {
        const response = await fetch(
          `${baseURL}rfq/events/${eventId}/event_responses?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResponse(data);
        setEventVendors(Array.isArray(data?.vendors) ? data.vendors : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRemarks();
  }, [eventId, isOfferAccepted]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/${eventId}/bids/${bidId}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        setBidCounterData(response.data);
        sessionStorage.setItem("bidCounterData", JSON.stringify(response.data)); // Save data in session storage
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (bidId) {
      fetchData();
    }
  }, [eventId, bidId]);

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

    fetchParticipationSummary();
  }, [eventId]);

  const formatDate = (dateString) => {
    if (!dateString) return "_";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "_";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const calculateRemainingWidth = (vendorCount) => {
    if (!tableRef.current) return 0;
    const tableWidth = tableRef.current.offsetWidth;
    const occupiedWidth = vendorCount * 80; // Width of vendor cells
    const remainingWidth = tableWidth - occupiedWidth;
    return remainingWidth > 0 ? remainingWidth : 0; // Return remaining width if positive, else 0
  };

  const getOrdinalSuffix = (num) => {
    const j = num % 10,
      k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const acceptOffer = async (bidId, revisedBidId, status) => {
    try {
      const response = await axios.put(
        `${baseURL}rfq/events/${eventId}/bids/${revisedBidId}/revised_bids/${bidId}/update_status?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        { status },
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          status === "accepted"
            ? "Offer accepted successfully"
            : "Offer declined successfully"
        );
        setIsOfferAccepted(true); // Trigger the API call for event responses
      }
    } catch (error) {
      console.error(
        `Error ${status === "accepted" ? "accepting" : "declining"} offer:`,
        error
      );
      toast.error(
        `Failed to ${
          status === "accepted" ? "accept" : "decline"
        } the offer. Please try again.`
      );
    }
  };

  const handleSendReminder = async (vendorId, index) => {
    try {
      const response = await axios.get(
        `${baseURL}rfq/events/${eventId}/event_vendors/${vendorId}/send_reminder?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      );

      if (response.status === 200) {
        // Mark the button as clicked
        participants[index].clicked = true;
        setShowDeliveryStatsModal((prev) => !prev); // Trigger re-render
        toast.success("Reminder sent successfully!"); // Success message
      }
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast.error("Failed to send reminder. Please try again."); // Failure message
    }
  };

  return (
    <div
      className="tab-pane fade show active"
      id="responses"
      role="tabpanel"
      aria-labelledby="responses-tab"
      tabIndex={0}
    >
      <div className="viewBy-main">
        <div className="viewBy-main-child1">
          <div className="d-flex align-items-center mb-3">
            <div
              className="d-flex align-items-center"
              style={{ marginRight: "20px" }}
            ></div>
          </div>
        </div>

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
                onClick={() => setShowDeliveryStatsModal(true)} // Open modal on click
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

      {isVendor ? (
        <ResponseVendor />
      ) : (
        <FullScreen handle={handle}>
          <div className="">
            <div
              style={{
                backgroundColor: "white",
                color: "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></div>
            {eventVendors.length > 0 ? (
              <>
                <div style={{ overflowX: "auto" }}>
                  <table
                    ref={tableRef}
                    className="bid-tbl w-100 mb-0"
                    style={{
                      boxShadow: "none",
                      tableLayout: "fixed",
                      width: "100%",
                    }}
                  >
                    <colgroup>
                      <col style={{ width: "300px" }} />
                      {eventVendors.map((_, index) => (
                        <col key={index} style={{ width: "180px" }} />
                      ))}
                      <col style={{ width: "auto" }} />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            width: "300px",
                            background:
                              "repeating-linear-gradient(135deg, #f3f3f3, #f3f3f3 10px, #e0e0e0 10px, #e0e0e0 11px)",
                          }}
                        ></td>
                        {eventVendors?.map((vendor, index) => {
                          const activeIndex = activeIndexes[vendor.id] || 0;
                          const bidLength = vendor?.bid_length || 0;
                          const hasPendingBid = vendor?.bids?.some(
                            (bid) => bid.status === "pending"
                          );

                          return (
                            <td
                              key={vendor.id}
                              style={{
                                background: "#f3f3f3",
                                position: "relative",
                              }}
                            >
                              <div
                                className="d-flex flex-column align-items-center justify-content-between"
                                style={{ height: "160px" }}
                              >
                                <div className="">
                                  {vendor.full_name}
                                  <p>
                                    {formatDate(vendor?.bids?.[0]?.created_at)}
                                  </p>
                                  <p>
                                    {vendor?.counter_bid_length} Counter Bid
                                    <span>
                                      {vendor?.counter_bid_length > 0
                                        ? "s"
                                        : ""}
                                    </span>
                                  </p>
                                  <div className="d-flex justify-content-center align-items-center w-100 my-2">
                                    {activeIndex > 0 && (
                                      <button
                                        className="px-2 border-0"
                                        style={{ fontSize: "1.5rem" }}
                                        onClick={() => handlePrev(vendor.id)}
                                      >
                                        &lt;
                                      </button>
                                    )}
                                    <div className="carousel-item-content">
                                      {activeIndex === 0 && "Current Bid"}
                                      {activeIndex === 1 && "Initial Bid"}
                                      {activeIndex > 1 &&
                                        `${activeIndex - 1}${getOrdinalSuffix(
                                          activeIndex - 1
                                        )} Revision`}
                                    </div>
                                    {activeIndex < bidLength - 1 && (
                                      <button
                                        className="px-2 border-0"
                                        style={{ fontSize: "1.5rem" }}
                                        onClick={() => handleNext(vendor.id)}
                                      >
                                        &gt;
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <button
                                  className={`purple-btn1 mt-2 ${
                                    isCounterOffer ? "disabled-btn" : ""
                                  } position-absolute bottom-0 start-50 translate-middle-x`}
                                  onClick={async () => {
                                    if (
                                      vendor?.bids?.length > 0 &&
                                      vendor?.bids[0]?.bid_materials?.length > 0
                                    ) {
                                      const bidId =
                                        vendor.bids[0].bid_materials[0].bid_id;
                                      setBidId(bidId);

                                      try {
                                        setLoading(true);
                                        setError(null);

                                        const response = await axios.get(
                                          `${baseURL}rfq/events/${eventId}/bids/${bidId}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
                                        );

                                        const fetchedData = response.data;
                                        setBidCounterData(fetchedData);

                                        navigate(`/counter-offer/${bidId}`, {
                                          state: {
                                            bidCounterData: fetchedData,
                                          },
                                        });
                                      } catch (err) {
                                        setError(err.message);
                                      } finally {
                                        setLoading(false);
                                      }
                                    }
                                  }}
                                  disabled={isCounterOffer}
                                >
                                  Counter
                                </button>
                                {hasPendingBid && (
                                  <button
                                    className="d-block mt-2"
                                    style={{
                                      position: "absolute",
                                      top: "10px",
                                      right: "10px",
                                      background: "none",
                                      border: "none",
                                    }}
                                    onClick={() => {
                                      setShowCounterOfferPopup(true);
                                      setMaterialData({
                                        material_name:
                                          vendor?.bids?.[0]?.bid_materials?.[0]
                                            ?.material_name,
                                        vendor_name: vendor.full_name,
                                        bids_values: vendor.bids,
                                      });
                                    }}
                                  >
                                    <img
                                      src="/offer-btn.png"
                                      alt="Offer"
                                      width="30px"
                                      height="30px"
                                    />
                                  </button>
                                )}
                              </div>
                            </td>
                          );
                        })}
                        <td
                          style={{ width: "auto", background: "#f3f3f3" }}
                        ></td>
                      </tr>
                      <tr>
                        <td
                          className="viewBy-tBody1-p"
                          style={{ minidth: "300px", textAlign: "left" }}
                        >
                          Gross Total
                        </td>
                        {eventVendors?.map((vendor) => {
                          return (
                            <td key={`gross-${vendor.id}`}>
                              {vendor?.bids?.[0]?.gross_total || "_"}
                            </td>
                          );
                        })}
                        <td style={{ width: "auto" }}></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {segeregatedMaterialData?.map((materialData, ind) => {
                  const extraColumns = Array.from(
                    new Set(
                      materialData.bids_values?.flatMap(
                        (material) => material.extra_columns
                      ) || []
                    )
                  );

                  const extraKeys = Array.from(
                    new Set(
                      materialData.bids_values?.flatMap((material) =>
                        Object.keys(material.extra || {})
                      ) || []
                    )
                  );

                  return (
                    <Accordion
                      key={ind}
                      serializedData={
                        materialData.bids_values?.some(
                          (bid) =>
                            bid.status === "pending" &&
                            bid.serialized_last_bid?.event_vendor_id ===
                              bid?.event_vendor_id
                        )
                          ? materialData.bids_values
                              ?.filter(
                                (bid) =>
                                  bid.status === "pending" &&
                                  bid?.serialized_last_bid?.event_vendor_id ===
                                    bid?.event_vendor_id
                              )
                              ?.map((bid) => bid.serialized_last_bid)
                          : undefined
                      }
                      title={materialData.material_name || "_"}
                      amount={materialData.total_amounts}
                      isDefault={true}
                      tableColumn={[
                        { label: "Best Total Amount", key: "bestTotalAmount" },
                        {
                          label: "Quantity Available",
                          key: "quantityAvailable",
                        },
                        { label: "Price", key: "price" },
                        { label: "Discount", key: "discount" },
                        {
                          label: "Realised Discount",
                          key: "realisedDiscount",
                        },
                        { label: "Landed Amount", key: "landedAmount" },
                        { label: "Total Amount", key: "totalAmount" },
                        ...extraColumns
                          .filter((column) => /^[A-Z]/.test(column))
                          .map((column) => ({
                            label: column
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase()),
                            key: column,
                          })),
                        {
                          label: "Tax Rate",
                          key: "taxRate",
                        },
                      ]}
                      tableData={materialData.bids_values?.map(
                        (material, bidIndex) => {
                          const extraData = material.extra_data || {};

                          return {
                            bestTotalAmount: material.total_amount || "_",
                            quantityAvailable:
                              material.quantity_available || "_",
                            price: material.price || "_",
                            discount: material.discount || "_",
                            realisedDiscount: material.realised_discount || "_",
                            gst: material.gst || "_",
                            realisedGST: material.realised_gst || "_",
                            landedAmount: material.landed_amount || "_",
                            participantAttachment:
                              material.participant_attachment || "_",
                            totalAmount: material.total_amount || "_",
                            ...material.extra_columns.reduce((acc, column) => {
                              if (extraData[column]?.value) {
                                const value = extraData[column].value;
                                acc[column] = Array.isArray(value)
                                  ? value
                                      .map(
                                        (item) =>
                                          `${item.taxChargeType || ""}: ${
                                            item.amount || 0
                                          }${
                                            item.taxChargePerUom
                                              ? ` (${item.taxChargePerUom})`
                                              : ""
                                          }`
                                      )
                                      .join(", ")
                                  : value || "_";
                              } else {
                                acc[column] = "_";
                              }
                              return acc;
                            }, {}),
                            taxRate: material,
                            bidIndex: bidIndex,
                          };
                        }
                      )}
                      handleTaxButtonClick={(bid, str, rowIndex) => {
                        setSelectedMaterialIndex(ind);
                        setBidMaterialIndex(rowIndex);
                        setShowTaxModal(true);
                      }}
                    />
                  );
                })}
                {(() => {
                  const extractedData =
                    eventVendors?.flatMap((vendor) => {
                      const extra = vendor?.bids?.[0]?.extra;

                      if (
                        extra &&
                        Object.values(extra).some(
                          (val) =>
                            (typeof val === "string" && val.trim() !== "") ||
                            (typeof val === "object" &&
                              val !== null &&
                              !Array.isArray(val))
                        )
                      ) {
                        const formattedExtra = {};
                        Object.entries(extra).forEach(([key, val]) => {
                          if (!Array.isArray(val)) {
                            formattedExtra[key] = val?.toString().trim() || "_";
                          }
                        });

                        return Object.keys(formattedExtra).length > 0
                          ? [formattedExtra]
                          : [];
                      }

                      return [];
                    }) || [];

                  const extractedKeys = Array.from(
                    new Set(extractedData.flatMap((obj) => Object.keys(obj)))
                  );

                  // ✅ Conditionally render Accordion only if both data and keys exist
                  if (extractedData.length > 0 && extractedKeys.length > 0) {
                    return (
                      <Accordion
                        title="Other Informations"
                        isDefault={true}
                        tableColumn={extractedKeys.map((key) => ({
                          label: key
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase()),
                          key: key,
                        }))}
                        tableData={extractedData}
                      />
                    );
                  }

                  return null;
                })()}

                {(() => {
                  const serializedData =
                    segeregatedMaterialData?.flatMap((material) =>
                      material?.bids_values
                        ?.filter(
                          (bid) =>
                            bid?.status == "pending" &&
                            bid?.serialized_last_bid?.event_vendor_id ===
                              bid?.event_vendor_id
                        )
                        ?.map((bid) => bid.serialized_last_bid)
                    ) || [];

                  // Step 2: Extract charge data for table
                  const extractedChargeData =
                    eventVendors?.flatMap((vendor, vendorIndex) => {
                      const charges = vendor?.bids?.[0]?.charges || {};
                      const serializedCharges =
                        serializedData[vendorIndex]?.charges || {};

                      const hasValidCharges = Object.values(charges).some(
                        (val) =>
                          (typeof val === "string" && val.trim() !== "") ||
                          (typeof val === "number" &&
                            val !== null &&
                            val !== undefined) ||
                          (typeof val === "object" &&
                            val !== null &&
                            !Array.isArray(val))
                      );

                      if (!hasValidCharges) return [];

                      const formattedCharges = {};
                      Object.entries(charges).forEach(([key, val]) => {
                        if (!Array.isArray(val)) {
                          const serializedValue = serializedCharges[key];
                          formattedCharges[key] = serializedValue
                            ? {
                                original: val?.toString().trim() || "_",
                                serialized:
                                  serializedValue?.toString().trim() || "_",
                              }
                            : val?.toString().trim() || "_";
                        }
                      });

                      return Object.keys(formattedCharges).length > 0
                        ? [formattedCharges]
                        : [];
                    }) || [];

                  // Step 3: Extract unique keys for table columns
                  const extractedChargeKeys = Array.from(
                    new Set(
                      extractedChargeData.flatMap((obj) => Object.keys(obj))
                    )
                  );

                  // Step 4: Render Accordion with table data
                  return (
                    <Accordion
                      title="Other Charges"
                      isDefault={true}
                      // serializedData={serializedData} // Optional: used elsewhere?
                      tableColumn={extractedChargeKeys.map((key) => ({
                        label: key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase()),
                        key: key,
                      }))}
                      tableData={extractedChargeData.map((charge) =>
                        Object.fromEntries(
                          Object.entries(charge).map(([key, value]) => [
                            key,
                            typeof value === "object" && value.serialized ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    color: "red",
                                  }}
                                >
                                  {value.serialized}
                                </span>
                                <span style={{ margin: "0 5px" }}>→</span>
                                <span>{value.original}</span>
                              </div>
                            ) : (
                              value
                            ),
                          ])
                        )
                      )}
                    />
                  );
                })()}
              </>
            ) : (
              <h4 className="h-100 w-100 d-flex justify-content-center align-items-center pt-5">
                No Bid Details found
              </h4>
            )}
          </div>
        </FullScreen>
      )}

      <BulkCounterOfferModal
        show={counterModal}
        handleClose={handleCounterModalClose}
        bidCounterData={BidCounterData}
      />

      <DynamicModalBox
        show={showTaxModal}
        onHide={handleTaxModalClose}
        size="lg"
        title="View Tax & Rate"
        footerButtons={[
          {
            label: "Close",
            onClick: handleTaxModalClose,
            props: { className: "purple-btn1" },
          },
          {
            label: "Save Changes",
            onClick: handleSaveTaxChanges,
            props: { className: "purple-btn2" },
          },
        ]}
        centered={true}
      >
        <div className="container-fluid p-0">
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">Material</label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    segeregatedMaterialData[selectedMaterialIndex]
                      ?.bids_values?.[bidMaterialIndex]?.material_name || ""
                  }
                  readOnly
                  disabled={true}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">HSN Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    segeregatedMaterialData[selectedMaterialIndex]
                      ?.bids_values?.[bidMaterialIndex]?.event_material
                      ?.inventory_id || ""
                  }
                  readOnly
                  disabled={true}
                />
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">Rate per Nos</label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    segeregatedMaterialData[selectedMaterialIndex]
                      ?.bids_values?.[bidMaterialIndex]?.price || ""
                  }
                  readOnly
                  disabled={true}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">Total PO Qty</label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    segeregatedMaterialData[selectedMaterialIndex]
                      ?.bids_values?.[bidMaterialIndex]?.quantity_available ||
                    ""
                  }
                  readOnly
                  disabled={true}
                />
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">Discount(%)</label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    segeregatedMaterialData[selectedMaterialIndex]
                      ?.bids_values?.[bidMaterialIndex]?.discount || ""
                  }
                  readOnly
                  disabled={true}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">Material Cost</label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    segeregatedMaterialData[selectedMaterialIndex]
                      ?.bids_values?.[bidMaterialIndex]?.total_amount || ""
                  }
                  readOnly
                  disabled={true}
                />
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="tax-table-header">
                    <tr>
                      <th>Tax / Charge Type</th>
                      <th>Tax / Charges per UOM (INR)</th>
                      <th>Inclusive</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total Base Cost</td>
                      <td></td>
                      <td></td>
                      <td>
                        <input
                          type="number"
                          className="form-control bg-light"
                          value={
                            segeregatedMaterialData[0]?.bids_values?.[
                              selectedMaterialIndex
                            ]?.total_amount || ""
                          }
                          readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Addition Tax & Charges</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    {segeregatedMaterialData[
                      selectedMaterialIndex
                    ]?.bids_values?.[
                      bidMaterialIndex
                    ]?.addition_bid_material_tax_details?.map(
                      (item, rowIndex) => (
                        <tr key={`${rowIndex}-${item.id}`}>
                          <td>
                            <SelectBox
                              options={taxOptions}
                              defaultValue={
                                item.taxChargeType ||
                                taxOptions.find(
                                  (option) => option.id === item.resource_id
                                )?.value
                              }
                              onChange={(value) =>
                                handleTaxChargeChange(
                                  selectedMaterialIndex,
                                  item.id,
                                  "taxChargeType",
                                  value,
                                  "addition"
                                )
                              }
                              className="custom-select"
                              isDisableFirstOption={true}
                              disabled={true}
                            />
                          </td>
                          <td>
                            <select
                              className="form-select"
                              defaultValue={item?.tax_percentage}
                              // value={item.taxChargePerUom}
                              onChange={(e) =>
                                handleTaxChargeChange(
                                  selectedMaterialIndex,
                                  item.id,
                                  "taxChargePerUom",
                                  e.target.value,
                                  "addition"
                                )
                              }
                              disabled={true}
                            >
                              <option value="">Select Tax</option>
                              <option value="5%">5%</option>
                              <option value="12%">12%</option>
                              <option value="18%">18%</option>
                              <option value="28%">28%</option>
                            </select>
                          </td>
                          <td className="text-center">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={item.inclusive}
                              onChange={(e) =>
                                handleTaxChargeChange(
                                  selectedMaterialIndex,
                                  item.id,
                                  "inclusive",
                                  e.target.checked,
                                  "addition"
                                )
                              }
                              readOnly
                              disabled={true}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              value={item.amount}
                              onChange={(e) => {}}
                              readOnly
                              disabled={true}
                            />
                          </td>
                        </tr>
                      )
                    )}
                    <tr>
                      <td>Deduction Tax</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    {segeregatedMaterialData[
                      selectedMaterialIndex
                    ]?.bids_values?.[
                      bidMaterialIndex
                    ]?.deduction_bid_material_tax_details?.map(
                      (item, rowIndex) => (
                        <tr key={`${rowIndex}-${item.id}`}>
                          <td>
                            <SelectBox
                              options={deductionTaxOptions}
                              defaultValue={
                                item.taxChargeType ||
                                deductionTaxOptions.find(
                                  (option) => option.id == item.resource_id
                                )?.value
                              }
                              onChange={(value) =>
                                handleTaxChargeChange(
                                  selectedMaterialIndex,
                                  item.id,
                                  "taxChargeType",
                                  value,
                                  "deduction"
                                )
                              }
                              disabled={true}
                            />
                          </td>
                          <td>
                            <select
                              className="form-select"
                              value={item.taxChargePerUom}
                              onChange={(e) =>
                                handleTaxChargeChange(
                                  selectedMaterialIndex,
                                  item.id,
                                  "taxChargePerUom",
                                  e.target.value,
                                  "deduction"
                                )
                              }
                              disabled={true}
                            >
                              <option value="">Select Tax</option>
                              <option value="1%">1%/</option>
                              <option value="2%">2%</option>
                              <option value="10%">10%</option>
                            </select>
                          </td>
                          <td className="text-center">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={item.inclusive}
                              onChange={(e) =>
                                handleTaxChargeChange(
                                  selectedMaterialIndex,
                                  item.id,
                                  "inclusive",
                                  e.target.checked,
                                  "deduction"
                                )
                              }
                              disabled={true}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              value={item.amount}
                              onChange={(e) =>
                                handleTaxChargeChange(
                                  selectedMaterialIndex,
                                  item.id,
                                  "amount",
                                  e.target.value,
                                  "deduction"
                                )
                              }
                              readonly
                              disabled={true}
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </DynamicModalBox>

      <DynamicModalBox
        show={showDeliveryStatsModal}
        onHide={() => setShowDeliveryStatsModal(false)} // Close modal
        title="Delivery Stats"
        size="md"
        modalType={true}
      >
        <div>
          {participants?.map((item, index) => (
            <div key={item.id}>
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0">{item.full_name}</p>
                <button
                  className={item.clicked ? "purple-btn2" : "purple-btn1"} // Toggle class
                  onClick={() => handleSendReminder(item.id, index)} // Call API on click
                >
                  {item.clicked ? "Reminder Sent" : "Send Reminder"}
                </button>
              </div>
              {index < reminderPageSize - 1 && <hr />}
            </div>
          ))}
          {totalReminderPages > 1 && (
            <div className="d-flex justify-content-between align-items-center px-1 mt-2">
              <ul className="pagination justify-content-center d-flex">
                <li
                  className={`page-item ${
                    currentReminderPage === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handleReminderPageChange(1)}
                  >
                    First
                  </button>
                </li>

                <li
                  className={`page-item ${
                    currentReminderPage === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      handleReminderPageChange(currentReminderPage - 1)
                    }
                  >
                    Prev
                  </button>
                </li>

                {getReminderPageRange().map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentReminderPage === page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handleReminderPageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    currentReminderPage === totalReminderPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      handleReminderPageChange(currentReminderPage + 1)
                    }
                  >
                    Next
                  </button>
                </li>

                <li
                  className={`page-item ${
                    currentReminderPage === totalReminderPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handleReminderPageChange(totalReminderPages)}
                  >
                    Last
                  </button>
                </li>
              </ul>
              <div>
                <p>
                  Showing{" "}
                  {participants.length > 0
                    ? (currentReminderPage - 1) * reminderPageSize + 1
                    : 0}{" "}
                  to{" "}
                  {Math.min(
                    currentReminderPage * reminderPageSize,
                    totalReminderPages * reminderPageSize
                  )}{" "}
                  of {totalReminderPages * reminderPageSize} entries
                </p>
              </div>
            </div>
          )}
        </div>
      </DynamicModalBox>

      <DynamicModalBox
        show={showCounterOfferPopup}
        onHide={() => setShowCounterOfferPopup(false)} // Close popup
        size="md"
        title="Revise Offer Details"
        footerButtons={[
          {
            label: "Decline",
            onClick: () => {
              acceptOffer(
                pendingBid.id,
                pendingBid.original_bid_id,
                "rejected"
              );
            },
            props: { className: "purple-btn1" },
          },
          {
            label: "Accept Offer",
            onClick: () => {
              const pendingBid = materialData?.bids_values?.find(
                (bid) => bid.status === "pending"
              );

              if (pendingBid && pendingBid.id) {
                acceptOffer(
                  pendingBid.id,
                  pendingBid.original_bid_id,
                  "accepted"
                );
              } else {
                toast.error("No pending bid found to accept.");
              }
            },
            props: { className: "purple-btn2" },
          },
        ]}
        centered={true}
      >
        <div>
          <p>{`Revise Offer for ${materialData?.material_name} of ${materialData?.vendor_name}`}</p>
          <p>
            A Revise is pending on your bid. You cannot make any further changes
            to your bid until you resolve the revise offer.
          </p>
        </div>
      </DynamicModalBox>
      <ToastContainer />
    </div>
  );
}
