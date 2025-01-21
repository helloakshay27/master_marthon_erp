// @ts-nocheck
import React, { useState, useEffect } from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import Table from "../../base/Table/Table";
import ShortTable from "../../base/Table/ShortTable";
import { productTableColumns } from "../../../constant/data";
import { useParams } from "react-router-dom";

export default function BulkCounterOfferModalTwo({
  show,
  handleClose,
  bidCounterData,
}) {
  const [formData, setFormData] = useState({});
  const [sumTotal, setSumTotal] = useState(0);
  const { id } = useParams();
  console.log("idddd", id);

  // console.log("gormmm data", formData);
  useEffect(() => {
    if (bidCounterData && Array.isArray(bidCounterData.event_materials)) {
      const eventMaterial = bidCounterData.event_materials[0]; // Access the first event material
      if (Array.isArray(eventMaterial.bid_materials)) {
        setFormData(bidCounterData);

        // Calculate initial sum total of all bid materials, ensuring valid total_amount values
        const initialSumTotal = eventMaterial.bid_materials.reduce(
          (acc, item) => {
            const totalAmount = parseFloat(item.total_amount);
            return acc + (isNaN(totalAmount) ? 0 : totalAmount); // If NaN, add 0 instead
          },
          0
        );

        setSumTotal();
      } else {
        console.error(
          "bid_materials is undefined or not an array",
          eventMaterial
        );
        setSumTotal(0);
      }
    } else {
      console.error(
        "bidCounterData.event_materials is undefined or not an array",
        bidCounterData
      );
      setSumTotal(0);
    }
  }, [bidCounterData]);

  // const eventId = bidCounterData?.event?.id;
  // const bidId = bidCounterData?.bid_materials?.map((item) => item?.bid_id)?.[0];

  // const eventId = bidCounterData?.event?.id || "N/A";

  const eventId = Array.isArray(bidCounterData?.event_materials)
    ? bidCounterData.event_materials[0]?.id || "N/A"
    : "N/A";

  const bidId = Array.isArray(bidCounterData?.event_materials)
    ? bidCounterData.event_materials[0]?.bid_materials?.[0]?.bid_id || "N/A"
    : "N/A";

  // console.log("eventId:", eventId, "bidId:", bidId);

  // const handleSubmit = async () => {
  //   const payload = {
  //     // counter_bid: {
  //     //   event_vendor_id: formData.event_vendor_id,
  //     //   price: formData.price,
  //     //   discount: formData.discount,
  //     //   freight_charge_amount: formData.freight_charge_amount,
  //     //   gst_on_freight: formData.gst_on_freight,
  //     //   realised_freight_charge_amount: formData.realised_freight_charge_amount,
  //     //   gross_total: formData.gross_total,
  //     //   warranty_clause: formData.warranty_clause,
  //     //   payment_terms: formData.payment_terms,
  //     //   loading_unloading_clause: formData.loading_unloading_clause,
  //     //   counter_bid_materials_attributes: formData.event_materials.map(
  //     //     (item) => ({
  //     //       event_material_id: "",
  //     //       bid_material_id: "",
  //     //       quantity_available: item.quantity,
  //     //       price: item.price,
  //     //       discount: item.discount,
  //     //       total_amount: item.total_amount,
  //     //       realised_discount: item.realised_discount,
  //     //       gst: item.gst,
  //     //       realised_gst: item.realised_gst,
  //     //       vendor_remark: item.vendor_remark,
  //     //     })
  //     //   ),
  //     // },

  //     counter_bid: {
  //       event_vendor_id: 7398,
  //       price: 500,
  //       discount: 5,
  //       freight_charge_amount: freight_charge_amount,
  //       gst_on_freight: gst_on_freight,
  //       realised_freight_charge_amount: formData.realised_freight_charge_amount,
  //       gross_total: formData.sumTotal,
  //       warranty_clause: formData.warranty_clause,
  //       payment_terms: formData.payment_terms,
  //       loading_unloading_clause: formData.loading_unloading_clause,
  //       counter_bid_materials_attributes: [
  //         {
  //           event_material_id: 40,
  //           bid_material_id: 52,
  //           quantity_available: 50,
  //           price: 250.0,
  //           discount: 5.0,
  //           total_amount: 237.5,
  //           realised_discount: 10,
  //           gst: 18,
  //           realised_gst: 122,
  //           vendor_remark: "sdjkgckjhchvjkh",
  //         },
  //       ],
  //     },
  //   };

  //   const response = await fetch(
  //     `https://vendors.lockated.com/rfq/events/${eventId}/bids/bulk_counter_offer?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     }
  //   );

  //   console.log("mmmmmmm", response);
  //   if (response.ok) {
  //     alert("counter bid succesfully");
  //     handleClose();
  //   } else {
  //     console.error("Failed to submit counter bid");
  //   }
  // };

  const handleSubmit = async () => {
    const counterBidMaterialsAttributes = formData?.event_materials?.map(
      (item) => ({
        event_material_id: item.id,
        bid_material_id: item.bid_materials?.[0]?.bid_id || null,
        quantity_available: parseFloat(item.quantity_available) || 0,
        price: parseFloat(item.price) || 0,
        discount: parseFloat(item.discount) || 0,
        total_amount: parseFloat(item.total_amount) || 0,
        realised_discount: parseFloat(item.realised_discount) || 0,
        gst: parseFloat(item.gst) || 0,
        realised_gst: parseFloat(item.realised_gst) || 0,
        vendor_remark: item.vendor_remark || "",
      })
    );

    const payload = {
      counter_bid: {
        event_vendor_id: formData?.event_vendor_id || null,
        price: parseFloat(formData.price) || 0,
        discount: parseFloat(formData.discount) || 0,
        freight_charge_amount: parseFloat(formData.freight_charge_amount) || 0,
        gst_on_freight: parseFloat(formData.gst_on_freight) || 0,
        realised_freight_charge_amount:
          parseFloat(formData.realised_freight_charge_amount) || 0,
        gross_total: sumTotal || 0,
        warranty_clause: formData.warranty_clause || "",
        payment_terms: formData.payment_terms || "",
        loading_unloading_clause: formData.loading_unloading_clause || "",
        counter_bid_materials_attributes: counterBidMaterialsAttributes,
      },
    };

    try {
      const response = await fetch(
        `https://vendors.lockated.com/rfq/events/${id}/bids/bulk_counter_offer?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Counter bid submitted successfully!");
        handleClose();
      } else {
        console.error("Failed to submit counter bid", await response.text());
      }
    } catch (error) {
      console.error("Error while submitting counter bid", error);
    }
  };

  const handleMaterialInputChange = (e, field, index) => {
    const value = e.target.value;
    const updatedMaterials = [...formData.event_materials];
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
        (acc, item) => acc + parseFloat(item.total_amount || 0),
        0
      )
    );

    setFormData({
      ...formData,
      event_materials: updatedMaterials,
    });
  };

  // const handleInputChange = (e, field) => {
  //   const value = e.target.value;
  //   const updatedFormData = { ...formData, [field]: value };

  //   // Calculate Realised Freight Charge (ensure it's always a number)
  //   if (field === "freight_charge_amount" || field === "gst_on_freight") {
  //     const freightCharge =
  //       parseFloat(updatedFormData.freight_charge_amount) || 0;
  //     const gstOnFreight = parseFloat(updatedFormData.gst_on_freight) || 0;

  //     updatedFormData.realised_freight_charge_amount = (
  //       freightCharge +
  //       (freightCharge * gstOnFreight) / 100
  //     ).toFixed(2); // Ensures the result is a string formatted to 2 decimal places
  //   }

  //   // Calculate Total Sum
  //   const sumTotal = formData.event_materials?.reduce(
  //     (acc, item) => acc + (parseFloat(item.total_amount) || 0),
  //     0
  //   );
  //   const totalSum =
  //     sumTotal +
  //     parseFloat(updatedFormData.realised_freight_charge_amount || 0);

  //   // Update State
  //   setFormData(updatedFormData);
  //   setSumTotal(totalSum);
  // };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    const updatedFormData = { ...formData, [field]: value };

    if (field === "freight_charge_amount" || field === "gst_on_freight") {
      const freightCharge =
        parseFloat(updatedFormData.freight_charge_amount) || 0;
      const gstOnFreight = parseFloat(updatedFormData.gst_on_freight) || 0;

      // Calculate realised freight charge
      const realisedFreight =
        freightCharge + (freightCharge * gstOnFreight) / 100;

      // Format as string for storage
      updatedFormData.realised_freight_charge_amount = realisedFreight;
    }

    const sumTotal = formData.event_materials?.reduce(
      (acc, item) => acc + (parseFloat(item.total_amount) || 0),
      0
    );

    const totalSum =
      sumTotal +
      parseFloat(updatedFormData.realised_freight_charge_amount || 0);

    setFormData(updatedFormData);
    setSumTotal(totalSum);

    console.log("Updated Form Data:", updatedFormData);
  };

  const productTableData =
    bidCounterData?.event_materials?.map((eventMaterial, eventIndex) => ({
      Sno: eventIndex + 1,
      product: <span>{eventMaterial.inventory_name || "_"}</span>,
      quantityRequested: (
        <input
          type="number"
          className="form-control"
          value={eventMaterial.quantity || ""}
          style={{ width: "auto" }}
          disabled
        />
      ),
      quantityAvailable: (
        <input
          type="number"
          className="form-control"
          value={eventMaterial.quantity_available || ""}
          style={{ width: "auto" }}
          onChange={(e) =>
            handleMaterialInputChange(e, "quantity_available", eventIndex)
          }
        />
      ),
      bestTotalAmount: eventMaterial.best_total_amount || "_",
      price: (
        <input
          type="number"
          className="form-control"
          value={eventMaterial.price || ""}
          style={{ width: "auto" }}
          onChange={(e) => handleMaterialInputChange(e, "price", eventIndex)}
        />
      ),
      totalAmount: (
        <input
          type="number"
          className="form-control"
          value={eventMaterial.total_amount || ""}
          style={{ width: "auto" }}
          readOnly
        />
      ),
      discount: (
        <input
          type="number"
          className="form-control"
          value={eventMaterial.discount || ""}
          style={{ width: "auto" }}
          onChange={(e) => handleMaterialInputChange(e, "discount", eventIndex)}
        />
      ),
      realisedDiscount: (
        <input
          type="number"
          className="form-control"
          value={eventMaterial.realised_discount || ""}
          style={{ width: "auto" }}
          disabled
        />
      ),
      gst: (
        <input
          type="number"
          className="form-control"
          value={eventMaterial.gst || ""}
          style={{ width: "auto" }}
          onChange={(e) => handleMaterialInputChange(e, "gst", eventIndex)}
        />
      ),
      realisedGst: (
        <input
          type="number"
          className="form-control"
          value={eventMaterial.realised_gst || ""}
          style={{ width: "auto" }}
          disabled
        />
      ),
      landedAmount: eventMaterial.landed_amount || "_",
      vendorRemark: (
        <input
          type="text"
          className="form-control"
          value={eventMaterial.vendor_remark || ""}
          style={{ width: "auto" }}
          onChange={(e) =>
            handleMaterialInputChange(e, "vendor_remark", eventIndex)
          }
        />
      ),
      deliveryLocation: bidCounterData?.event?.delivary_location || "N/A",
    })) || [];

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
          onChange={(e) => handleInputChange(e, "gst_on_freight")}
        />
      ),
    },
    {
      label: "Realised Freights",
      value: (
        <input
          type="text"
          class="form-control"
          value={formData?.realised_freight_charge_amount || 0}
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

  // console.log("Product Table Data:", productTableData);

  return (
    <DynamicModalBox
      show={show}
      onHide={handleClose}
      title="Counter Offer"
      size="xl"
      footerButtons={[
        {
          label: "Save",
          onClick: handleSubmit,
          props: { className: "purple-btn2" },
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
