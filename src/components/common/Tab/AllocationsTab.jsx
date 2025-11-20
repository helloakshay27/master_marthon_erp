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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../../confi/apiDomain";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import SelectBox from "../../base/Select/SelectBox";

export default function AllocationTab({ isCounterOffer, onSwitchToPurchasedOrders }) {
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
  const [checkedColumns, setCheckedColumns] = useState({}); // State to track checked status of columns
  const [bulkBidId, setBulkBidId] = useState(null);
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(0);
  const [bidMaterialIndex, setBidMaterialIndex] = useState(0);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [taxOptions, setTaxOptions] = useState([]);
  const [deductionTaxOptions, setDeductionTaxOptions] = useState([]);
  const [chargesTaxModalData, setChargesTaxModalData] = useState([]);
  const [showChargesTaxModal, setShowChargesTaxModal] = useState(false);
  const [showAllocatedChargesTaxModal, setShowAllocatedChargesTaxModal] =
    useState(false);
  const [
    showAllocatedChargesTaxModalData,
    setShowAllocatedChargesTaxModalData,
  ] = useState([]);

  const toggleAccordion = (index) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleTaxModalClose = () => {
    setShowTaxModal(false);
  };

  const handleSaveTaxChanges = () => {
    setShowTaxModal(false);
  };

  useEffect(() => {
    setSegeregatedMaterialData(SegregatedBidMaterials(eventVendors));
  }, [eventVendors]);

  useEffect(() => {
    if (bulkBidId) {
      const updatedData = [...segeregatedMaterialData];
      updatedData.map((material) => ({
        ...material,
        bids_values: material.bids_values.map((bid) => ({
          ...bid,
          isChecked: bulkBidId === bid.bid_id,
        })),
      }));
      setSegeregatedMaterialData(updatedData);
    }
  }, [bulkBidId]);

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
    const fetchTaxes = async () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/taxes_dropdown?token=${token}`
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
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/deduction_tax_details?token=${token}`
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

  useEffect(() => {
    const fetchRemarks = async () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      try {
        const response = await fetch(
          `${baseURL}rfq/events/${eventId}/event_responses?token=${token}&page=1`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResponse(data);
        setPmsIdVal(data.vendors[0]?.pms_supplier_id);
        setEventVendors(data.vendors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRemarks();
  }, [eventId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/${eventId}/bids/${bidId}?token=${token}`
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

  const handleColumnClick = async (
    data,
    columnKey,
    event,
    isBulk = false,
    updatedSegeregatedMaterialData
  ) => {
    const isDeletedAllocation = event?.target?.checked; // Ensure event is used here
    setVendorIdVal(data.vendor_id);

    if (isUpdatingAllocation.current) return;
    isUpdatingAllocation.current = true;
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    try {
      const payload = isBulk
        ? {
          bid_id: data[0].bid_id,
          select_all: "true",
          delete_material: `${!isDeletedAllocation}`,
        }
        : {
          bid_id: data.bid_id,
          bid_material_id: data.id,
          delete_material: `${!isDeletedAllocation}`,
        };

      const response = await axios.post(
        `${baseURL}rfq/events/${eventId}/event_vendors/${isBulk ? data[0].vendor_id : data.vendor_id
        }/update_allocation?token=${token}`,
        payload
      );

      const responseData = response.data;
      if (responseData?.bids?.length > 0) {
        const lastBid = responseData.bids[responseData.bids.length - 1];
        setShowAllocatedChargesTaxModalData(lastBid?.tax_with_charge || []);
      }

      if (responseData?.bid_materials?.length === 0) {
        setSelectedData((prevSelectedData) =>
          prevSelectedData.filter(
            (entry) =>
              entry.materials[0]?.bidId !==
              (isBulk ? data[0]?.bid_id : data?.bid_id)
          )
        );

        setDummyData((prevDummyData) =>
          prevDummyData.filter((entry) =>
            isBulk
              ? !data.some((item) => item.vendor_id === entry.vendorId)
              : entry.vendorId !== data.vendor_id
          )
        );

        toast.success("Allocation removed successfully");

        // Remove automatic tab switching from allocation removal
        // Only switch tabs when PO is successfully created
        isUpdatingAllocation.current = false;
        return;
      }

      const bidMaterials = responseData.bid_materials;

      if (!bidMaterials || bidMaterials.length === 0) {
        console.error("Bid materials not found");
        isUpdatingAllocation.current = false;
        setSelectedData([]);
        return [];
      }

      if (isBulk) {
        setBulkBidId(data[0].bid_id);
      } else {
        // Check if all individual checkboxes for the vendor are selected
        const allChecked = updatedSegeregatedMaterialData
          .flatMap((material) => material.bids_values) // Flatten all bids_values
          .filter((bid) => bid.vendor_id === data.vendor_id) // Filter by vendor_id
          .every((bid) => bid.isChecked); // Check if all are checked

        // Update the "Select All" checkbox for the vendor
        setCheckedColumns((prev) => ({
          ...prev,
          [data.vendor_id]: allChecked,
        }));
      }

      const updatedSelectedData = bidMaterials.map((material) => ({
        bestTotalAmount: material?.total_amount || "_",
        quantityAvailable: material?.quantity_available || "_",
        price: material?.price || "_",
        discount: material?.discount || "_",
        realisedDiscount: material?.realised_discount || "_",
        gst: material?.gst || "_",
        realisedGST: material?.realised_gst || "_",
        landedAmount: material?.landed_amount || "_",
        participantAttachment: "_",
        totalAmount: material?.total_amount || "_",
        materialName: material?.material_name || "_",
        vendorId: material.vendor_id,
        vendor_name: material.vendor_name,
        materialId: material.material_id,
        bidId: material.bid_id,
        pms_supplier_id: material.pms_supplier_id,
        id: material.id,
        po_exist: material.po_exist,
      }));

      setSelectedData((prevSelectedData) => {
        const updatedData = [...prevSelectedData];

        updatedSelectedData.forEach((updatedMaterial) => {
          const existingVendorIndex = updatedData.findIndex(
            (vendor) => vendor.vendor_name === updatedMaterial.vendor_name
          );

          if (existingVendorIndex !== -1) {
            const existingMaterials =
              updatedData[existingVendorIndex].materials;
            // console.log("updatedMaterial",existingMaterials,"updatedMaterial", updatedMaterial);

            if (
              !existingMaterials.some(
                (material) => material.id === updatedMaterial.id
              )
            ) {
              updatedData[existingVendorIndex].materials.push(updatedMaterial);
            } else {
              updatedData[existingVendorIndex].materials = [updatedMaterial];
            }
          } else {
            updatedData.push({
              vendorId: updatedMaterial.vendorId,
              vendor_name: updatedMaterial.vendor_name,
              materials: [updatedMaterial],
            });
          }
        });

        return updatedData;
      });

      const updatedDummyData = updatedSelectedData.reduce((acc, material) => {
        const vendorIndex = acc.findIndex(
          (entry) => entry.vendorId === material.vendorId
        );

        const dummyDataEntry = [
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
            value: `₹${responseData.bids[0]?.realised_freight_charge_amount || 0
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

        if (vendorIndex !== -1) {
          acc[vendorIndex].data = dummyDataEntry;
        } else {
          acc.push({
            vendorId: material.vendorId,
            data: dummyDataEntry,
          });
        }

        return acc;
      }, []);

      setDummyData(updatedDummyData);

      toast.success("Allocation updated successfully");
    } catch (err) {
      console.error("Error updating allocation:", err);
      toast.error("Error updating allocation");
    } finally {
      isUpdatingAllocation.current = false;
    }
  };

  const handleCreatePO = async (vendorData) => {
    if (isCreatingPO.current) return;
    isCreatingPO.current = true;
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
          validity_period: vendorData.validityPeriod || null,
        },
      ],
    };
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    try {
      const response = await axios.post(
        `${baseURL}rfq/events/${eventId}/event_po?token=${token}`,
        jsonBody
      );
      
      // Only proceed if API call is successful
      toast.success("PO created successfully");
      
      // Remove the created PO data from selectedData after successful creation
      setTimeout(() => {
        setSelectedData((prevSelectedData) =>
          prevSelectedData.filter(
            (data) => data.materials[0].bidId !== vendorData.materials[0].bidId
          )
        );
      }, 1000);

      // Switch to Purchased Orders tab only after successful PO creation
      if (onSwitchToPurchasedOrders) {
        setTimeout(() => {
          onSwitchToPurchasedOrders();
        }, 1500); // Wait for data removal to complete
      }

    } catch (error) {
      console.error("Error creating PO:", error);
      // Show appropriate error message based on status code
      const errorMessage = error.response?.status === 422 
        ? "Already Ordered this purchase" 
        : "Error creating PO";
      toast.error(errorMessage);
      // Do not switch tabs if there's an error
    } finally {
      setPoIsLoading(false);
      isCreatingPO.current = false; // Reset the flag after completion
    }
  };

  useEffect(() => {
    const fetchParticipationSummary = async () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/${eventId}/event_participate_summary?token=${token}`
        );
        setParticipationSummary(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchParticipationSummary();
  }, [eventId]);

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
      </div>
      <p>Submitting your bid...</p>
    </div>
  );

  const handleSelectAll = (materialData) => {
    materialData.bids_values?.forEach((material) => {
      handleColumnClick(material, "selectAll");
    });
  };

  const handleColumnCheckboxChange = (vendorId, isChecked) => {
    setCheckedColumns((prev) => ({
      ...prev,
      [vendorId]: isChecked,
    }));

    // Filter bid_values for the specific vendor
    const vendorMaterials = segeregatedMaterialData.flatMap((material) =>
      material.bids_values?.filter((bid) => bid.vendor_id === vendorId)
    );

    handleColumnClick(
      vendorMaterials,
      "selectAll",
      { target: { checked: isChecked } },
      true
    );
    // Update the isChecked property for the filtered materials
    const updatedSegeregatedMaterialData = segeregatedMaterialData.map(
      (material) => ({
        ...material,
        bids_values: material.bids_values.map((bid) => ({
          ...bid,
          isChecked: bid.vendor_id === vendorId ? isChecked : bid.isChecked,
        })),
      })
    );

    // Update the state with the modified data
    setSegeregatedMaterialData(updatedSegeregatedMaterialData);
  };

  return (
    <div
      className="tab-pane fade allocation"
      id="allocation"
      role="tabpanel"
      aria-labelledby="allocation-tab"
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
                      <tr>
                        <td
                          className="viewBy-tBody1-p"
                          style={{ minidth: "300px", textAlign: "left" }}
                        >
                          Select All Materials for Allocation
                        </td>
                        {eventVendors?.map((vendor) => {
                          return (
                            <td key={`selectall-${vendor.id}`}>
                              <input
                                type="checkbox"
                                checked={!!checkedColumns[vendor.id]}
                                onChange={(e) =>
                                  handleColumnCheckboxChange(
                                    vendor.id,
                                    e.target.checked
                                  )
                                }
                              />
                            </td>
                          );
                        })}
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
                    <>
                      <Accordion
                        key={ind}
                        title={materialData.material_name || "_"}
                        amount={materialData.bids_values?.map(bv => bv.total_amount)} // Use bids_values to get amounts
                        enableHoverEffect={true}
                        isAllocation={true}
                        tableColumn={[
                          { label: "Best Total Amount", key: "bestTotalAmount" },
                          { label: "Quantity Available", key: "quantityAvailable" },
                          { label: "Price", key: "price" },
                          { label: "Discount", key: "discount" },
                          { label: "Realised Discount", key: "realisedDiscount" },
                          { label: "GST", key: "gst" },
                          { label: "Realised GST", key: "realisedGST" },
                          { label: "Landed Amount", key: "landedAmount" },
                          { label: "Participant Attachment", key: "participantAttachment" },
                          { label: "Total Amount", key: "totalAmount" },
                          { label: "bid Id", key: "bid_id" },
                          { label: "Material ID", key: "material_id" },
                          { label: "ID", key: "id" },
                          { label: "vendor id", key: "vendor_id" },
                          { label: "vendor name", key: "vendor_name" },
                          { label: "pms supplier id", key: "pms_supplier_id" },
                          { label: "material name", key: "material_name" },
                          // { label: "PO Exist", key: "po_exist" },
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
                            console.log();

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
                              po_exists: material.po_exists,
                              isChecked: material.isChecked || false,
                              po_exist: material.po_exist, // <-- you get po_exist here
                              ...material.extra_columns.reduce(
                                (acc, column) => {
                                  if (extraData[column]?.value) {
                                    const value = extraData[column].value;
                                    acc[column] = Array.isArray(value)
                                      ? value
                                        .map(
                                          (item) =>
                                            `${item.taxChargeType || ""}: ${item.amount || 0
                                            }${item.taxChargePerUom
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
                                },
                                {}
                              ),
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
                        setSegeregatedMaterialData={setSegeregatedMaterialData}
                        onColumnClick={(
                          data,
                          columnKey,
                          e,
                          updatedSegeregatedMaterialData
                        ) => {
                          handleColumnClick(
                            data,
                            columnKey,
                            e,
                            false,
                            updatedSegeregatedMaterialData
                          );
                        }}
                        onSelectAll={() => handleSelectAll(materialData)}
                        accordianIndex={ind}
                      />
                    </>
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

                  if (extractedData.length === 0) {
                    // return <p>No data available</p>;
                  }

                  const extractedKeys = Array.from(
                    new Set(extractedData.flatMap((obj) => Object.keys(obj)))
                  );

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
                })()}
                {(() => {
                  const extractedChargeData =
                    eventVendors?.flatMap((vendor) => {
                      const charges = vendor?.bids?.[0]?.extra?.charges || [];
                      return charges.map((charge) => ({
                        charge_id: charge.charge_id,
                        amount: Number(charge.amount || 0),
                        realisedAmount: Number(charge.realised_amount || 0),
                        taxDetails: charge.taxes_and_charges || [],
                      }));
                    }) || [];

                  const handleChargesTaxModalOpen = (taxDetails) => {
                    setShowChargesTaxModal(true);
                    setChargesTaxModalData(taxDetails);
                  };

                  const renderAccordion = (title, chargeId) => {
                    const data = extractedChargeData.filter(
                      (c) => c.charge_id === chargeId
                    );

                    if (data.length === 0) return null;

                    return (
                      <Accordion
                        key={chargeId}
                        title={title}
                        isDefault={true}
                        tableColumn={[
                          { label: "Amount", key: "amount" },
                          { label: "Realised Amount", key: "realisedAmount" },
                          { label: "Tax Details", key: "taxDetails" },
                        ]}
                        tableData={data.map((charge) => ({
                          amount: charge.amount || "-",
                          realisedAmount: charge.realisedAmount || "-",
                          taxDetails: (
                            <button
                              className="purple-btn2"
                              onClick={() =>
                                handleChargesTaxModalOpen(charge.taxDetails)
                              }
                            >
                              View Tax
                            </button>
                          ),
                        }))}
                      />
                    );
                  };

                  const accordions = [
                    renderAccordion("Handling Charges", 2),
                    renderAccordion("Other Charges", 4),
                    renderAccordion("Freight Charges", 5),
                  ].filter(Boolean); // remove nulls

                  return accordions.length > 0 ? <>{accordions}</> : null;
                })()}

                <>
                  {poIsLoading ? (
                    <Loader />
                  ) : (
                    <>
                      {selectedData.length > 0 &&
                        selectedData.map((vendorData, index) => {
                          if (
                            !vendorData.materials ||
                            vendorData.materials.length === 0
                          ) {
                            return null;
                          }
                          return (
                            <div className="card p-4 mt-3 border-0" key={index}>
                              <h4>{vendorData.vendor_name}</h4>

                              <Table
                                // enableOverflowScroll={true}
                                // style={{ width: "100%", overflowX: "auto" }}
                                isMinWidth={true}
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
                                  {
                                    label: "Landed Amount",
                                    key: "landedAmount",
                                  },
                                  { label: "Total Amount", key: "totalAmount" },
                                ]}
                                data={vendorData.materials}
                                isHorizontal={false}
                              />

                              {(() => {
                                const allocatedCharges =
                                  showAllocatedChargesTaxModalData || [];

                                const renderAccordion = (title, chargeId) => {
                                  const chargeData = allocatedCharges.filter(
                                    (charge) => charge.charge_id === chargeId
                                  );

                                  if (chargeData.length === 0) return null;

                                  return (
                                    <Accordion
                                      key={chargeId}
                                      title={title}
                                      isDefault={true}
                                      tableColumn={[
                                        { label: "Amount", key: "amount" },
                                        {
                                          label: "Realised Amount",
                                          key: "realised_amount",
                                        },
                                        {
                                          label: "Tax Details",
                                          key: "tax_button",
                                        },
                                      ]}
                                      tableData={chargeData.map((charge) => ({
                                        amount: charge.amount || "-",
                                        realised_amount:
                                          charge.realised_amount || "-",
                                        tax_button: (
                                          <button
                                            className="purple-btn2"
                                            onClick={() => {
                                              setShowChargesTaxModal(true);
                                              setChargesTaxModalData(
                                                charge.taxes_and_charges || []
                                              );
                                            }}
                                          >
                                            View Tax
                                          </button>
                                        ),
                                      }))}
                                    />
                                  );
                                };

                                const accordions = [
                                  renderAccordion("Handling Charges", 2),
                                  renderAccordion("Other Charges", 4),
                                  renderAccordion("Freight Charges", 5),
                                ].filter(Boolean); // remove nulls

                                return accordions.length > 0 ? (
                                  <div className="mt-4">{accordions}</div>
                                ) : null;
                              })()}

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  marginTop: "20px",
                                }}
                              >
                                <div style={{ marginTop: "20px" }}>
                                  <label
                                    className="po-fontBold"
                                    htmlFor={`validity-period-${index}`}
                                    style={{ marginRight: "10px" }}
                                  >
                                    Validity Period
                                  </label>
                                  <input
                                    type="datetime-local"
                                    id={`validity-period-${index}`}
                                    className="form-control"
                                    value={vendorData.validityPeriod || ""}
                                    min={new Date().toISOString().slice(0, 16)} // Disable past dates and times
                                    onChange={(e) => {
                                      const selectedDate = new Date(
                                        e.target.value
                                      );
                                      const currentDate = new Date();

                                      if (selectedDate <= currentDate) {
                                        toast.error(
                                          "Only future dates and times can be selected"
                                        );
                                        return;
                                      }

                                      const updatedSelectedData = [
                                        ...selectedData,
                                      ];
                                      updatedSelectedData[
                                        index
                                      ].validityPeriod = e.target.value;
                                      setSelectedData(updatedSelectedData);
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="text-end">
                                <button
                                  className="purple-btn2 mt-4"
                                  style={{ width: "200px" }}
                                  onClick={() => handleCreatePO(vendorData)}
                                  disabled={poIsLoading || isCreatingPO.current}
                                >
                                  {poIsLoading ? "Creating PO..." : "Create PO"}
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

      <DynamicModalBox
        show={showChargesTaxModal}
        onHide={() => setShowChargesTaxModal(false)}
        size="lg"
        title="Tax Details"
        centered={true}
      >
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Tax/Charge Type</th>
                <th>Tax Percentage</th>
                <th className="text-center">Inclusive</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* Addition Tax & Charges */}
              <tr>
                <td>Addition Tax & Charges</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              {chargesTaxModalData
                ?.filter((item) => item.addition)
                ?.map((item, rowIndex) => (
                  <tr key={`addition-${rowIndex}-${item.id}`}>
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
                        defaultValue={item.percentage || item.taxChargePerUom}
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
                        onChange={(e) => { }}
                        readOnly
                        disabled={true}
                      />
                    </td>
                  </tr>
                ))}

              {/* Deduction Tax */}
              <tr>
                <td>Deduction Tax</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              {chargesTaxModalData
                ?.filter((item) => !item.addition)
                ?.map((item, rowIndex) => (
                  <tr key={`deduction-${rowIndex}-${item.id}`}>
                    <td>
                      <SelectBox
                        options={deductionTaxOptions}
                        defaultValue={
                          item.taxChargeType ||
                          deductionTaxOptions.find(
                            (option) => option.id === item.resource_id
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
                        value={item.taxChargePerUom || item.percentage}
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
                        <option value="1%">1%</option>
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
                        readOnly
                        disabled={true}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </DynamicModalBox>

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
                              // value={item.taxChargePerUom}
                              defaultValue={item?.tax_percentage
                                ? item.tax_percentage.includes("%")
                                  ? item.tax_percentage
                                  : `${item.tax_percentage}%`
                                : item?.taxChargePerUom
                                  ? item.taxChargePerUom.includes("%")
                                    ? item.taxChargePerUom
                                    : `${item.taxChargePerUom}%`
                                  : ""}
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
                              <option value="2%">2%</option>
                              <option value="6%">6%</option>
                              <option value="9%">9%</option>
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
                              onChange={(e) => { }}
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
    </div>
  );
}