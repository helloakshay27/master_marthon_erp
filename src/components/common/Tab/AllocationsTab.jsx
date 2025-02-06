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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [pmsIdVal, setPmsIdVal] = useState(null);
  const [bidMaterialIdVal, setBidMaterialIdVal] = useState(null);
  const [vendorIdVal, setVendorIdVal] = useState(null);
  const [dummyData, setDummyData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({});
  const [materialName, setMaterialName] = useState("");
  const isCreatingPO = useRef(false);
  const isUpdatingAllocation = useRef(false);
  const [poIsLoading, setPoIsLoading] = useState(false);
  const [participationSummary, setParticipationSummary] = useState({
    invited_vendor: 0,
    participated_vendor: 0,
  });
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [purchaseOrdersLoading, setPurchaseOrdersLoading] = useState(false);

  const toggleAccordion = (index) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    setSegeregatedMaterialData(SegregatedBidMaterials(eventVendors));
  }, [eventVendors]);

  const { eventId } = useParams();

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

  useEffect(() => {
    const fetchRemarks = async () => {
      try {
        const response = await fetch(
          `https://marathon.lockated.com/rfq/events/${eventId}/event_responses?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResponse(data);
        console.log("response:::::::________------___++_+_+_+_+_+_+_:--", data);
        setPmsIdVal(data.vendors[0]?.pms_supplier_id);
        // console.log("pmspmsp,spmspmspmspms +++++++___________------ PMS:-", pmsIdVal);
        
        setEventVendors(data.vendors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSelectedData = async () => {
      // try {
      //   const response = await fetch(
      //     `https://marathon.lockated.com/rfq/events/${eventId}/event_vendors/allocations?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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
  }, [eventId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://marathon.lockated.com/rfq/events/${eventId}/bids/${bidId}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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
  }, [eventId, bidId]);

  

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
    if (isUpdatingAllocation.current) return;
    isUpdatingAllocation.current = true;

    const {
      bid_id,
      material_id,
      material_name,
      vendor_id,
      vendor_name,
      pms_supplier_id,
      id
    } = data;


    if (!bid_id || !material_id || !vendor_id) {
      console.error("Missing bid_id, material_id, or vendor_id");
      isUpdatingAllocation.current = false;
      return;
    }

    setBidIdVal(bid_id);
    setBidMaterialIdVal(material_id);
    setVendorIdVal(vendor_id);
    setPmsIdVal(pms_supplier_id);

    try {
      const response = await axios.post(
        `https://marathon.lockated.com/rfq/events/${eventId}/event_vendors/${vendor_id}/update_allocation?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        {
          bid_id: bid_id,
          bid_material_id: id,
          delete_material: "false",
        }
      );

      const responseData = response.data;
      console.log("responseData", responseData.bid_materials, "data", data.id, "id", id);
      

      const bidMaterial = responseData.bid_materials.find(
        (material) => material.id === id
      );
      console.log(bidMaterial, "bidMaterial");
      

      if (!bidMaterial) {
        console.error("Bid material not found");
        isUpdatingAllocation.current = false;
        return;
      }

      const updatedSelectedData = {
        bestTotalAmount: bidMaterial.total_amount || "_",
        quantityAvailable: bidMaterial.quantity_available || "_",
        price: bidMaterial.price || "_",
        discount: bidMaterial.discount || "_",
        realisedDiscount: bidMaterial.realised_discount || "_",
        gst: bidMaterial.gst || "_",
        realisedGST: bidMaterial.realised_gst || "_",
        landedAmount: bidMaterial.landed_amount || "_",
        participantAttachment: "_",
        totalAmount: bidMaterial.total_amount || "_",
        materialName: bidMaterial.material_name || "_",
        vendorId: vendor_id,
        vendor_name: vendor_name,
        materialId: material_id,
        bidId: bid_id,
        pms_supplier_id: pms_supplier_id,
        id:id
      };

      setSelectedData((prevSelectedData) => {

        let filteredData = prevSelectedData
          .map((vendor) => ({
            ...vendor,
            materials: vendor.materials?.filter(
              (material) => material.materialName !== material_name
            ),
          }))
          .filter((vendor) => vendor.materials?.length > 0); // Remove vendors with no materials left

        // Ensure the material is assigned ONLY to the latest vendor
        const existingVendorIndex = filteredData.findIndex(
          (data) => data.vendorId === vendor_id
        );

        if (existingVendorIndex !== -1) {
          // Add material to the existing vendor
          filteredData[existingVendorIndex].materials.push(updatedSelectedData);
        } else {
          // Add new vendor with this material
          filteredData.push({
            vendorId: vendor_id,
            vendor_name: vendor_name,
            materials: [updatedSelectedData],
          });
        }

        return filteredData;
      });

      const updatedDummyData = [
        {
          label: "Freight Charge Amount",
          value: `₹${responseData.bids[0]?.freight_charge_amount || 0}`,
        },
        {
          label: "GST on Freight",
          value: `${responseData.bids[0]?.gst_on_freight || 0}%`,
        },
        {
          label: "Realised Freight Amount",
          value: `₹${
            responseData.bids[0]?.realised_freight_charge_amount || 0
          }`,
        },
        {
          label: "Warranty Clause",
          value: responseData.bids[0]?.warranty_clause || "-",
        },
        {
          label: "Payment Terms",
          value: responseData.bids[0]?.payment_terms || "-",
        },
        {
          label: "Loading / Unloading Clause",
          value: responseData.bids[0]?.loading_unloading_clause || "-",
        },
        {
          label: "Gross Total",
          value: `₹${responseData.bids[0]?.gross_total || 0}`,
        },
      ];

      setDummyData((prevDummyData) => [
        ...prevDummyData.filter((data) => data.vendorId !== vendor_id),
        { vendorId: vendor_id, data: updatedDummyData },
      ]);

      toast.success("Allocation updated successfully");
    } catch (err) {
      toast.error("Error updating allocation");
      setError(err.message);
    } finally {
      isUpdatingAllocation.current = false;
    }
  };

  const handleCreatePO = async (vendorData) => {
    if (isCreatingPO.current) return;
    setPoIsLoading(true);   

    const jsonBody = {
      orders: [
        {
          supplier_id: vendorData.materials[0].pms_supplier_id,
          bid: {
            id: vendorData.materials[0].bidId,
            bid_materials: vendorData.materials.map((material) => ({
              id: material.id,
            })),
          },
        },
      ],
    };

    try {
      const response = await axios.post(
        `https://marathon.lockated.com/rfq/events/${eventId}/event_po?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        jsonBody
      );
      toast.success("PO created successfully");
      setTimeout(() => {          
        setSelectedData([]);
      }, 1000);
    } catch (error) {
      if (error.response.status === 422) {
        toast.error("Already Ordered this purchase");
        setTimeout(() => {          
          setSelectedData([]);
        }, 1000);
      } 
      console.error("Error creating PO:", error);
    } finally {
      setPoIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchParticipationSummary = async () => {
      try {
        const response = await axios.get(
          `https://marathon.lockated.com/rfq/events/${eventId}/event_participate_summary?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        setParticipationSummary(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchParticipationSummary();
  }, [eventId]);

  // useEffect(() => {
  //   const fetchPurchaseOrders = async () => {

  //     setPmsIdVal(eventVendors[0]?.pms_supplier_id);
  //     console.log("pmsIdVal::--=------",pmsIdVal, eventVendors[0]?.pms_supplier_id, eventVendors);
      
  //     setPurchaseOrdersLoading(true);
  //     try {
  //       const response = await axios.get(
  //         `https://marathon.lockated.com/rfq/events/${eventId}/purchase_orders?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[event_vendor_pms_supplier_id_in]=${pmsIdVal}`
  //       );
  //       console.log("Purchase Orders:", response.data);
        
  //       setPurchaseOrders(response.data);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setPurchaseOrdersLoading(false);
  //     }
  //   };

  //   fetchPurchaseOrders();
  // }, [eventId]);

  const Loader = () => (
    <div className="loader-container">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p>Submitting your bid...</p>
    </div>
  );

  const purchaseOrderColumns = [
    { label: "PO Number", key: "po_number" },
    { label: "PO Date", key: "po_date" },
    { label: "PO Type", key: "po_type" },
    { label: "Consumption", key: "consumption" },
    { label: "Company Name", key: "company_name" },
    { label: "Project Name", key: "project_name" },
    { label: "PMS Site Name", key: "pms_site_name" },
    { label: "Material Type", key: "material_type" },
    { label: "MOR Number", key: "mor_number" },
    { label: "Supplier Advance", key: "supplier_advance" },
    { label: "Supplier Advance Amount", key: "supplier_advance_amount" },
    { label: "Supplier Name", key: "supplier_name" },
    { label: "Department Name", key: "department_name" },
    { label: "Tax Applicable Cost", key: "tax_applicable_cost" },
    { label: "Total Value", key: "total_value" },
    { label: "Status", key: "status" },
  ];

  return (
    <div
      className="tab-pane fade"
      id="allocation"
      role="tabpanel"
      aria-labelledby="allocation-tab"
      tabIndex={0}
    >
      <ToastContainer />
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
                <i className="bi bi-check2 me-2"></i>
                {participationSummary.participated_vendor || 0}
              </div>
              <div
                className="viewBy-main-child2-item d-flex align-items-center justify-content-center bg-light rounded-3 px-3 py-2"
                aria-label="Emails"
              >
                <i className="bi bi-envelope me-2"></i>
                {participationSummary.participated_vendor || 0}
              </div>
              <div
                className="viewBy-main-child2-item d-flex align-items-center justify-content-center bg-light rounded-3 px-3 py-2"
                aria-label="Views"
              >
                <i className="bi bi-eye me-2"></i>
                {participationSummary.invited_vendor}
              </div>
              <div
                className="viewBy-main-child2-item d-flex align-items-center justify-content-center bg-light rounded-3 px-3 py-2"
                aria-label="Completed"
              >
                <i className="bi bi-check-circle me-2"></i>
                {participationSummary.invited_vendor}
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
            {eventVendors.length ? (
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
                                  {vendor.full_name}
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
                      enableHoverEffect={true}
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
                        { label: "ID", key: "id" },
                        { label: "vendor id", key: "vendor_id" },
                        { label: "vendor name", key: "vendor_name" },
                        { label: "pms supplier id", key: "pms_supplier_id" },
                        { label: "material name", key: "material_name" },
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
                          id: material.id,
                          vendor_id: material.vendor_id,
                          vendor_name: material.vendor_name,
                          pms_supplier_id: material.pms_supplier_id,
                          material_name: material.material_name,
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

                <>
                  {poIsLoading ? (
                    <Loader />
                  ) : (
                    <>
                      {selectedData.length > 0 &&
                        selectedData.map((vendorData, index) => {
                          return (
                            <div className="card p-4 mt-3 border-0" key={index}>
                              <h4>{vendorData.vendor_name}</h4>

                              <Table
                                enableOverflowScroll={true}
                                style={{ width: "100%", overflowX: "auto" }}
                                columns={[
                                  {
                                    label: "Material Name",
                                    key: "materialName",
                                  },
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
                                  {
                                    label: "Landed Amount",
                                    key: "landedAmount",
                                  },
                                  {
                                    label: "Participant Attachment",
                                    key: "participantAttachment",
                                  },
                                  { label: "Total Amount", key: "totalAmount" },
                                ]}
                                data={vendorData.materials}
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
                                  onClick={() => handleCreatePO(vendorData)}
                                >
                                  Create PO
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </>
                  )}
                </>
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

      {purchaseOrders.length > 0 && (
        <div className="mt-4">
          <h4>Purchased Orders</h4>
          <Table
            columns={purchaseOrderColumns}
            data={purchaseOrders}
            isHorizontal={false}
          />
        </div>
      )}
    </div>
  );
}
