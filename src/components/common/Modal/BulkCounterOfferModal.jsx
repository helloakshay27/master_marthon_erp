// @ts-nocheck
import React, { useState, useEffect } from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import Table from "../../base/Table/Table";
import { baseURL } from "../../../confi/apiDomain";
import { toast, ToastContainer } from "react-toastify"; // Import toast for toaster messages
import axios from "axios"; // Import axios for API calls
import SelectBox from "../../base/Select/SelectBox"; // Import SelectBox for dropdowns

export default function BulkCounterOfferModal({
  show,
  handleClose,
  bidCounterData,
}) {
  const [formData, setFormData] = useState({});
  const [sumTotal, setSumTotal] = useState(0);
  const [loading, setLoading] = useState(false); // Add loading state
  const [freightData, setFreightData] = useState([]);
  const [extraFields, setExtraFields] = useState({});
  const [showTaxModal, setShowTaxModal] = useState(false); // State for tax modal visibility
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(null); // Track selected material index
  const [taxRateData, setTaxRateData] = useState([]); // State for tax rate data
  const [taxOptions, setTaxOptions] = useState([]); // State for tax options
  const [deductionTaxOptions, setDeductionTaxOptions] = useState([]); // State for deduction tax options
  const [shortTableData, setShortTableData] = useState({});

  const excludedShortTableFields = ["remark", "Payment Terms", "Warranty Clause", "Loading/Unloading"];
  
  useEffect(() => {
    if (bidCounterData) {
      setFormData(bidCounterData);
      const initialSumTotal = bidCounterData.bid_materials.reduce(
        (acc, item) => acc + (parseFloat(item.total_amount) || 0),
        0
      );
      setSumTotal(initialSumTotal);
    }
  }, [bidCounterData]); // Ensure this effect only runs when bidCounterData changes

  useEffect(() => {
    if (bidCounterData?.applied_event_template?.applied_bid_template_fields) {
      const fields =
        bidCounterData.applied_event_template.applied_bid_template_fields.map(
          (field) => ({
            label: field.field_name,
            value: { firstBid: "", counterBid: "" },
          })
        );
      setFreightData(fields);
    }
  }, [bidCounterData]);

  useEffect(() => {
    const initialData = formData?.bid_materials?.reduce((acc, item, index) => {
      acc[index] = Object.entries(item.extra_data || {}).reduce(
        (innerAcc, [key, { value }]) => {
          if (!Array.isArray(value)) {
            innerAcc[key] = value;
          }
          return innerAcc;
        },
        {}
      );
      return acc;
    }, {});
    setExtraFields(initialData || {});
  }, [formData?.bid_materials]);

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

  const eventId = bidCounterData?.event?.id;
  const bidId = bidCounterData?.bid_materials?.map((item) => item?.bid_id)?.[0];

  const handleSubmit = async () => {
    const extractShortTableData = freightData.reduce((acc, curr) => {
      const { counterBid, firstBid } = curr.value;
      acc[curr.label] = counterBid || firstBid || ""; // Use updated values from freightData
      return acc;
    }, {});

    // Merge shortTableData into extractShortTableData
    Object.entries(shortTableData).forEach(([key, value]) => {
      extractShortTableData[key] = value || ""; // Ensure the value is included in the payload
    });

    const extractedExtraData = formData.bid_materials.reduce((acc, item) => {
      if (item.extra_data) {
        Object.entries(item.extra_data).forEach(([key, { value }]) => {
          acc[key] = value; // Extract only the `value` property
        });
      }
      return acc;
    }, {});

    setLoading(true);
    // formData
    const payload = {
      counter_bid: {
        event_vendor_id: formData.event_vendor_id,
        price: formData.price,
        discount: formData.discount,
        freight_charge_amount: formData.freight_charge_amount,
        gst_on_freight: formData.gst_on_freight,
        realised_freight_charge_amount: formData.realised_freight_charge_amount,
        gross_total: formData.gross_total,
        counter_bid_materials_attributes: formData.bid_materials.map((item) => {
          const { extra_data, ...rest } = item; // Destructure to exclude shortTable values
          // return {
          //   ...rest,
          //   bid_material_id: item.id,
          // };
          return{
              event_material_id: item.event_material_id,
              bid_material_id: item.id,
              quantity_available: item.quantity_available,
              price: item.price,
              discount: item.discount,
              total_amount: item.total_amount,
              realised_discount: item.realised_discount,
              gst: item.gst,
              realised_gst: item.realised_gst,
              vendor_remark: item.vendor_remark,
              bid_material_tax_details:item.bid_material_tax_details,
              ...extractedExtraData,
            }
        }),
        ...extractShortTableData, 
        remark: formData.remark || "", 
      },
    };
    
    try {
      const response = await fetch(
        `${baseURL}rfq/events/${eventId}/bids/${bidId}/counter_bids?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        handleClose(); // Close the modal if the request was successful
        toast.success("Counter bid submitted successfully!"); // Display success message
      } else {
        // Handle failure if the response wasn't OK
        throw new Error("Failed to submit counter bid");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      // Handle error if the request fails
      alert("There was an error submitting the counter bid. Please try again.");
    } finally {
      setLoading(false); // Always set loading to false after the request completes
    }
  };

  const handleMaterialInputChange = (e, field, index) => {
    const value = e.target.value;
    const updatedMaterials = [...formData.bid_materials];
    if (field === "quantity_available") {
      const quantityRequested =
        parseFloat(updatedMaterials[index].quantity_requested) || 0;
      if (parseFloat(value) > quantityRequested) {
        toast.error("Quantity available cannot exceed quantity requested."); // Display toaster message
        return;
      }
    }

    updatedMaterials[index][field] = value;

    const price = parseFloat(updatedMaterials[index].price) || 0;
    const quantityAvail =
      parseFloat(updatedMaterials[index].quantity_available) || 0;
    const discount = parseFloat(updatedMaterials[index].discount) || 0;
    const gst = parseFloat(updatedMaterials[index].gst) || 0;

    const total = price * quantityAvail;

    const realisedDiscount = (total * discount) / 100;

    const landedAmount = total - realisedDiscount;
    let realisedGst = 0;
    if (gst > 0) {
      realisedGst = (landedAmount * gst) / 100;
    }

    const finalTotal = landedAmount + realisedGst;

    updatedMaterials[index].realised_discount = realisedDiscount.toFixed(2);
    updatedMaterials[index].landed_amount = landedAmount.toFixed(2);
    updatedMaterials[index].realised_gst = realisedGst.toFixed(2);
    updatedMaterials[index].total_amount = finalTotal.toFixed(2);

    setSumTotal(
      updatedMaterials.reduce(
        (acc, item) => acc + (parseFloat(item.total_amount) || 0),
        0
      )
    );

    setFormData({
      ...formData,
      bid_materials: updatedMaterials,
    });
  };

  useEffect(() => {
    // Initialize shortTableData with default values from formData.extra_data
    const initialShortTableData = Object.entries(formData.extra_data || {}).reduce(
      (acc, [key, { value }]) => {
        acc[key] = value || ""; // Use the default value from formData.extra_data
        return acc;
      },
      {}
    );
    setShortTableData(initialShortTableData);
  }, [formData.extra_data]);

  useEffect(() => {
    if (formData?.bid_materials) {
      const updatedMaterials = formData.bid_materials.map((item) => {
        const price = parseFloat(item.price) || 0;
        const quantityAvail = parseFloat(item.quantity_available) || 0;
        const discount = parseFloat(item.discount) || 0;
        const gst = parseFloat(item.gst) || 0;

        const total = price * quantityAvail;

        const realisedDiscount = (total * discount) / 100;

        const landedAmount = total - realisedDiscount;
        let realisedGst = 0;
        if (gst > 0) {
          realisedGst = (landedAmount * gst) / 100;
        }

        const finalTotal = landedAmount + realisedGst;

        return {
          ...item,
          realised_discount: realisedDiscount.toFixed(2),
          landed_amount: landedAmount.toFixed(2),
          realised_gst: realisedGst.toFixed(2),
          total_amount: finalTotal.toFixed(2),
        };
      });

      const newSumTotal = updatedMaterials.reduce(
        (acc, item) => acc + (parseFloat(item.total_amount) || 0),
        0
      );

      if (newSumTotal !== sumTotal) {
        setSumTotal(newSumTotal); // Only update sumTotal if it has changed
      }

      setFormData((prev) => ({
        ...prev,
        bid_materials: updatedMaterials,
      }));
    }
  }, [formData?.bid_materials]); // Ensure this effect only runs when formData.bid_materials changes

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    const updatedFormData = { ...formData, [field]: value };

    if (field === "freight_charge_amount" || field === "gst_on_freight") {
      const freightCharge =
        parseFloat(updatedFormData.freight_charge_amount) || 0;
      const gstOnFreight = parseFloat(updatedFormData.gst_on_freight) || 0;
      updatedFormData.realised_freight_charge_amount =
        freightCharge + (freightCharge * gstOnFreight) / 100;
    }

    const sumTotal = formData.bid_materials.reduce(
      (acc, item) => acc + (parseFloat(item.total_amount) || 0),
      0
    );
    const totalSum =
      sumTotal + (updatedFormData.realised_freight_charge_amount || 0);

    setFormData(updatedFormData);
    setSumTotal(totalSum);
  };

  const handleFreightDataChange = (updatedData) => {
    setFreightData(updatedData);
  };

  const handleExtraDataChange = (index, key, newValue) => {
    setShortTableData((prev) => ({
      ...prev,
      [key]: newValue, // Store updated values in shortTableData
    }));
  
    // Update extraFields for UI rendering, but do not modify formData.bid_materials
    setExtraFields((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [key]: newValue,
      },
    }));

    // const updatedMaterials = [...formData.bid_materials];
    // if (!updatedMaterials[index].extra_data) {
    //   updatedMaterials[index].extra_data = {};
    // }
    // updatedMaterials[index].extra_data[key] = {
    //   value: newValue === "" ? null : newValue,
    // }; // Store null for cleared values

    // setFormData({
    //   ...formData,
    //   bid_materials: updatedMaterials,
    // });
  };

  const handleOpenTaxModal = (index) => {
    setSelectedMaterialIndex(index);
    setShowTaxModal(true);
  };

  const handleCloseTaxModal = () => {
    setShowTaxModal(false);
  };

  const handleSaveTaxChanges = () => {
    setShowTaxModal(false);
  };

  const handleTaxChargeChange = (rowIndex, id, field, value, type) => {
    const updatedTaxRateData = [...taxRateData];
    const targetRow = updatedTaxRateData[rowIndex];

    if (!targetRow) return;

    const taxCharges =
      type === "addition"
        ? [...targetRow.additionTaxCharges]
        : [...targetRow.deductionTax];

    const chargeIndex = taxCharges.findIndex((item) => item.id === id);
    if (chargeIndex === -1) return;

    const charge = { ...taxCharges[chargeIndex] };
    charge[field] = value;
    taxCharges[chargeIndex] = charge;

    if (type === "addition") {
      targetRow.additionTaxCharges = taxCharges;
    } else {
      targetRow.deductionTax = taxCharges;
    }

    updatedTaxRateData[rowIndex] = targetRow;
    setTaxRateData(updatedTaxRateData);
  };

  const addAdditionTaxCharge = (rowIndex) => {
    const newItem = {
      id: Date.now().toString(),
      taxChargeType: "",
      taxChargePerUom: "",
      inclusive: false,
      amount: "",
    };

    const updatedTaxRateData = [...formData.bid_materials];
    if (!updatedTaxRateData[rowIndex].addition_bid_material_tax_details) {
      updatedTaxRateData[rowIndex].addition_bid_material_tax_details = [];
    }
    updatedTaxRateData[rowIndex].addition_bid_material_tax_details.push(newItem);

    setFormData({
      ...formData,
      bid_materials: updatedTaxRateData,
    });
  };

  const addDeductionTax = (rowIndex) => {
    const newItem = {
      id: Date.now().toString(),
      taxChargeType: "",
      taxChargePerUom: "",
      inclusive: false,
      amount: "",
    };

    const updatedTaxRateData = [...taxRateData];
    updatedTaxRateData[rowIndex].deductionTax.push(newItem);
    setTaxRateData(updatedTaxRateData);
  };

  const removeTaxChargeItem = (rowIndex, id, type) => {
    const updatedTaxRateData = [...taxRateData];
    if (type === "addition") {
      updatedTaxRateData[rowIndex].addition_bid_material_tax_details = updatedTaxRateData[
        rowIndex
      ].addition_bid_material_tax_details.filter((item) => item.id !== id);
    } else {
      updatedTaxRateData[rowIndex].deductionTax = updatedTaxRateData[
        rowIndex
      ].deductionTax.filter((item) => item.id !== id);
    }
    setTaxRateData(updatedTaxRateData);
  };

  const productTableColumns = [
    { label: "Sr no.", key: "SrNo" },
    { label: "Material Name", key: "product" },
    { label: "Material Type", key: "materialType" },
    { label: "Material Sub Type", key: "materialSubType" },
    { label: "Delivery Location", key: "deliveryLocation" },
    { label: "Quantity Requested", key: "quantityRequested" },
    { label: "Brand", key: "pmsBrand" },
    { label: "Colour", key: "pmsColour" },
    { label: "Generic Info", key: "genericInfo" },
    { label: "Quantity Available", key: "quantityAvailable" },
    { label: "Price", key: "price" },
    { label: "Discount", key: "discount" },
    { label: "Realised Discount", key: "realisedDiscount" },
    { label: "Landed Amount", key: "landedAmount" },
    { label: "Total Amount", key: "totalAmount" },
    { label: "Vendor Remark", key: "vendorRemark" },
    { label: "Tax Rate", key: "taxRate" },
    ...Object.entries(formData?.bid_materials?.[0]?.extra_data || {})
      .filter(([_, { value }]) => !Array.isArray(value)) // Exclude array-type values
      .map(([key]) => ({
        label: key.replace(/_/g, " ").toUpperCase(),
        key,
      })),
  ];

  const productTableData =
    formData?.bid_materials?.map((item, index) => {
      const handleInputChange = (e, field) => {
        const value = e.target.value;
        handleMaterialInputChange(e, field, index);
      };

      const productName = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.material_name || "_"}
          readOnly
          disabled
        />
      );
      const landedAmount = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item?.landed_amount || "_"}
          readOnly
          disabled
        />
      );

      const materialType = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.material_type || "_"}
          readOnly
          disabled
        />
      );

      const materialSubType = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.inventory_sub_type || "_"}
          readOnly
          disabled
        />
      );

      const deliveryLocation = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.location || "_"}
          readOnly
          disabled
        />
      );

      const quantityRequested = (
        <input
          type="number"
          className="form-control"
          value={item.quantity_requested}
          style={{ width: "auto" }}
          readOnly
          disabled
        />
      );

      const quantityAvailable = (
        <input
          type="number"
          className="form-control"
          value={item.quantity_available}
          style={{ width: "auto" }}
          onChange={(e) => {
            const value = parseFloat(e.target.value) || 0;
            const quantityRequested = parseFloat(item.quantity_requested) || 0;

            if (value > quantityRequested) {
              toast.error(
                "Quantity available cannot exceed quantity requested."
              );
              return;
            }

            handleMaterialInputChange(e, "quantity_available", index);
          }}
        />
      );

      const price = (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={item.price}
          onChange={(e) => handleMaterialInputChange(e, "price", index)}
        />
      );

      const totalAmount = (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={item.total_amount}
          readOnly
          disabled={true}
        />
      );

      const discount = (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={item.discount}
          onChange={(e) => handleInputChange(e, "discount")}
        />
      );

      const realisedDiscount = (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={item.realised_discount}
          readOnly
          disabled
        />
      );

      const gst = (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={item.gst}
          onChange={(e) => handleInputChange(e, "gst")}
        />
      );

      const realisedGst = (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={item.realised_gst}
          readOnly
          disabled
        />
      );

      const vendorRemark = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.vendor_remark}
          onChange={(e) => handleInputChange(e, "vendor_remark")}
          
        />
      );

      const pmsBrand = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.pms_brand_name || "_"}
          readOnly
          disabled
        />
      );

      const pmsColour = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.pms_colour_name || "_"}
          readOnly
          disabled
        />
      );

      const genericInfo = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.generic_info_name || "_"}
          readOnly
          disabled
        />
      );

      const taxRate = (
        <button
          className="purple-btn2"
          onClick={() => handleOpenTaxModal(index)}
        >
          Select
        </button>
      );
      const extraColumnData = Object.entries(item.extra_data || {}).reduce(
        (acc, [key, { value, readonly }]) => {
          acc[key] = (
            <input
              type="text"
              className="form-control"
              style={{ width: "auto" }}
              value={extraFields[index]?.[key] ?? value ?? ""}
              onChange={(e) =>
                handleExtraDataChange(index, key, e.target.value)
              }
              readOnly={readonly}
              disabled={readonly}
            />
          );
          return acc;
        },
        {}
      );

      return {
        Sno: index + 1,
        product: <span>{productName}</span>,
        materialType,
        materialSubType,
        deliveryLocation,
        quantityRequested,
        quantityAvailable,
        price,
        discount,
        realisedDiscount,
        gst,
        realisedGst,
        vendorRemark,
        totalAmount,
        pmsBrand,
        landedAmount,
        pmsColour,
        genericInfo,
        taxRate,
        ...extraColumnData,
      };
    }) || [];

    

  return (
    <>
      <DynamicModalBox
        show={show}
        onHide={handleClose}
        title="Counter Offer"
        size="xl"
        footerButtons={[
          {
            label: loading ? (
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
            ) : (
              "Save"
            ),
            onClick: handleSubmit,
            props: { className: "purple-btn2", disabled: loading }, // Disable button when loading
          },
        ]}
      >
        <h5 className="mt-5">Material Sheet</h5>
        <Table columns={productTableColumns} data={productTableData} />
        {/* {console.log("formData:-------",formData)} */}
        <div className="d-flex justify-content-end">
          <table
            className="tbl-container mt-4 ShortTable"
            style={{ width: "40% !important" }}
          >
            <tbody>
              {Object.keys(formData.extra_data || {}).map((key, index) => {
                const label = key.replace(/_/g, " ").toUpperCase();
                const value =
                  shortTableData[key] || formData.extra_data[key]?.value || "";

                return (
                  <tr
                    key={index}
                    style={{ borderBottom: "1px solid #ddd", color: "#fff" }}
                  >
                    <td
                      style={{
                        padding: "12px",
                        fontWeight: "bold",
                        background: "#8b0203",
                      }}
                    >
                      {label}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: "#000",
                        textAlign: "left",
                      }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        value={shortTableData?.[key] || ""}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          handleExtraDataChange(0, key, newValue);
                        }}
                        style={{ backgroundColor: "#fff", color: "#000" }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end">
          <h4>Sum Total : ₹{sumTotal}</h4>
        </div>

        <div className="form-group">
          <label htmlFor="counterOfferRemarks">Counter Offer Remarks</label>
          <input
            className="form-control"
            placeholder="Enter your remarks here"
            type="text"
            id="counterOfferRemarks"
          />
        </div>
      </DynamicModalBox>

      <DynamicModalBox
        show={showTaxModal}
        onHide={handleCloseTaxModal}
        size="lg"
        title="View Tax & Rate"
        footerButtons={[
          {
            label: "Close",
            onClick: handleCloseTaxModal,
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
                    formData?.bid_materials?.[selectedMaterialIndex]
                      ?.material_name || ""
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
                    formData?.bid_materials?.[selectedMaterialIndex]
                      ?.event_material?.inventory_id || ""
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
                    formData?.bid_materials?.[selectedMaterialIndex]?.price ||
                    ""
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
                    formData?.bid_materials?.[selectedMaterialIndex]
                      ?.quantity_available || ""
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
                    formData?.bid_materials?.[selectedMaterialIndex]
                      ?.discount || ""
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
                    formData?.bid_materials?.[selectedMaterialIndex]
                      ?.total_amount || ""
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
                            formData?.bid_materials?.[selectedMaterialIndex]
                              ?.total_amount || ""
                          }
                          readOnly
                        />
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Addition Tax & Charges</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    {formData?.bid_materials?.[
                      selectedMaterialIndex
                    ]?.addition_bid_material_tax_details?.map((item, rowIndex) => (
                      <tr key={`${rowIndex}-${item.id}`}>
                        <td>
                          <SelectBox
                            options={taxOptions}
                            defaultValue={item.taxChargeType ||
                              taxOptions.find((option) => option.id === item.resource_id)?.value }
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
                            value={item.taxChargePerUom}
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
                            onChange={(e) => {
                              const baseAmount =
                                parseFloat(
                                  formData?.bid_materials?.[
                                    selectedMaterialIndex
                                  ]?.total_amount
                                ) || 0;
                              const percentage =
                                parseFloat(e.target.value) || 0;
                              const calculatedAmount = item.inclusive
                                ? baseAmount * (percentage / (100 + percentage))
                                : baseAmount * (percentage / 100);

                              handleTaxChargeChange(
                                selectedMaterialIndex,
                                item.id,
                                "amount",
                                calculatedAmount.toFixed(2),
                                "addition"
                              );
                            }}
                            readOnly
                            disabled={true}
                          />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td>Deduction Tax</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    {formData?.bid_materials?.[
                      selectedMaterialIndex
                    ]?.deduction_bid_material_tax_details?.map((item, rowIndex) => (
                      <>
                        <tr key={item.id}>
                          <td>
                            <SelectBox
                              options={deductionTaxOptions}
                              defaultValue={item.taxChargeType || deductionTaxOptions.find((option) => option.id == item.resource_id).value}
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
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </DynamicModalBox>
      <ToastContainer></ToastContainer>
    </>
  );
}
