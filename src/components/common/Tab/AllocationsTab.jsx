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
import { SegregatedBidMaterials } from "../../../utils/SegregatedBidMaterials";
import Table from "../../base/Table/Table";
import DropArrowIcon from "../../common/Icon/DropArrowIcon";
import ShortTable from "../../base/Table/ShortTable";

export default function AllocationTab({ isCounterOffer }) {
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
  const [selectedData, setSelectedData] = useState([]);
  const [bidIdVal, setBidIdVal] = useState(null);
  const [bidMaterialIdVal, setBidMaterialIdVal] = useState(null);
  const [vendorIdVal, setVendorIdVal] = useState(null);
  const [dummyData, setDummyData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({});

  const toggleAccordion = (index) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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
        const response = await fetch(
          `https://marathon.lockated.com/rfq/events/${id}/event_responses?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
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
          `https://marathon.lockated.com/rfq/events/${id}/bids/bids_by_revision?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&revision_number=${revisionNumber}&q[event_vendor_id_in]=${vendorId}`
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
          `https://marathon.lockated.com/rfq/events/${id}/event_responses?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
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

    const fetchSelectedData = async () => {
      // try {
      //   const response = await fetch(
      //     `https://marathon.lockated.com/rfq/events/${id}/event_vendors/allocations?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      //   );
      //   if (!response.ok) {
      //     throw new Error(`HTTP error! status: ${response.status}`);
      //   }
      //   const data = await response.json();
      //   const updatedSelectedData = data.flatMap((vendor) =>
      //     vendor.bid_materials.map((material) => ({
      //       bestTotalAmount: material.total_amount || "_",
      //       quantityAvailable: material.quantity_available || "_",
      //       price: material.price || "_",
      //       discount: material.discount || "_",
      //       realisedDiscount: material.realised_discount || "_",
      //       gst: material.gst || "_",
      //       realisedGST: material.realised_gst || "_",
      //       landedAmount: material.landed_amount || "_",
      //       participantAttachment: "_",
      //       totalAmount: material.total_amount || "_",
      //       materialName: material.material_name || "_",
      //       vendorId: vendor.id,
      //     }))
      //   );
      //   setSelectedData(updatedSelectedData);
      //   const updatedDummyData = data.flatMap((vendor) =>
      //     vendor.bids.map((bid) => ({
      //       vendorId: vendor.id,
      //       data: [
      //         {
      //           label: "Freight Charge Amount",
      //           value: `₹${bid.freight_charge_amount}`,
      //         },
      //         {
      //           label: "GST on Freight",
      //           value: `${bid.gst_on_freight}%`,
      //         },
      //         {
      //           label: "Realised Freight Amount",
      //           value: `₹${bid.realised_freight_charge_amount}`,
      //         },
      //         {
      //           label: "Warranty Clause",
      //           value: bid.warranty_clause,
      //         },
      //         { label: "Payment Terms", value: bid.payment_terms },
      //         {
      //           label: "Loading / Unloading Clause",
      //           value: bid.loading_unloading_clause,
      //         },
      //         { label: "Gross Total", value: `₹${bid.gross_total}` },
      //       ],
      //     }))
      //   );
      //   setDummyData(updatedDummyData);
      // } catch (err) {
      //   setError(err.message);
      // }
    };

    fetchRemarks();
    fetchSelectedData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://marathon.lockated.com/rfq/events/${id}/bids/${bidId}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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

  const handleColumnClick = async (data, columnKey) => {
    console.log("Clicked column data:", data, columnKey);

    const { bid_id, material_id, vendor_id, vendor_name } = data;

    console.log("Parsed column data:", {
      bid_id,
      material_id,
      vendor_id,
      columnKey,
    });

    if (!bid_id || !material_id || !vendor_id) {
      console.error("Missing bid_id, material_id, or vendor_id");
      return;
    }

    setBidIdVal(bid_id);
    setBidMaterialIdVal(material_id);
    setVendorIdVal(vendor_id);

    try {
      const response = await axios.post(
        `https://marathon.lockated.com/rfq/events/${id}/event_vendors/${vendor_id}/update_allocation?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        {
          bid_id: bid_id,
          bid_material_id: material_id,
          delete_material: "false",
        }
      );

      const responseData = response.data;
      console.log("response:", responseData, material_id);

      const updatedSelectedData = responseData.bid_materials
        .filter((material) => material?.id === material_id)
        .map((material) => ({
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
          materialName: material.material_name || "_",
          vendorId: vendor_id,
          vendor_name: vendor_name,
        }));

      setSelectedData((prevSelectedData) => {
        console.log("prevSelectedData:", prevSelectedData);

        const existingVendorIndex = prevSelectedData.findIndex(
          (data) => data.vendorId === vendor_id
        );

        if (existingVendorIndex !== -1) {
          const existingMaterials =
            prevSelectedData[existingVendorIndex].materials;
          const isMaterialExists = existingMaterials.some(
            (material) =>
              material.materialName === updatedSelectedData[0].materialName
          );

          if (!isMaterialExists) {
            const updatedVendorData = {
              ...prevSelectedData[existingVendorIndex],
            };
            updatedVendorData.materials = [
              ...existingMaterials,
              ...updatedSelectedData,
            ];

            return prevSelectedData.map((data, index) =>
              index === existingVendorIndex ? updatedVendorData : data
            );
          } else {
            return prevSelectedData;
          }
        } else {
          return [
            ...prevSelectedData,
            { vendorId: vendor_id, materials: updatedSelectedData },
          ];
        }
      });

      // Process bids for ShortTable
      const updatedDummyData = [
        {
          label: "Freight Charge Amount",
          value: `₹${responseData.bids[0].freight_charge_amount}`,
        },
        {
          label: "GST on Freight",
          value: `${responseData.bids[0].gst_on_freight}%`,
        },
        {
          label: "Realised Freight Amount",
          value: `₹${responseData.bids[0].realised_freight_charge_amount}`,
        },
        {
          label: "Warranty Clause",
          value: responseData.bids[0].warranty_clause,
        },
        { label: "Payment Terms", value: responseData.bids[0].payment_terms },
        {
          label: "Loading / Unloading Clause",
          value: responseData.bids[0].loading_unloading_clause,
        },
        { label: "Gross Total", value: `₹${responseData.bids[0].gross_total}` },
      ];

      setDummyData((prevDummyData) => [
        ...prevDummyData.filter((data) => data.vendorId !== vendor_id),
        { vendorId: vendor_id, data: updatedDummyData },
      ]);
    } catch (err) {
      setError(err.message);
    }
  };

  const getSelectedDataColumns = () => {
    if (!selectedData) return [];
    return Object.keys(selectedData).map((key) => ({
      label: key,
      key: key,
    }));
  };

  return (
    <div
      className="tab-pane fade"
      id="allocation"
      role="tabpanel"
      aria-labelledby="allocation-tab"
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
                          style={{ minidth: "300px" }}
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
                      amount={materialData.total_amounts}
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
                        { label: "bid Id", key: "bid_id" },
                        { label: "Material ID", key: "material_id" },
                        { label: "vendor id", key: "vendor_id" },
                        { label: "vendor name", key: "vendor_name" },
                      ]}
                      tableData={materialData.bids_values?.map((material) => {
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
                          bid_id: material.bid_id,
                          material_id: material.material_id,
                          vendor_id: material.vendor_id,
                          vendor_name: material.vendor_name,
                        };
                      })}
                      onColumnClick={handleColumnClick}
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
                    { label: "bidId", key: "bid_id" },
                    { label: "Material ID", key: "material_id" },
                    { label: "vendor id", key: "vendor_id" },
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

                {selectedData.length > 0 &&
                  selectedData.map((vendorData, index) => {
                    console.log("vendorData", vendorData);

                    return (
                      <div className="card p-4 mt-3 border-0" key={index}>
                        <h4>{vendorData.materials[0]?.vendor_name}</h4>

                        {/* Bind the correct materials array to Table */}
                        <Table
                          enableOverflowScroll={true}
                          style={{ width: "100%", overflowX: "auto" }}
                          columns={[
                            { label: "Material Name", key: "materialName" },
                            {
                              label: "Quantity Available",
                              key: "quantityAvailable",
                            },
                            {
                              label: "Best Total Amount",
                              key: "bestTotalAmount",
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
                          data={vendorData.materials} // ✅ Fix: Pass the materials array instead of vendorData
                          isHorizontal={false}
                        />

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "20px",
                          }}
                        >
                          <ShortTable
                            data={
                              dummyData.find(
                                (d) => d.vendorId === vendorData.vendorId
                              )?.data || []
                            }
                            editable={false}
                          />
                        </div>

                        <div className="text-end">
                          <button
                            className="purple-btn2 mt-4"
                            style={{ width: "200px" }}
                          >
                            Create PO
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
