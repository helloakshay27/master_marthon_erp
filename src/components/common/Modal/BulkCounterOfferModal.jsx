import React from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";

export default function BulkCounterOfferModal({ show, handleClose }) {
  const renderProductRows = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <tr key={index}>
        <td>
          <input type="checkbox" />
        </td>
        <th scope="row">
          Wooden Frd Door{" "}
          <span style={{ color: "var(--red)", cursor: "pointer" }}>
            Details
          </span>
        </th>
        <td>257 Nos</td>
        <td />
        <td />
        <td />
        <td />
        <td>Sanvo Resorts Pvt. Ltd.</td>
        <td>
          <input type="file" />
        </td>
        <td />
        <td />
        <td />
        <td />
        <td />
        <td>
          <input type="file" />
        </td>
        <td>WOODEN DOOR SHUTTER 2 HRS.</td>
        <td>Main door Outer size of ...</td>
      </tr>
    ));
  };

  const renderFreightDetails = () => (
    <table className="w-100">
      <tbody>
        <tr>
          <th>Freight Charge Amount</th>
          <th scope="col">210000.00</th>
        </tr>
        <tr>
          <td>GST on Freight</td>
          <th scope="row">18</th>
        </tr>
        <tr>
          <td>Realised Freight Amount</td>
          <th scope="row">5 YEARS</th>
        </tr>
        <tr>
          <td>Payment Term</td>
          <th scope="row">90% - 10%</th>
        </tr>
        <tr>
          <td>Loading / Unloading Clause</td>
          <th scope="row">IN OUR SCOPE</th>
        </tr>
      </tbody>
    </table>
  );

  return (
    <DynamicModalBox
      show={show}
      onHide={handleClose}
      title="Bulk Counter Offer"
      size="xl"
      footerButtons={[
        {
          label: "Save",
          onClick: handleClose,
          props: { className: "purple-btn2" },
        },
      ]}
    >
      <h5 className="mt-5">Product Sheet</h5>
      <div className="tbl-container">
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th />
              <th scope="col">Product*</th>
              <th scope="col">Quantity Requested*</th>
              <th scope="col">Quantity Available</th>
              <th scope="col">Best Total Amount</th>
              <th scope="col">Price*</th>
              <th scope="col">Total Amount*</th>
              <th scope="col">Delivery location*</th>
              <th scope="col">Creator Attachment</th>
              <th scope="col">Discount</th>
              <th scope="col">Realised Discount*</th>
              <th scope="col">GST*</th>
              <th scope="col">Realised GST</th>
              <th scope="col">Landed Amount*</th>
              <th scope="col">DOOR FRAME MATERIAL</th>
              <th scope="col">Participant Attachment</th>
              <th scope="col">Product Variant*</th>
              <th scope="col">ADDITIONAL INFO</th>
              <th scope="col">DENSITY OF WOOD</th>
              <th scope="col">MOISTURE OF WOOD</th>
            </tr>
          </thead>
          <tbody>{renderProductRows()}</tbody>
        </table>
      </div>

      <div className="tbl-container mt-3">{renderFreightDetails()}</div>

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
