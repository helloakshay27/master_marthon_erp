import React from "react";
import { Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SingleSelector from "../components/base/Select/SingleSelector";
import { baseURL } from "../confi/apiDomain";
import { useNavigate } from "react-router-dom";

// Then use id in your API URL

const BillEntryDetails = () => {
  const [billDetails, setBillDetails] = useState(null);
  const { id } = useParams();
  const [status, setStatus] = useState(""); // A
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const statusOptions = [
    {
      label: "Select Status",
      value: "",
    },
    {
      label: "Open",
      value: "open",
    },
    // {
    //   label: "Verified",
    //   value: "verified",
    // },
    // {
    //   label: "All",
    //   value: "all",
    // },
    {
      label: "Submited",
      value: "submited",
    },
    // {
    //   label: "Proceed",
    //   value: "proceed",
    // },
    // {
    //   label: "Approved",
    //   value: "approved",
    // },
  ];

  const handleStatusChange = (selectedOption) => {
    // setStatus(e.target.value);
    setStatus(selectedOption.value);
    // handleStatusChange(selectedOption); // Handle status change
  };

  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        const response = await axios.get(
          `https://marathon.lockated.com/bill_entries/${id}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        setBillDetails(response.data);
        console.log("API Bill Entry Data:", response.data); // <-- Console log full API response
      } catch (error) {
        console.error("Failed to fetch bill entry details", error);
      }
    };
    fetchBillDetails();
  }, [id]);

  const handleUpdateBillEntry = async () => {
    try {
      setLoading(true);
      const payload = {
        bill_entry: {
          status: status || "",
        },
      };

      const response = await axios.patch(
        `${baseURL}bill_entries/${id}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        payload
      );

      if (response.data) {
        alert("Bill entry updated successfully");
        // Make sure to import navigate from react-router-dom
        navigate("/bill-entry-list");
      } else {
        throw new Error("No response data received");
      }
    } catch (error) {
      console.error("Error updating bill entry:", error);
      alert("Failed to update bill entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid px-3 mt-2">
          <a href="">
            Home &gt; Security &gt; Bill Entry List &gt; Bill Information (For
            Billing User)
          </a>
          <h5 className="mt-3">Bill Information (For Billing User)</h5>
          <div className="row my-4 align-items-center">
            <div className="col-md-12 ">
              <div className="card p-3">
                <div className="details_page">
                  <div className="row px-3 ">
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Vendor Name</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.pms_supplier || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>PO Number</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.po_number || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Bill Number</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.bill_no || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Bill Date</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.bill_date || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Bill Amount</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.bill_amount || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Vendor Remark</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.vendor_remark || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Remark</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.remark || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Comments</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:-</span>
                          {billDetails?.comments || "-"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-4 justify-content-end align-items-center mx-2">
                <div className="col-md-3">
                  <div className="form-group d-flex gap-3 align-items-center mx-3">
                    <label style={{ fontSize: "0.95rem", color: "black" }}>
                      Status
                    </label>
                    <SingleSelector
                      options={statusOptions}
                      onChange={handleStatusChange}
                      value={statusOptions.find(
                        (option) => option.value === status
                      )} // Set "Draft" as the selected status
                      placeholder="Select Status"
                      // isClearable={false}
                      // isDisabled={true} // Disable the selector
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-2 justify-content-end">
                <div className="col-md-2">
                  <button
                    className="purple-btn2 w-100"
                    onClick={handleUpdateBillEntry}
                  >
                    Submit
                  </button>
                </div>
                <div className="col-md-2">
                  <button className="purple-btn1 w-100">Cancel</button>
                </div>
              </div>

              <h5 className=" mt-3">Audit Log</h5>
              <div className="mx-0">
                <Table columns={auditLogColumns} data={auditLogData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillEntryDetails;
