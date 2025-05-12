import React from "react";
import { Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// Then use id in your API URL

const BillEntryDetails = () => {
  const [billDetails, setBillDetails] = useState(null);
  const { id } = useParams();

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
              <div className="d-flex justify-content-end align-items-center gap-3 mt-2">
                <p className="mb-0">Assigned To user</p>
                <select
                  className="form-select purple-btn2"
                  style={{ width: "150px" }}
                  // value={formData.status || "draft"}
                  // onChange={(e) =>
                  //   setFormData((prev) => ({
                  //     ...prev,
                  //     status: e.target.value,
                  //   }))
                  // }
                >
                  <option value="draft">Draft</option>
                  <option value="verified">Verified</option>
                  <option value="approved">Approved</option>
                  <option value="submitted">Submitted</option>
                  <option value="proceed">Proceed</option>
                </select>
              </div>
              <div className="d-flex justify-content-end align-items-center">
                <p className="mb-0">Status</p>
                <select
                  className="form-select purple-btn2"
                  style={{ width: "150px" }}
                  // value={formData.status || "draft"}
                  // onChange={(e) =>
                  //   setFormData((prev) => ({
                  //     ...prev,
                  //     status: e.target.value,
                  //   }))
                  // }
                >
                  {/* <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                > */}
                  <option value="draft">Draft</option>
                  <option value="verified">Verified</option>
                  <option value="approved">Approved</option>
                  <option value="submitted">Submitted</option>
                  <option value="proceed">Proceed</option>
                </select>
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
