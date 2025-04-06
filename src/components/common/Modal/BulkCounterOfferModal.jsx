// @ts-nocheck
import React, { useState, useEffect } from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import Table from "../../base/Table/Table";
import ShortTable from "../../base/Table/ShortTable";
import { baseURL } from "../../../confi/apiDomain";

export default function BulkCounterOfferModal({
  show,
  handleClose,
  bidCounterData,
}) {
  const [formData, setFormData] = useState({});
  const [sumTotal, setSumTotal] = useState(0);
  const [loading, setLoading] = useState(false); // Add loading state
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

  const eventId = bidCounterData?.event?.id;
  const bidId = bidCounterData?.bid_materials?.map((item) => item?.bid_id)?.[0];

  const handleSubmit = async () => {
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

  console.log("formData", formData);

  // Dynamically generate productTableColumns based on extra_columns
  const extraColumns = formData?.bid_materials?.[0]?.extra_columns || [];
  const dynamicColumns = extraColumns.map((col) => ({
    label: col.replace(/_/g, " ").toUpperCase(),
    key: col,
  }));

  const productTableColumns = [
    { label: "Sr no.*", key: "SrNo" },
    { label: "Material*", key: "product" },
    { label: "Quantity Requested*", key: "quantityRequested" },
    { label: "Quantity Available", key: "quantityAvailable" },
    { label: "Price*", key: "price" },
    { label: "Delivery location*", key: "deliveryLocation" },
    { label: "Creator Attachment", key: "creatorAttachment" },
    { label: "Discount", key: "discount" },
    { label: "Realised Discount*", key: "realisedDiscount" },
    { label: "GST*", key: "gst" },
    { label: "Realised GST", key: "realisedGst" },
    { label: "Participant Attachment", key: "participantAttachment" },
    { label: "Vendor Remark*", key: "vendorRemark" },
    { label: "Landed Amount*", key: "landedAmount" },
    { label: "Total Amount*", key: "totalAmount" },
    { label: "Brand", key: "pmsBrand" },
    { label: "Colour", key: "pmsColour" },
    { label: "Generic Info", key: "genericInfo" },

    ...dynamicColumns, // Add dynamic columns
  ];

  // Update productTableData to include dynamic column data
  const productTableData =
    formData?.bid_materials?.map((item, index) => {
      const productName = item.material_name || "_";

      const quantityRequested = (
        <input
          type="number"
          className="form-control"
          value={item.quantity_requested}
          style={{ width: "auto" }}
          onChange={(e) =>
            handleMaterialInputChange(e, "quantity_requested", index)
          }
          disabled
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
          onChange={(e) => handleMaterialInputChange(e, "pms_brand_name", index)}
          readOnly
        />
      );
      const pmsColour = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.pms_colour_name || "_"}
          onChange={(e) => handleMaterialInputChange(e, "pms_colour_name", index)}
          readOnly
        />
      );
      const genericInfo = (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={item.event_material?.generic_info_name || "_"}
          onChange={(e) => handleMaterialInputChange(e, "generic_info_name", index)}
          readOnly
        />
      );

      // Map dynamic extra columns using extra_data
      const extraColumnData = {};
      extraColumns.forEach((col) => {
        const extraData = item.event_material?.extra_data?.[col] || {};
        extraColumnData[col] = (
          <input
            type="text"
            className="form-control"
            style={{ width: "auto" }}
            value={extraData.value || "N/A"}
            onChange={(e) =>
              handleMaterialInputChange(e, col, index)
            }
            disabled={extraData.readonly}
          />
        );
      });

      return {
        Sno: index + 1,
        product: <span>{productName}</span>,
        quantityRequested,
        quantityAvailable,
        price,
        discount,
        realisedDiscount,
        gst,
        realisedGst,
        vendorRemark,
        totalAmount,
        pmsBrand, // Ensure these fields are included
        pmsColour,
        genericInfo,
        ...extraColumnData, // Include dynamic column data
      };
    }) || [];

  const freightData = [
    {
      label: "Freight Charge",
      value: (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={formData?.freight_charge_amount || ""}
          onChange={(e) => handleInputChange(e, "freight_charge_amount")}
        />
      ),
    },
    {
      label: "GST on Freight",
      value: (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={formData?.gst_on_freight || ""}
          onChange={(e) => handleInputChange(e, "gst_on_freight")}
        />
      ),
    },
    {
      label: "Realised Freight ",
      value: (
        <input
          type="number"
          className="form-control"
          style={{ width: "auto" }}
          value={formData?.realised_freight_charge_amount}
          disabled
        />
      ),
    },
    {
      label: "Warranty Clause",
      value: (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={formData?.warranty_clause || ""}
          onChange={(e) => handleInputChange(e, "warranty_clause")}
        />
      ),
    },
    {
      label: "Payment Terms",
      value: (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={formData?.payment_terms || ""}
          onChange={(e) => handleInputChange(e, "payment_terms")}
        />
      ),
    },
    {
      label: "Loading / Unloading",
      value: (
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          value={formData?.loading_unloading_clause || ""}
          onChange={(e) => handleInputChange(e, "loading_unloading_clause")}
        />
      ),
    },
  ];

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
      <h5 className="mt-5">Product Sheet</h5>
      <Table columns={productTableColumns} data={productTableData} />

      <div className="d-flex justify-content-end">
        <ShortTable data={freightData} />
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
