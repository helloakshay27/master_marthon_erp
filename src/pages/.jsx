import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

const PoDetails = () => {
  const { id } = useParams(); // Get PO ID from URL
  const [poData, setPoData] = useState(null);
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const [charges, setCharges] = useState([]);
  const [otherCosts, setOtherCosts] = useState([]);
  const [chargeNames, setChargeNames] = useState([]);
  // Taxes modal state
  const [showTaxesModal, setShowTaxesModal] = useState(false);
  const [selectedChargeId, setSelectedChargeId] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null); // 'charge' or 'cost'

  const [chargeTaxes, setChargeTaxes] = useState({
    additionTaxes: [],
    deductionTaxes: [],
    baseCost: 0,
    netCost: 0,
  });

  // Handle charges functions
  const addCharge = () => {
    const newCharge = {
      // No ID for new records - let the API generate it
      charge_name: "",
      charge_id: 0,
      amount: "",
      realised_amount: "",
    };
    setCharges((prev) => [...prev, newCharge]);
  };

  const removeCharge = (id) => {
    setCharges((prev) => prev.filter((charge) => charge.id !== id));
  };

  const handleChargeChange = (id, field, value) => {
    setCharges((prev) =>
      prev.map((charge) => {
        if (charge.id === id) {
          const updatedCharge = { ...charge, [field]: value };

          // If charge_name is being updated, also update charge_id
          if (field === "charge_name") {
            const chargeNameObj = chargeNames.find((cn) => cn.name === value);
            if (chargeNameObj) {
              updatedCharge.charge_id = chargeNameObj.id;
            }
          }

          return updatedCharge;
        }
        return charge;
      })
    );
  };
  // ...existing code...
  const addCost = () => {
    const newCost = {
      // No ID for new records - let the API generate it
      cost_name: "",
      amount: "",
      scope: "",
      realised_amount: "",
    };
    setOtherCosts((prev) => [...prev, newCost]);
  };

  const removeCost = (id) => {
    setOtherCosts((prev) => prev.filter((cost) => cost.id !== id));
  };

  const handleCostChange = (id, field, value) => {
    setOtherCosts((prev) =>
      prev.map((cost) => (cost.id === id ? { ...cost, [field]: value } : cost))
    );
  };
  // ...existing code...

  // Handle taxes modal functions

  const handleCloseTaxesModal = () => {
    setShowTaxesModal(false);
    setSelectedChargeId(null);
    setSelectedItemType(null);
    // Don't reset chargeTaxes to preserve data for reopening
  };

  const addTaxRow = (type) => {
    const newTax = {
      // No ID for new records - let the API generate it
      taxType: "",
      taxPercentage: "",
      inclusive: false,
      amount: "",
    };

    if (type === "addition") {
      setChargeTaxes((prev) => ({
        ...prev,
        additionTaxes: [...prev.additionTaxes, newTax],
      }));
    } else {
      setChargeTaxes((prev) => ({
        ...prev,
        deductionTaxes: [...prev.deductionTaxes, newTax],
      }));
    }
  };

  const removeTaxRow = (type, taxId) => {
    if (type === "addition") {
      setChargeTaxes((prev) => ({
        ...prev,
        additionTaxes: prev.additionTaxes.filter((tax) => tax.id !== taxId),
      }));
    } else {
      setChargeTaxes((prev) => ({
        ...prev,
        deductionTaxes: prev.deductionTaxes.filter((tax) => tax.id !== taxId),
      }));
    }
  };

  const handleTaxChange = (type, taxId, field, value) => {
    if (type === "addition") {
      setChargeTaxes((prev) => {
        const updatedAdditionTaxes = prev.additionTaxes.map((tax) => {
          if (tax.id === taxId) {
            const updatedTax = { ...tax, [field]: value };

            // Auto-calculate amount when taxType, taxPercentage, or inclusive changes
            if (
              field === "taxType" ||
              field === "taxPercentage" ||
              field === "inclusive"
            ) {
              if (
                updatedTax.taxType &&
                updatedTax.taxPercentage &&
                !updatedTax.inclusive
              ) {
                const percentage =
                  parseFloat(updatedTax.taxPercentage.replace("%", "")) || 0;
                const baseAmount = parseFloat(chargeTaxes.baseCost) || 0;
                const calculatedAmount = (percentage / 100) * baseAmount;
                updatedTax.amount = calculatedAmount.toFixed(2);
              } else {
                updatedTax.amount = "0";
              }
            }

            return updatedTax;
          }
          return tax;
        });

        // Calculate net cost
        const additionTotal = updatedAdditionTaxes.reduce((sum, tax) => {
          return sum + (parseFloat(tax.amount) || 0);
        }, 0);

        const deductionTotal = prev.deductionTaxes.reduce((sum, tax) => {
          return sum + (parseFloat(tax.amount) || 0);
        }, 0);

        const netCost = chargeTaxes.baseCost + additionTotal - deductionTotal;

        return {
          ...prev,
          additionTaxes: updatedAdditionTaxes,
          netCost: netCost.toFixed(2),
        };
      });
    } else {
      setChargeTaxes((prev) => {
        const updatedDeductionTaxes = prev.deductionTaxes.map((tax) => {
          if (tax.id === taxId) {
            const updatedTax = { ...tax, [field]: value };

            // Auto-calculate amount when taxType, taxPercentage, or inclusive changes
            if (
              field === "taxType" ||
              field === "taxPercentage" ||
              field === "inclusive"
            ) {
              if (
                updatedTax.taxType &&
                updatedTax.taxPercentage &&
                !updatedTax.inclusive
              ) {
                const percentage =
                  parseFloat(updatedTax.taxPercentage.replace("%", "")) || 0;
                const baseAmount = parseFloat(chargeTaxes.baseCost) || 0;
                const calculatedAmount = (percentage / 100) * baseAmount;
                updatedTax.amount = calculatedAmount.toFixed(2);
              } else {
                updatedTax.amount = "0";
              }
            }

            return updatedTax;
          }
          return tax;
        });

        // Calculate net cost
        const additionTotal = prev.additionTaxes.reduce((sum, tax) => {
          return sum + (parseFloat(tax.amount) || 0);
        }, 0);

        const deductionTotal = updatedDeductionTaxes.reduce((sum, tax) => {
          return sum + (parseFloat(tax.amount) || 0);
        }, 0);

        const netCost = chargeTaxes.baseCost + additionTotal - deductionTotal;

        return {
          ...prev,
          deductionTaxes: updatedDeductionTaxes,
          netCost: netCost.toFixed(2),
        };
      });
    }
  };

  const handleSaveTaxes = () => {
    console.log("Save taxes button clicked!");
    console.log("Selected item type:", selectedItemType);
    console.log("Selected charge ID:", selectedChargeId);
    console.log("Charge taxes data:", chargeTaxes);

    // Update the charge or cost with taxes data
    if (selectedItemType === "charge") {
      setCharges((prev) =>
        prev.map((charge) =>
          charge.id === selectedChargeId
            ? {
                ...charge,
                taxes: {
                  additionTaxes: chargeTaxes.additionTaxes,
                  deductionTaxes: chargeTaxes.deductionTaxes,
                  netCost: chargeTaxes.netCost,
                },
                realised_amount: chargeTaxes.netCost, // Set realised amount to net cost
              }
            : charge
        )
      );
    } else {
      setOtherCosts((prev) =>
        prev.map((cost) =>
          cost.id === selectedChargeId
            ? {
                ...cost,
                taxes: {
                  additionTaxes: chargeTaxes.additionTaxes,
                  deductionTaxes: chargeTaxes.deductionTaxes,
                  netCost: chargeTaxes.netCost,
                },
                realised_amount: chargeTaxes.netCost, // Set realised amount to net cost
              }
            : cost
        )
      );
    }
    handleCloseTaxesModal();
  };

  // Fetch charges addition taxes
  const fetchChargesAdditionTaxes = async () => {
    try {
      const response = await axios.get(
        `${baseURL}rfq/events/addition_taxes_dropdown?token=${token}`
      );
      console.log("Charges addition taxes response:", response.data);
      setChargesAdditionTaxOptions(response.data.taxes || []);
    } catch (error) {
      console.error("Error fetching charges addition taxes:", error);
      setChargesAdditionTaxOptions([]);
    }
  };

  // Fetch charges deduction taxes
  const fetchChargesDeductionTaxes = async () => {
    try {
      const response = await axios.get(
        `${baseURL}rfq/events/deduction_tax_details?token=${token}`
      );
      console.log("Charges deduction taxes response:", response.data);
      setChargesDeductionTaxOptions(response.data.taxes || []);
    } catch (error) {
      console.error("Error fetching charges deduction taxes:", error);
      setChargesDeductionTaxOptions([]);
    }
  };

  // Fetch charges tax percentages
  const fetchChargesTaxPercentages = async () => {
    try {
      const response = await axios.get(
        `${baseURL}rfq/events/tax_percentage?token=${token}`
      );
      console.log("Charges tax percentages response:", response.data);
      setChargesTaxPercentages(response.data || []);
    } catch (error) {
      console.error("Error fetching charges tax percentages:", error);
      setChargesTaxPercentages([]);
    }
  };

  // Fetch charge names from API
  const fetchChargeNames = async () => {
    try {
      const response = await axios.get(
        `${baseURL}tax_configurations/charge_names.json?token=${token}`
      );
      console.log("Charge names response:", response.data);
      setChargeNames(response.data || []);
    } catch (error) {
      console.error("Error fetching charge names:", error);
      setChargeNames([]);
    }
  };

  // Get percentages for specific tax category
  const getChargesTaxPercentages = (taxCategoryId) => {
    const taxData = chargesTaxPercentages.find(
      (tax) => tax.tax_category_id === parseInt(taxCategoryId)
    );
    return taxData ? taxData.percentage : [];
  };

  useEffect(() => {
    // Replace with your actual token logic
    const token = "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414";
    axios
      .get(
        `https://marathon.lockated.com/purchase_orders/${id}/ropo_detail.json?token=${token}`
      )
      .then((res) => setPoData(res.data))

      .catch((err) => console.error("Failed to fetch PO details", err));

      
  }, [id]);

  if (!poData) {
    return <div>Loading...</div>;
  }

  const handleOpenTaxesModal = (itemId, itemType = "charge") => {
    setSelectedChargeId(itemId);
    setSelectedItemType(itemType);

    let item;
    if (itemType === "charge") {
      item = poData.charges_with_taxes?.find((c) => c.id === itemId);
    } else {
      item = poData.other_costs_with_taxes?.find((c) => c.id === itemId);
    }

    if (!item) return;

    const baseCost = parseFloat(item.amount) || 0;

    // Map API taxes into addition & deduction
    const additionTaxes =
      item.taxes_and_charges
        ?.filter((t) => t.addition)
        .map((t) => ({
          id: t.id,
          taxType: t.resource_id,
          taxPercentage: t.percentage,
          inclusive: t.inclusive,
          amount: t.amount,
        })) || [];

    const deductionTaxes =
      item.taxes_and_charges
        ?.filter((t) => !t.addition)
        .map((t) => ({
          id: t.id,
          taxType: t.resource_id,
          taxPercentage: t.percentage,
          inclusive: t.inclusive,
          amount: t.amount,
        })) || [];

    setChargeTaxes({
      baseCost: baseCost.toFixed(2),
      additionTaxes,
      deductionTaxes,
      netCost: parseFloat(item.realised_amount || baseCost).toFixed(2),
    });

    setShowTaxesModal(true);
  };

  return (
    <div>
      <div className="main-content">
        <div className="website-content" style={{ overflowY: "auto" }}>
          <div className="tab-content" id="myTabContent">
            <div className="website-content  container-fluid ">
              <div className="module-data-sectiondetails_page">
                <a href="/purchase_orders">
                  Home &gt; Purchase &gt; Purchase Order{" "}
                </a>
                <h5 className="mt-3"> Purchase Order</h5>
                <div className="row my-4 align-items-center">
                  <div className="col-md-12 ">
                    <div className="mor-tabs mt-4">
                      <ul
                        className="nav nav-pills mb-3 justify-content-center"
                        id="pills-tab"
                        role="tablist"
                      >
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link "
                            id="pills-home-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-home"
                            type="button"
                            role="tab"
                            aria-controls="pills-home"
                            aria-selected="true"
                          >
                            MOR
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="pills-profile-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-profile"
                            type="button"
                            role="tab"
                            aria-controls="pills-profile"
                            aria-selected="false"
                          >
                            MOR Approval
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="pills-contact-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-contact"
                            type="button"
                            role="tab"
                            aria-controls="pills-contact"
                            aria-selected="false"
                          >
                            Acceptance
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="pills-contact-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-contact"
                            type="button"
                            role="tab"
                            aria-controls="pills-contact"
                            aria-selected="false"
                          >
                            Auction / RFQ
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link active"
                            id="pills-contact-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-contact"
                            type="button"
                            role="tab"
                            aria-controls="pills-contact"
                            aria-selected="false"
                          >
                            PO
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="pills-contact-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-contact"
                            type="button"
                            role="tab"
                            aria-controls="pills-contact"
                            aria-selected="false"
                          >
                            Advance
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="pills-contact-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-contact"
                            type="button"
                            role="tab"
                            aria-controls="pills-contact"
                            aria-selected="false"
                          >
                            Material Received
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="pills-contact-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-contact"
                            type="button"
                            role="tab"
                            aria-controls="pills-contact"
                            aria-selected="false"
                          >
                            Billing
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="pills-contact-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-contact"
                            type="button"
                            role="tab"
                            aria-controls="pills-contact"
                            aria-selected="false"
                          >
                            Accounts
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div id="content1 " className="">
                  <div className="card ms-2">
                    <div className="card-body">
                      <div className=" text-center">
                        <h4>PO (ROPO) </h4>
                      </div>
                      <section className="mor p-2 pt-2">
                        <div className="container-fluid">
                          <div className="col-md-12 mb-3 row">
                            <div className="col-md-9">
                              <nav>
                                <div
                                  className="nav nav-tabs"
                                  id="nav-tab"
                                  role="tablist"
                                >
                                  <button
                                    className="nav-link active"
                                    id="nav-home-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#Domestic1"
                                    type="button"
                                    role="tab"
                                    aria-controls="nav-home"
                                    aria-selected="true"
                                  >
                                    PO Details
                                  </button>
                                  <button
                                    className="nav-link"
                                    id="nav-profile-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#Domestic2"
                                    type="button"
                                    role="tab"
                                    aria-controls="nav-profile"
                                    aria-selected="false"
                                  >
                                    Rate &amp; Taxes
                                  </button>
                                  <button
                                    className="nav-link"
                                    id="nav-contact-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#Domestic3"
                                    type="button"
                                    role="tab"
                                    aria-controls="nav-contact"
                                    aria-selected="false"
                                  >
                                    Term &amp; Conditions
                                  </button>
                                </div>
                              </nav>
                            </div>{" "}
                            <div className="d-flex justify-content-end ms-4 mt-2">
                              {poData?.selected_status === "Draft" && (
                                <Link
                                  to={`/po-edit/${id}?token=${token}`}
                                  className="d-flex align-items-center"
                                  style={{ borderColor: "#8b0203" }}
                                >
                                  <button type="button" className="purple-btn1">
                                    <svg
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="#8b0203"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25Z"
                                        fill="#8b0203"
                                      />
                                      <path
                                        d="M20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                                        fill="#8b0203"
                                      />
                                    </svg>
                                  </button>
                                </Link>
                              )}
                              {poData?.approval_logs &&
                                poData.approval_logs.length > 0 && (
                                  <button
                                    type="button"
                                    className="purple-btn2 mb-3"
                                    onClick={openModal}
                                    style={{
                                      backgroundColor:
                                        poData?.status === "approved"
                                          ? "green"
                                          : "",
                                      border: "none",
                                    }}
                                  >
                                    <span>Approval Logs</span>
                                  </button>
                                )}
                            </div>
                            {/* <div className="col-md-2 nav-item">
                              <a
                                className="nav-link"
                                href="javascript:void(0)"
                                data-bs-toggle="modal"
                                data-bs-target="#log"
                              >
                                <button
                                  className="purple-btn2"
                                  style={{
                                    backgroundColor: "green",
                                    border: "none !important",
                                  }}
                                >
                                  <span>Approval Logs</span>
                                </button>
                              </a>
                            </div> */}
                          </div>
                        </div>
                        <div className="tab-content" id="nav-tabContent">
                          <div
                            className="tab-pane fade active show"
                            id="Domestic1"
                            role="tabpanel"
                            aria-labelledby="nav-home-tab"
                            tabIndex={0}
                          >
                            <div className="card-body">
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                  <div className="col-6 ">
                                    <label>Company </label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3 text-dark">:</span>
                                      {poData.company_name}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                  <div className="col-6 ">
                                    <label>PO Type </label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3 text-dark">:</span>
                                      {poData.po_type}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                  <div className="col-6 ">
                                    <label>PO Date </label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3 text-dark">:</span>
                                      {poData.po_date
                                        ? (() => {
                                            const d = new Date(poData.po_date);
                                            const day = String(
                                              d.getDate()
                                            ).padStart(2, "0");
                                            const month = String(
                                              d.getMonth() + 1
                                            ).padStart(2, "0");
                                            const year = d.getFullYear();
                                            return `${day}-${month}-${year}`;
                                          })()
                                        : "-"}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                  <div className="col-6 ">
                                    <label>Created ON </label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3 text-dark">:</span>
                                      {poData.created_at
                                        ? (() => {
                                            const d = new Date(
                                              poData.created_at
                                            );
                                            const day = String(
                                              d.getDate()
                                            ).padStart(2, "0");
                                            const month = String(
                                              d.getMonth() + 1
                                            ).padStart(2, "0");
                                            const year = d.getFullYear();
                                            return `${day}-${month}-${year}`;
                                          })()
                                        : "-"}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                  <div className="col-6 ">
                                    <label>PO No </label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3 text-dark">:</span>
                                      {poData.po_number}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                  <div className="col-6 ">
                                    <label>Total PO Value</label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3 text-dark">:</span>
                                      {poData.total_value}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                  <div className="col-6 ">
                                    <label>Total Discount</label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3 text-dark">:</span>
                                      {poData.total_discount}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                  <div className="col-6 ">
                                    <label>Supplier</label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3 text-dark">:</span>
                                      {poData.supplier_name}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                  <div className="col-6 ">
                                    <label>Vendor GSTIN</label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3 text-dark">:</span>
                                      {poData.vendor_gstin || "-"}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                  <div className="col-6 ">
                                    <label>Branch</label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3 text-dark">:</span>
                                      {poData.branch || "-"}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                  <div className="col-6 ">
                                    <label>Unloading scope</label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3 text-dark">:</span>
                                      {poData.unloading_scope || "-"}
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between  align-items-center">
                                <h5
                                  className="mt-2 "
                                  data-bs-toggle="modal"
                                  data-bs-target="#sereneModal"
                                >
                                  Material Details
                                </h5>
                              </div>
                              <div className="tbl-container me-2 mt-3">
                                <table
                                  className="w-100"
                                  style={{ width: "100%" }}
                                >
                                  <thead>
                                    <tr>
                                      <th style={{ width: "66px !important" }}>
                                        Sr. No
                                      </th>
                                      <th>Project</th>
                                      <th>Sub-Project</th>
                                      {/* <th>MOR No.</th> */}
                                      <th>Material</th>
                                      <th>UOM</th>
                                      <th>Mor Qty</th>
                                      <th>PO Order Qty</th>
                                      <th>GRN Qty</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {poData.material_details &&
                                    poData.material_details.length > 0 ? (
                                      poData.material_details.map(
                                        (mat, idx) => (
                                          <tr key={mat.id || idx}>
                                            <td>{idx + 1}</td>
                                            <td>{mat.project_name}</td>
                                            <td>{mat.sub_project_name}</td>
                                            {/* <td>
                                              <a
                                                style={{
                                                  textDecoration:
                                                    "underline !important",
                                                }}
                                                target="_blank"
                                                href={`/material_order_requests/${mat.mor_no}?layout=true`}
                                              >
                                                {mat.mor_no}
                                              </a>
                                            </td> */}
                                            <td>{mat.material}</td>
                                            <td>{mat.uom}</td>
                                            <td>{mat.mor_qty}</td>
                                            <td>{mat.po_order_qty}</td>
                                            <td>{mat.grn_qty}</td>
                                          </tr>
                                        )
                                      )
                                    ) : (
                                      <tr>
                                        <td colSpan={9}>No material details</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="Domestic2"
                            role="tabpanel"
                            aria-labelledby="nav-profile-tab"
                            tabIndex={0}
                          >
                            <div className=" ">
                              <h5 className="mt-3 ">Rate &amp; Taxes</h5>
                            </div>
                            <div className="tbl-container me-2 mt-3">
                              <table
                                className="w-100"
                                style={{ width: "max-content !important" }}
                              >
                                <thead>
                                  <tr>
                                    <th style={{ width: "66px !important" }}>
                                      Sr. No
                                    </th>
                                    <th>Material</th>
                                    <th>UOM</th>
                                    <th>PO Qty</th>
                                    <th>Adjusted Qty</th>
                                    <th>Tolerance Qty</th>
                                    <th>Material Rate</th>
                                    <th>Material Cost</th>
                                    <th>Discount(%)</th>
                                    <th>Discount Rate</th>
                                    <th>After Discount Value</th>
                                    <th>Tax Addition</th>
                                    <th>Tax Deduction</th>
                                    <th>Total Charges</th>
                                    <th>Total Base Cost</th>
                                    <th>All Incl. Cost</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {poData.rate_and_taxes &&
                                  poData.rate_and_taxes.length > 0 ? (
                                    poData.rate_and_taxes.map((rate, idx) => (
                                      <tr key={rate.id || idx}>
                                        <td>{idx + 1}</td>
                                        <td>{rate.material}</td>
                                        <td>{rate.uom}</td>
                                        <td>{rate.po_qty ?? "-"}</td>
                                        <td>{rate.adjusted_qty}</td>
                                        <td>{rate.tolerance_qty}</td>
                                        <td>{rate.material_rate}</td>
                                        <td>{rate.material_cost}</td>
                                        <td>{rate.discount_percentage}</td>
                                        <td>{rate.discount_rate}</td>
                                        <td>{rate.after_discount_value}</td>
                                        <td>{rate.tax_addition}</td>
                                        <td>{rate.tax_deduction}</td>
                                        <td>{rate.total_charges}</td>
                                        <td>{rate.total_base_cost}</td>
                                        <td>{rate.all_inclusive_cost}</td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={16}>
                                        No rate and taxes data
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                            <div className=" ">
                              <h5 className=" mt-3">
                                Tax &amp; Charges Summary
                              </h5>
                            </div>
                            <div className="tbl-container me-2 mt-3">
                              <table
                                className="w-100"
                                style={{ width: "100%" }}
                              >
                                <thead>
                                  <tr>
                                    <th rowSpan={2}>Tax / Charge Type</th>
                                    <th colSpan={2}>Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Total Base Cost</td>
                                    <td>
                                      <span className="total_base_cost">
                                        {poData.tax_summary?.total_base_cost ??
                                          0}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Total Tax</td>
                                    <td>
                                      <span className="total_tax">
                                        {poData.tax_summary?.total_tax ?? 0}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Total Charge</td>
                                    <td>
                                      <span className="total_charge">
                                        {poData.tax_summary?.total_charge ?? 0}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="fw-bold">
                                      Total All Incl. Cost
                                    </td>
                                    <td className="fw-bold total_inclusive_cost">
                                      {poData.tax_summary
                                        ?.total_inclusive_cost ?? 0}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="mt-4">
                              <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mt-3">Charges</h5>
                              </div>

                              <div className="tbl-container me-2 mt-3">
                                <table className="w-100">
                                  <thead>
                                    <tr>
                                      <th>Charge Name</th>
                                      <th>Amount</th>
                                      <th>Realised Amount</th>
                                      <th>Taxes</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {poData.charges_with_taxes?.length > 0 ? (
                                      poData.charges_with_taxes.map(
                                        (charge) => (
                                          <tr key={charge.id}>
                                            <td>
                                              <select
                                                className="form-control form-select mySelect"
                                                disabled
                                                value={
                                                  charge.charge_name ||
                                                  charge.charge_id
                                                }
                                              >
                                                <option>
                                                  {charge.charge_name ||
                                                    `Charge #${charge.charge_id}`}
                                                </option>
                                              </select>
                                            </td>
                                            <td>
                                              <input
                                                type="number"
                                                className="form-control forname-control decimal-input"
                                                value={charge.amount}
                                                disabled
                                              />
                                            </td>
                                            <td>
                                              <input
                                                type="number"
                                                className="form-control forname-control decimal-input"
                                                value={charge.realised_amount}
                                                disabled
                                              />
                                            </td>
                                            <td>
                                              <button
                                                type="button"
                                                className="btn btn-info chargeButton"
                                                onClick={() =>
                                                  handleOpenTaxesModal(charge)
                                                }
                                              >
                                                Taxes
                                              </button>
                                            </td>
                                            <td>
                                              <button
                                                type="button"
                                                className="btn btn-link text-danger remove-cost-row"
                                                disabled
                                              >
                                                <span className="material-symbols-outlined">
                                                  cancel
                                                </span>
                                              </button>
                                            </td>
                                          </tr>
                                        )
                                      )
                                    ) : (
                                      <tr>
                                        <td colSpan={5}>
                                          No charges available
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mt-3">Other Cost</h5>
                              </div>

                              {/* {charges.length > 0 && ( */}
                              <div className="tbl-container me-2 mt-3">
                                <table className="w-100">
                                  <thead>
                                    <tr>
                                      <th>
                                        Transportation, Loading & Unloading
                                        Details
                                      </th>
                                      <th>Cost</th>
                                      <th>Scope</th>
                                      <th>Taxes</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {/* {otherCosts.map((cost) => ( */}
                                    <tr
                                    //  key={cost.id}
                                    >
                                      <td>
                                        <select
                                          className="form-control form-select mySelect"
                                          // value={cost.cost_name}
                                          // onChange={(e) =>
                                          //   handleCostChange(
                                          //     cost.id,
                                          //     "cost_name",
                                          //     e.target.value
                                          //   )
                                          // }
                                        >
                                          <option value="">Select Type</option>
                                          <option value="Transportation">
                                            Transportation
                                          </option>
                                          <option value="Loading">
                                            Loading
                                          </option>
                                          <option value="Unloading">
                                            Unloading
                                          </option>
                                        </select>
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          className="form-control forname-control decimal-input"
                                          // value={cost.amount}
                                          // onChange={(e) =>
                                          //   handleCostChange(
                                          //     cost.id,
                                          //     "amount",
                                          //     e.target.value
                                          //   )
                                          // }
                                          placeholder="Enter amount"
                                          required
                                        />
                                      </td>
                                      <td>
                                        <select
                                          className="form-control form-select mySelect"
                                          // value={cost.scope}
                                          // onChange={(e) =>
                                          //   handleCostChange(
                                          //     cost.id,
                                          //     "scope",
                                          //     e.target.value
                                          //   )
                                          // }
                                        >
                                          <option value="">Select Scope</option>
                                          <option value="By Vendor">
                                            By Vendor
                                          </option>
                                          <option value="By Marathon">
                                            By Marathon
                                          </option>
                                        </select>
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          className="btn btn-info chargeButton"
                                          onClick={() =>
                                            handleOpenTaxesModal(
                                              cost.id,
                                              "cost"
                                            )
                                          }
                                        >
                                          Add Taxes and Charges
                                        </button>
                                      </td>
                                      {/* <td>
                                          <button
                                            type="button"
                                            className="btn btn-link text-danger remove-cost-row"
                                            onClick={() => removeCost(cost.id)}
                                          >
                                            <span className="material-symbols-outlined">
                                              cancel
                                            </span>
                                          </button>
                                        </td> */}
                                    </tr>
                                    {/* ))} */}
                                  </tbody>
                                </table>
                              </div>
                              {/* )} */}
                            </div>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="Domestic3"
                            role="tabpanel"
                            aria-labelledby="nav-contact-tab"
                            tabIndex={0}
                          >
                            <div className="card-body">
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                  <div className="col-6 ">
                                    <label>Credit Period (Days) </label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3">:-</span>
                                      {poData.terms_and_conditions
                                        ?.credit_period ?? "-"}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                  <div className="col-6 ">
                                    <label>P.O Validity Period (Days) </label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3">:-</span>
                                      {poData.terms_and_conditions
                                        ?.po_validity_period ?? "-"}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                  <div className="col-6 ">
                                    <label>
                                      Advance Reminder Duration (Days){" "}
                                    </label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3">:-</span>
                                      {poData.terms_and_conditions
                                        ?.advance_reminder_duration ?? "-"}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                  <div className="col-6 ">
                                    <label>Payment Terms </label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3">:-</span>
                                      {poData.terms_and_conditions
                                        ?.payment_terms ?? "-"}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                  <div className="col-6 ">
                                    <label>Remark </label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3">:-</span>
                                      {poData.terms_and_conditions
                                        ?.payment_remarks ?? "-"}
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                  <div className="col-6 ">
                                    <label>Total PO Value </label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3">:-</span>
                                      {poData.total_value}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                  <div className="col-6 ">
                                    <label>Supplier Advance Allowed (%) </label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3">:-</span>
                                      {poData.terms_and_conditions
                                        ?.supplier_advance ?? "-"}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                  <div className="col-6 ">
                                    <label>Total Discount </label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3">:-</span>
                                      {poData.total_discount}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                  <div className="col-6 ">
                                    <label>Supplier Advance Amount </label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3">:-</span>
                                      {poData.terms_and_conditions
                                        ?.supplier_advance_amount ?? "-"}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                  <div className="col-6 ">
                                    <label>
                                      Service Certificate Advance Allowed (%){" "}
                                    </label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3">:-</span>
                                      {poData.terms_and_conditions
                                        ?.survice_certificate_advance ?? "-"}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                                  <div className="col-6 ">
                                    <label>
                                      Service Certificate Advance Amount{" "}
                                    </label>
                                  </div>
                                  <div className="col-6">
                                    <label className="text">
                                      <span className="me-3">:-</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <div className="mt-3 d-flex justify-content-between align-items-center">
                              <h5 className=" mt-3">
                                Advance Payment Schedule
                              </h5>
                            </div>
                            <div className="tbl-container me-2 mt-2">
                              <table
                                className="w-100"
                                style={{ width: "100%" }}
                              >
                                <thead>
                                  <tr>
                                    <th>Payment Date</th>
                                    <th>Payment %</th>
                                    <th>With Tax</th>
                                    <th>Payment Amount</th>
                                    <th>Remark</th>
                                  </tr>
                                </thead>
                                <tbody></tbody>
                              </table>
                            </div> */}
                            {/* <div className="mt-3 d-flex justify-content-between align-items-center">
                              <h5 className=" mt-3">Delivery Schedule</h5>
                            </div>
                            <div className="tbl-container me-2 mt-2">
                              <table
                                className="w-100"
                                style={{ width: "100%" }}
                              >
                                <thead>
                                  <tr>
                                    <th>MOR No.</th>
                                    <th>Material</th>
                                    <th>MOR Delivery Schedule</th>
                                    <th>PO Delivery Date</th>
                                    <th>Sch. Delivery Qty</th>
                                    <th>PO Delivery Qty</th>
                                    <th>Delivery Address</th>
                                    <th>Store Name</th>
                                    <th>Remarks</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {poData.delivery_schedule &&
                                  poData.delivery_schedule.length > 0 ? (
                                    poData.delivery_schedule.map(
                                      (delivery, idx) => (
                                        <tr key={delivery.id || idx}>
                                          <td>{delivery.mor_no}</td>
                                          <td>{delivery.material_name}</td>
                                          <td>
                                            {delivery.mor_delivery_schedule}
                                          </td>
                                          <td>{delivery.po_delivery_date}</td>
                                          <td>{delivery.sch_delivery_qty}</td>
                                          <td>{delivery.po_delivery_qty}</td>
                                          <td>{delivery.delivery_address}</td>
                                          <td>{delivery.store_name}</td>
                                          <td>{delivery.remarks}</td>
                                        </tr>
                                      )
                                    )
                                  ) : (
                                    <tr>
                                      <td colSpan={9}>No delivery schedule</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div> */}
                            <div className="mt-3 ">
                              <h5 className=" ">
                                General Term &amp; Conditions
                              </h5>
                            </div>
                            <div className="tbl-container me-2 mt-2">
                              <table
                                className="w-100"
                                style={{ width: "100%" }}
                              >
                                <thead>
                                  <tr>
                                    <th>Condition Category</th>
                                    <th>Condition</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {poData.resource_term_conditions &&
                                  poData.resource_term_conditions.length > 0 ? (
                                    poData.resource_term_conditions.map(
                                      (cond, idx) => (
                                        <tr key={cond.id || idx}>
                                          <td>{cond.condition_category}</td>
                                          <td>{cond.condition}</td>
                                        </tr>
                                      )
                                    )
                                  ) : (
                                    <tr>
                                      <td colSpan={2}>
                                        No general term conditions
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                            <div className="mt-3 ">
                              <h5 className=" mt-3">
                                Material Specific Term &amp; Conditions
                              </h5>
                            </div>
                            <div className="tbl-container me-2 mt-2">
                              <table
                                className="w-100"
                                style={{ width: "100%" }}
                              >
                                <thead>
                                  <tr>
                                    <th>Material Sub Type</th>
                                    <th>Condition Category</th>
                                    <th>Condition</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {poData.resource_material_term_conditions &&
                                  poData.resource_material_term_conditions
                                    .length > 0 ? (
                                    poData.resource_material_term_conditions.map(
                                      (cond, idx) => (
                                        <tr key={cond.id || idx}>
                                          <td>{cond.material_sub_type}</td>
                                          <td>{cond.condition_category}</td>
                                          <td>{cond.condition}</td>
                                        </tr>
                                      )
                                    )
                                  ) : (
                                    <tr>
                                      <td colSpan={3}>
                                        No material specific term conditions
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="Domestic4"
                            role="tabpanel"
                            aria-labelledby="nav-home-tab"
                            tabIndex={0}
                          >
                            <div className="card-body">
                              <div className="row"></div>
                            </div>
                          </div>
                          {/* /.container-fluid */}
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
                <div className=" d-flex justify-content-between align-items-center">
                  <h5 className=" mt-3">Document Attachment</h5>
                </div>
                <div className="tbl-container w-100 px-0">
                  <table className="w-100" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th
                          className="main2-th"
                          style={{ width: "66px !important" }}
                        >
                          Sr. No.
                        </th>
                        {/*
                  <th class="main2-th">Document Name</th>
                  */}
                        <th className="main2-th">File Name</th>
                        <th className="main2-th">File Type</th>
                        <th className="main2-th">Uploaded At</th>
                        <th className="main2-th">Uploaded By</th>
                        <th className="main2-th">Attachment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {poData.attachments && poData.attachments.length > 0 ? (
                        poData.attachments.map((att, idx) => (
                          <tr key={att.id || idx}>
                            <td>{idx + 1}</td>
                            <td>{att.file_name || "N/A"}</td>
                            <td>{att.file_type}</td>
                            <td>{att.uploaded_at}</td>
                            <td>{att.uploaded_by || "N/A"}</td>
                            <td>
                              <a
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Download
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6}>No attachments</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <form
                  action="/purchase_orders/813/update_status"
                  acceptCharset="UTF-8"
                  method="post"
                >
                  <input
                    type="hidden"
                    name="_method"
                    defaultValue="put"
                    autoComplete="off"
                  />
                  <input
                    type="hidden"
                    name="authenticity_token"
                    defaultValue="VpBYf0nTtanQ0LQk4QbzdPM26Y259_BkT_eAWf7Hd1-SElm7VMmi610_TWgVy1oyUnYqeg4KZH9F8jclHXZCZw"
                    autoComplete="off"
                  />
                  <div className="row px-2">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Remark</label>
                        <textarea
                          name="status_log[remarks]"
                          id="status_log_remarks"
                          className="form-control"
                          rows={3}
                          disabled="disabled"
                          defaultValue={""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row px-2">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Comments</label>
                        <textarea
                          name="status_log[comments]"
                          id="comments-field"
                          className="form-control"
                          rows={3}
                          defaultValue={""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-4 justify-content-end align-items-center">
                    <div className="col-md-3">
                      <div className="form-group d-flex gap-3 align-items-center">
                        <label className="mb-0" style={{ fontSize: "1.1rem" }}>
                          Status
                        </label>
                        <select
                          name="status_log[status]"
                          id="status-dropdown"
                          className="form-control form-select mySelect select2-hidden-accessible"
                          disabled=""
                          tabIndex={-1}
                          aria-hidden="true"
                          data-select2-id="select2-data-status-dropdown"
                        >
                          <option value="" label=" " />
                          <option
                            selected="selected"
                            value="approved"
                            data-select2-id="select2-data-674-lxm1"
                          >
                            Approved
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-2 justify-content-end">
                    <div className="col-md-2 mt-2">
                      <input
                        type="submit"
                        name="commit"
                        defaultValue="Submit"
                        className="purple-btn2 w-100"
                        id="submit_tag_button"
                        data-disable-with="Submit"
                      />
                    </div>
                    <div className="col-md-2">
                      <button
                        type="button"
                        className="purple-btn1 w-100"
                        onClick={() => navigate(-1)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>{" "}
                <div className=" d-flex justify-content-between align-items-center">
                  <h5 className=" mt-3">Audit Logs</h5>
                </div>
                <div className="tbl-container px-0">
                  <table className="w-100" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "66px !important" }}>Sr.No.</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>PO Remark</th>
                        <th>PO Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="log"
          tabIndex={-1}
          aria-labelledby="amendModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fs-5" id="exampleModalLabel">
                  Approval Log
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="row mt-2 px-2">
                  <div className="col-12 ">
                    <div className="tbl-container me-2 mt-3">
                      <table className="w-100" style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th style={{ width: "66px !important" }}>Sr.No.</th>
                            <th>Approval Level </th>
                            <th>Approved By</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Remark</th>
                            <th>Users</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>1</td>
                            <td>Abhishek Sharma</td>
                            <td>23-07-2025, 2:45 PM</td>
                            <td>
                              {" "}
                              <span
                                className="px-2 py-1 rounded text-white"
                                style={{ backgroundColor: "green" }}
                              >
                                Approved{" "}
                              </span>
                            </td>
                            <td>
                              <p></p>
                            </td>
                            <td
                              className="align-items-start"
                              style={{
                                paddingLeft: 1,
                                fontSize: 10,
                                whiteSpace: "nowrap",
                              }}
                            >
                              <ul
                                style={{
                                  paddingLeft: 1,
                                  listStyle: "none",
                                  textAlign: "left",
                                }}
                              >
                                <li style={{ fontSize: 10 }}>
                                  Abhishek Sharma
                                </li>
                              </ul>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          show={showTaxesModal}
          onHide={handleCloseTaxesModal}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Taxes and Charges</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="tax-table-header">
                  <tr>
                    <th>Tax / Charge Type</th>
                    <th>Tax / Charges per UOM (INR)</th>
                    <th>Inclusive</th>
                    <th>Amount</th>
                    <th>Action</th>
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
                        className="form-control base_cost"
                        value={chargeTaxes.baseCost}
                        readOnly
                        disabled
                      />
                    </td>
                    <td></td>
                  </tr>

                  {/* Addition Tax & Charges Section */}
                  <tr className="addition-anchor">
                    <td>Addition Tax & Charges</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm add-tax-row"
                        onClick={() => addTaxRow("addition")}
                      >
                        +
                      </button>
                    </td>
                  </tr>

                  {/* Addition Tax Rows */}
                  {chargeTaxes.additionTaxes.map((tax) => (
                    <tr key={tax.id}>
                      <td>
                        <select
                          className="form-control"
                          value={tax.taxType}
                          onChange={(e) =>
                            handleTaxChange(
                              "addition",
                              tax.id,
                              "taxType",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select Tax Type</option>
                          {chargesAdditionTaxOptions.map((taxOption) => (
                            <option key={taxOption.id} value={taxOption.id}>
                              {taxOption.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          value={tax.taxPercentage}
                          onChange={(e) =>
                            handleTaxChange(
                              "addition",
                              tax.id,
                              "taxPercentage",
                              e.target.value
                            )
                          }
                          disabled={!tax.taxType}
                        >
                          <option value="">Select Percentage</option>
                          {tax.taxType &&
                            getChargesTaxPercentages(tax.taxType).map(
                              (percentage, index) => (
                                <option key={index} value={percentage}>
                                  {percentage}%
                                </option>
                              )
                            )}
                        </select>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={tax.inclusive}
                          onChange={(e) =>
                            handleTaxChange(
                              "addition",
                              tax.id,
                              "inclusive",
                              e.target.checked
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={tax.amount}
                          disabled
                          placeholder="Auto-calculated"
                        />
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-link text-danger"
                          onClick={() => removeTaxRow("addition", tax.id)}
                        >
                          <span className="material-symbols-outlined">
                            cancel
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Deduction Tax Section */}
                  <tr className="deduction-anchor">
                    <td>Deduction Tax</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm add-tax-row"
                        onClick={() => addTaxRow("deduction")}
                      >
                        +
                      </button>
                    </td>
                  </tr>

                  {/* Deduction Tax Rows */}
                  {chargeTaxes.deductionTaxes.map((tax) => (
                    <tr key={tax.id}>
                      <td>
                        <select
                          className="form-control"
                          value={tax.taxType}
                          onChange={(e) =>
                            handleTaxChange(
                              "deduction",
                              tax.id,
                              "taxType",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select Tax Type</option>
                          {chargesDeductionTaxOptions.map((taxOption) => (
                            <option key={taxOption.id} value={taxOption.id}>
                              {taxOption.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          value={tax.taxPercentage}
                          onChange={(e) =>
                            handleTaxChange(
                              "deduction",
                              tax.id,
                              "taxPercentage",
                              e.target.value
                            )
                          }
                          disabled={!tax.taxType}
                        >
                          <option value="">Select Percentage</option>
                          {tax.taxType &&
                            getChargesTaxPercentages(tax.taxType).map(
                              (percentage, index) => (
                                <option key={index} value={percentage}>
                                  {percentage}%
                                </option>
                              )
                            )}
                        </select>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={tax.inclusive}
                          onChange={(e) =>
                            handleTaxChange(
                              "deduction",
                              tax.id,
                              "inclusive",
                              e.target.checked
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={tax.amount}
                          disabled
                          placeholder="Auto-calculated"
                        />
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-link text-danger"
                          onClick={() => removeTaxRow("deduction", tax.id)}
                        >
                          <span className="material-symbols-outlined">
                            cancel
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td>Net Cost</td>
                    <td></td>
                    <td></td>
                    <td className="text-center">
                      <input
                        type="text"
                        className="form-control net-cost"
                        value={chargeTaxes.netCost}
                        readOnly
                        disabled
                      />
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <button
              type="button"
              className=" purple-btn1"
              onClick={handleCloseTaxesModal}
            >
              Close
            </button>
            <button
              type="button"
              className="purple-btn2"
              onClick={handleSaveTaxes}
            >
              Save
            </button>
          </Modal.Footer>
        </Modal>
        {/* Dynamic tab content will be inserted here */}
      </div>
    </div>
  );
};

export default PoDetails;
