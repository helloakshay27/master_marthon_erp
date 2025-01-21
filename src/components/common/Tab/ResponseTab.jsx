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
import { useParams } from "react-router-dom";
import { da } from "date-fns/locale";
import { SegregatedBidMaterials } from "../../../utils/SegregatedBidMaterials";

export default function ResponseTab({ isCounterOffer }) {
  const [isVendor, setIsVendor] = useState(false);
  const [counterModal, setCounterModal] = useState(false);
  const [BidCounterData, setBidCounterData] = useState(null);
  const [response, setResponse] = useState([]);
  const [responseTableData, setResponseTableData] = useState([]);
  const [bidId, setBidId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handle = useFullScreenHandle();
  const [activeIndexes, setActiveIndexes] = useState({});
  const [eventVendors, setEventVendors] = useState([]);
  const [segeregatedMaterialData, setSegeregatedMaterialData] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    setSegeregatedMaterialData(SegregatedBidMaterials(eventVendors));
  }, [eventVendors]);

  const { id } = useParams();

  const handleCounterModalShow = () => {
    setCounterModal(true);
  };

  const handleCounterModalClose = () => {
    setCounterModal(false);
  };

  const handleChange = (event) => {
    if (event.target.value === "vendor") {
      setIsVendor(true);
    } else {
      setIsVendor(false);
    }
  };

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
        console.log("Fetching current bid data...");
        const response = await fetch(
          `https://vendors.lockated.com/rfq/events/${id}/event_responses?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response data:", errorData);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Fetched responseData:", responseData);

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
        console.log("Updated vendor data:", data);
      } else {
        // Use revision data
        const response = await axios.get(
          `https://vendors.lockated.com/rfq/events/${id}/bids/bids_by_revision?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&revision_number=${revisionNumber}&q[event_vendor_id_in]=${vendorId}`
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
    setActiveIndexes((prevIndexes) => {
      const currentIndex =
        prevIndexes[vendorId] !== undefined ? prevIndexes[vendorId] : 0;
      const newIndex = currentIndex === 0 ? 2 : currentIndex - 1;
      handleCarouselChange(vendorId, newIndex);
      return { ...prevIndexes, [vendorId]: newIndex };
    });
  };

  const handleNext = async (vendorId) => {
    setActiveIndexes((prevIndexes) => {
      const currentIndex =
        prevIndexes[vendorId] !== undefined ? prevIndexes[vendorId] : 0;
      const newIndex = currentIndex === 2 ? 0 : currentIndex + 1;
      handleCarouselChange(vendorId, newIndex);
      return { ...prevIndexes, [vendorId]: newIndex };
    });
  };

  useEffect(() => {
    const fetchRemarks = async () => {
      try {
        const response = await fetch(
          `https://vendors.lockated.com/rfq/events/${id}/event_responses?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResponse(data);
        setEventVendors(Array.isArray(data?.vendors) ? data.vendors : []);
        console.log("data:--------", data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRemarks();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://vendors.lockated.com/rfq/events/${id}/bids/${bidId}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        setBidCounterData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (bidId) {
      fetchData();
    }
  }, [id, bidId]);

  const formatDate = (dateString) => {
    if (!dateString) return "_";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "_";
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleString("en-US", options);
  };

  const calculateRemainingWidth = (vendorCount) => {
    if (!tableRef.current) return 0;
    const tableWidth = tableRef.current.offsetWidth;
    const occupiedWidth = vendorCount * 80; // Width of vendor cells
    const remainingWidth = tableWidth - occupiedWidth;
    return remainingWidth > 0 ? remainingWidth : 0; // Return remaining width if positive, else 0
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
            {/* <select
              style={{ marginRight: "20px" }}
              name="language"
              className=" viewBy-headerForm"
              onChange={handleChange}
              required
            >
              <option value="" selected>
                View by Product
              </option>
              <option value="vendor">Vendor</option>
              <option value="product">Product</option>
            </select> */}
            <div
              className="d-flex align-items-center"
              style={{ marginRight: "20px" }}
            >
              {/* <div className="">
                <p className="viewBy-headerFormP">
                  <span className="me-1">
                    <ShowIcon />
                  </span>
                  Show / Hide
                </p>
              </div> */}
              {/* <div className="me-2">
                <p className="viewBy-headerFormP" onClick={handle.enter}>
                  <span className="me-1">
                    <FullScreenIcon />
                  </span>
                  Fullscreen
                </p>
              </div>
              <div>
                <FullClipIcon />
              </div> */}
            </div>
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
                <i className="bi bi-check2 me-2"></i>4
              </div>
              <div
                className="viewBy-main-child2-item d-flex align-items-center justify-content-center bg-light rounded-3 px-3 py-2"
                aria-label="Emails"
              >
                <i className="bi bi-envelope me-2"></i>4
              </div>
              <div
                className="viewBy-main-child2-item d-flex align-items-center justify-content-center bg-light rounded-3 px-3 py-2"
                aria-label="Views"
              >
                <i className="bi bi-eye me-2"></i>4
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
                      <col style={{ width: "200px" }} />
                      {eventVendors.map((_, index) => (
                        <col key={index} style={{ width: "250px" }} />
                      ))}
                      <col style={{ width: "auto" }} />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            width: "200px",
                            background:
                              "repeating-linear-gradient(135deg, #f3f3f3, #f3f3f3 10px, #e0e0e0 10px, #e0e0e0 11px)",
                          }}
                        ></td>
                        {eventVendors?.map((vendor, index) => {
                          const activeIndex = activeIndexes[vendor.id] || 0;
                          console.log("isCounterOffer :---",isCounterOffer);
                          
                          return (
                            <td
                              key={vendor.id}
                              style={{ background: "#f3f3f3" }}
                            >
                              <div
                                className="d-flex flex-column align-items-center justify-content-between"
                                style={{ height: "150px" }}
                              >
                                <div className="">
                                  {vendor.organization_name}
                                  <p>
                                    {formatDate(vendor?.bids?.[0]?.created_at)}
                                  </p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center w-100 my-2">
                                  <button
                                    className="px-2 border-0"
                                    style={{ fontSize: "1.5rem" }}
                                    onClick={() => handlePrev(vendor.id)}
                                  >
                                    &lt;
                                  </button>
                                  <div className="carousel-item-content mx-4">
                                    {activeIndex === 0 && "Current Bid"}
                                    {activeIndex === 1 && "Initial Bid"}
                                    {activeIndex === 2 && "1st Revision"}
                                  </div>
                                  <button
                                    className="px-2 border-0"
                                    style={{ fontSize: "1.5rem" }}
                                    onClick={() => handleNext(vendor.id)}
                                  >
                                    &gt;
                                  </button>
                                </div>
                                <button
                                  className={`purple-btn1 d-block mt-2 ${isCounterOffer ? 'disabled-btn' : ''}`}
                                  onClick={() => {
                                    if (
                                      vendor?.bids?.length > 0 &&
                                      vendor?.bids[0]?.bid_materials?.length > 0
                                    ) {
                                      handleCounterModalShow();
                                      setBidId(
                                        vendor.bids[0].bid_materials[0].bid_id
                                      );
                                    }
                                  }}
                                  disabled={isCounterOffer}
                                >
                                  Counter
                                </button>
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
                          style={{ minidth: "200px" }}
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
                  return (
                    <Accordion
                      key={ind}
                      title={materialData.material_name || "_"}
                      isDefault={true}
                      tableColumn={[
                        {
                          label: "Best Total Amount",
                          key: "bestTotalAmount",
                        },
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
                        { label: "GST", key: "gst" },
                        { label: "Realised GST", key: "realisedGST" },
                        { label: "Landed Amount", key: "landedAmount" },
                        {
                          label: "Participant Attachment",
                          key: "participantAttachment",
                        },
                        { label: "Total Amount", key: "totalAmount" },
                      ]}
                      tableData={materialData.bids_values?.map((material) => {
                        // console.log("material:", material);

                        return {
                          bestTotalAmount: material.total_amount || "_",
                          quantityAvailable: material.quantity_available || "_",
                          price: material.price || "_",
                          discount: material.discount || "_",
                          realisedDiscount: material.realised_discount || "_",
                          gst: material.gst || "_",
                          realisedGST: material.realised_gst || "_",
                          landedAmount: material.landed_amount || "_",
                          participantAttachment: "_",
                          totalAmount: material.total_amount || "_",
                        };
                      })}
                    />
                  );
                })}
                <Accordion
                  title={"Other Charges"}
                  isDefault={true}
                  tableColumn={[
                    {
                      label: "Freight Charge Amount",
                      key: "freightChrg",
                    },
                    { label: "GST on Freight", key: "freightGst" },
                    {
                      label: "Realised Freight Amount",
                      key: "freightRealised",
                    },
                    { label: "Warranty Clause", key: "warranty" },
                    { label: "Payment Terms", key: "payment" },
                    {
                      label: "Loading / Unloading Clause",
                      key: "loading",
                    },
                    { label: "Gross Total", key: "grossTotal" },
                  ]}
                  tableData={eventVendors?.flatMap((vendor) =>
                    vendor?.bids?.[0]
                      ? [
                          {
                            freightChrg:
                              vendor.bids[0].freight_charge_amount || "_",
                            freightGst: vendor.bids[0].gst_on_freight || "_",
                            freightRealised:
                              vendor.bids[0].realised_freight_charge_amount ||
                              "_",
                            warranty: vendor.bids[0].warranty_clause || "_",
                            payment: vendor.bids[0].payment_terms || "_",
                            loading:
                              vendor.bids[0].loading_unloading_clause || "_",
                            grossTotal: vendor.bids[0].gross_total || "_",
                          },
                        ]
                      : []
                  )}
                />
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
    </div>
  );
}
