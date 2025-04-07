// @ts-nocheck
import React, { useState, useEffect } from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import Table from "../../base/Table/Table";
import ShortDataTable from "../../base/Table/ShortDataTable"; // Use ShortDataTable instead of ShortTable
import { baseURL } from "../../../confi/apiDomain";
import { toast } from "react-toastify"; // Import toast for toaster messages

export default function BulkCounterOfferModal({
  show,
  handleClose,
  bidCounterData,
}) {
  const [formData, setFormData] = useState({});
  const [sumTotal, setSumTotal] = useState(0);
  const [loading, setLoading] = useState(false); // Add loading state
  const [freightData, setFreightData] = useState([]);
  console.log("bidCounterData", bidCounterData);
  

  useEffect(() => {
    if (bidCounterData) {
      setFormData(bidCounterData);
      const initialSumTotal = bidCounterData.bid_materials.reduce(
        (acc, item) => acc + (parseFloat(item.total_amount) || 0),
        0
      );
      setSumTotal(initialSumTotal);
    }
  }, [bidCounterData]);

  useEffect(() => {
    if (bidCounterData?.applied_event_template?.applied_bid_template_fields) {
      const fields = bidCounterData.applied_event_template.applied_bid_template_fields.map(
        (field) => ({
          label: field.field_name,
          value: { firstBid: "", counterBid: "" },
        })
      );
      setFreightData(fields);
    }
  }, [bidCounterData]);

  const eventId = bidCounterData?.event?.id;
  const bidId = bidCounterData?.bid_materials?.map((item) => item?.bid_id)?.[0];

  

  const handleSubmit = async () => {
    const extractShortTableData = freightData.reduce((acc, curr) => {
      const { firstBid, counterBid } = curr.value;
      acc[curr.label] = counterBid || firstBid;
      return acc;
  }, {});
    setLoading(true); // Set
    const payload = {
      counter_bid: {
        event_vendor_id: formData.event_vendor_id,
        price: formData.price,
        discount: formData.discount,
        freight_charge_amount: formData.freight_charge_amount,
        gst_on_freight: formData.gst_on_freight,
        realised_freight_charge_amount: formData.realised_freight_charge_amount,
        gross_total: formData.gross_total,
        warranty_clause: formData.warranty_clause,
        payment_terms: formData.payment_terms,
        loading_unloading_clause: formData.loading_unloading_clause,
        counter_bid_materials_attributes: formData.bid_materials.map(
          (item) => ({
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
          })
        ),
        ...extractShortTableData
      },
    };

    console.log("Payload to be sent:", payload);    
    
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
      const quantityRequested = parseFloat(updatedMaterials[index].quantity_requested) || 0;
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
        (acc, item) => acc + parseFloat(item.total_amount),
        0
      )
    );

    setFormData({
      ...formData,
      bid_materials: updatedMaterials,
    });
  };

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

  console.log("formData", formData);

  // Dynamically generate productTableColumns and data using extra_data
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
    { label: "Participant Attachment", key: "participantAttachment" },
    { label: "Vendor Remark", key: "vendorRemark" },
    ...Object.entries(formData?.bid_materials?.[0]?.extra_data || {})
      .filter(([_, { value }]) => !Array.isArray(value)) // Exclude array-type values
      .map(([key]) => ({
        label: key.replace(/_/g, " ").toUpperCase(),
        key,
      })),
  ];

  const productTableData =
    formData?.bid_materials?.map((item, index) => {
      const productName = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.material_name || "_"}
          readOnly
          disabled={true}
        />
      );

      const materialType = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.material_type || "_"}
          readOnly
          disabled={true}
        />
      );

      const materialSubType = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.inventory_sub_type || "_"}
          readOnly
          disabled={true}
        />
      );

      const deliveryLocation = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.location || "_"}
          readOnly
          disabled={true}
        />
      );

      const quantityRequested = (
        <input
          type="number"
          className="form-control"
          value={item.quantity_requested}
          style={{ width: "auto" }}
          disabled={true}
          readOnly
        />
      );

      const quantityAvailable = (
        <input
          type="number"
          className="form-control"
          value={item.quantity_available}
          style={{ width: "auto" }}
          onChange={(e) =>
            handleMaterialInputChange(e, "quantity_available", index)
          }
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
        />
      );

      const discount = (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={item.discount}
          onChange={(e) => handleMaterialInputChange(e, "discount", index)}
        />
      );

      const realisedDiscount = (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={item.realised_discount}
          disabled
        />
      );

      const gst = (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={item.gst}
          onChange={(e) => handleMaterialInputChange(e, "gst", index)}
        />
      );

      const realisedGst = (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={item.realised_gst}
          disabled
        />
      );

      const vendorRemark = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.vendor_remark}
          onChange={(e) => handleMaterialInputChange(e, "vendor_remark", index)}
        />
      );

      const pmsBrand = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.pms_brand_name || "_"}
          readOnly
          disabled={true}
        />
      );

      const pmsColour = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.pms_colour_name || "_"}
          readOnly
          disabled={true} 
        />
      );

      const genericInfo = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.generic_info_name || "_"}
          readOnly
          disabled={true}
        />
      );

      const extraColumnData = Object.entries(item.extra_data || {})
        .filter(([_, { value }]) => !Array.isArray(value)) // Exclude array-type values
        .reduce((acc, [key, { value, readonly }]) => {
          acc[key] = (
            <input
              type="text"
              className="form-control"
              style={{ width: "auto" }}
              value={value || "N/A"}
              readOnly={readonly}
            />
          );
          return acc;
        }, {});

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
        pmsColour,
        genericInfo,
        ...extraColumnData,
      };
    }) || [];

  return (
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

      <div className="d-flex justify-content-end">
        <ShortDataTable
          data={freightData}
          editable={true}
          onValueChange={handleFreightDataChange}
        />
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
  );
}
