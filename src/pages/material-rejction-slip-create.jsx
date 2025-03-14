import React, { useState, useEffect } from "react";
import axios from "axios";

const MaterialRejctionSlipCreate = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decision, setDecision] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://marathon.lockated.com/mor_rejection_slips/1.json"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching rejection slip data:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!data) return null;
  return (
    <main className="h-100 w-100">
      <div className="main-content">
        {/* sidebar ends above */}
        {/* webpage conteaint start */}
        <div className="website-content overflow-auto">
          <div className="module-data-section p-3">
            <div
              className="card card-default mt-5 p-2b-4"
              id="mor-material-slip"
            >
              <div class="card-header3">
                <h3 class="card-title">Material Slip</h3>
              </div>
              {/* <div class="card-body mt-0 pt-0">
                <div class="row px-3 mt-3">
                  <div class="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div class="col-6">
                      <label>Company</label>
                    </div>
                    <div class="col-6">
                      <label class="text">
                        <span class="me-3">:</span>
                        Sanvo Resorts Pvt Ltd
                      </label>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div class="col-6">
                      <label>Project </label>
                    </div>
                    <div class="col-6">
                      <label class="text">
                        <span class="me-3">:</span>
                        Marathon Nexzone
                      </label>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div class="col-6">
                      <label>Sub-Project </label>
                    </div>
                    <div class="col-6">
                      <label class="text">
                        <span class="me-3">:</span>
                        Antilia
                      </label>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div class="col-6">
                      <label>Store</label>
                    </div>
                    <div class="col-6">
                      <label class="text">
                        <span class="me-3">:</span>
                        Antilia
                      </label>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div class="col-6">
                      <label>Issue Slip No</label>
                    </div>
                    <div class="col-6">
                      <label class="text">
                        <span class="me-3">:</span>
                        ISSUE/213/03/2025
                      </label>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div class="col-6">
                      <label>Requisition Date</label>
                    </div>
                    <div class="col-6">
                      <label class="text">
                        <span class="me-3">:</span>
                        12/03/2025
                      </label>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div class="col-6">
                      <label>Activity</label>
                    </div>
                    <div class="col-6">
                      <label class="text">
                        <span class="me-3">:</span>
                        CIVIL WORK
                      </label>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div class="col-6">
                      <label>Supplier Name</label>
                    </div>
                    <div class="col-6">
                      <label class="text">
                        <span class="me-3">:</span>
                        CIVIL WORK
                      </label>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div class="col-6">
                      <label>Po No</label>
                    </div>
                    <div class="col-6">
                      <label class="text">
                        <span class="me-3">:</span>
                        54165146
                      </label>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div class="col-6">
                      <label>Po Date</label>
                    </div>
                    <div class="col-6">
                      <label class="text">
                        <span class="me-3">:</span>
                        08-03-2024
                      </label>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div class="col-6">
                      <label>Remark</label>
                    </div>
                    <div class="col-6">
                      <label class="text">
                        <span class="me-3">:</span>
                        Rejected
                      </label>
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="card-body">
                <div className="row px-3 mt-3">
                  <div className="col-lg-6 col-md-6 row px-3">
                    <div className="col-6">
                      <label>Company</label>
                    </div>
                    <div className="col-6">
                      <span>: {data.company}</span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 row px-3">
                    <div className="col-6">
                      <label>Project</label>
                    </div>
                    <div className="col-6">
                      <span>: {data.project}</span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 row px-3">
                    <div className="col-6">
                      <label>Sub-Project</label>
                    </div>
                    <div className="col-6">
                      <span>: {data.sub_project}</span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 row px-3">
                    <div className="col-6">
                      <label>Rejection Slip No</label>
                    </div>
                    <div className="col-6">
                      <span>: {data.rejection_slip_number}</span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 row px-3">
                    <div className="col-6">
                      <label>Rejection Date</label>
                    </div>
                    <div className="col-6">
                      <span>: {data.rejection_date}</span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 row px-3">
                    <div className="col-6">
                      <label>Supplier</label>
                    </div>
                    <div className="col-6">
                      <span>
                        :{" "}
                        {data.rejection_materials[0]?.grn_material
                          ?.good_receive_note?.supplier || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 row px-3">
                    <div className="col-6">
                      <label>PO No</label>
                    </div>
                    <div className="col-6">
                      <span>
                        :{" "}
                        {data.rejection_materials[0]?.grn_material
                          ?.good_receive_note?.po_number || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 row px-3">
                    <div className="col-6">
                      <label>PO Date</label>
                    </div>
                    <div className="col-6">
                      <span>
                        :{" "}
                        {data.rejection_materials[0]?.grn_material
                          ?.good_receive_note?.po_date || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 row px-3">
                    <div className="col-6">
                      <label>Rejection Reason</label>
                    </div>
                    <div className="col-6">
                      <span>: {data.rejection_reason}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="card card-default  mx-4 px-3"
                id="mor-material-details"
              >
                <div className="card-body mt-0 mb-2">
                  <div className="row">
                    <div className="row mt-2 justify-content-between align-items-end">
                      <h5 className="col-md-3"> Material Details</h5>
                    </div>
                    <div className="tbl-container  mt-2">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>Sr.No.</th>
                            <th>Material Type</th>
                            {/* <th>
                              Material Description<htd></htd>
                            </th> */}
                            <th>UOM</th>
                            <th>GRN Date</th>
                            <th>Received Qty</th>
                            <th>Defective Qty</th>
                            <th>Accepted Qty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.rejection_materials.length > 0 ? (
                            data.rejection_materials.map((item, index) => (
                              <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>
                                  {item.grn_material.material_type || "N/A"}
                                </td>
                                <td>{item.grn_material.uom || "N/A"}</td>
                                <td>
                                  {item.grn_material.good_receive_note
                                    .grn_date || "N/A"}
                                </td>
                                <td>{item.grn_material.received}</td>
                                <td>{item.grn_material.defective}</td>
                                <td>{item.grn_material.accepted}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center">
                                No materials found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="row mt-3">
                      {/* Radio Buttons */}
                      <div className="col-md-12">
                        <div className="form-group d-flex align-items-center">
                          <label className="me-3">Select Decision:</label>
                          <div className="form-check me-3">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="accept"
                              name="decision"
                              value="accept"
                              checked={decision === "accept"}
                              onChange={(e) => setDecision(e.target.value)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="accept"
                            >
                              Accept
                            </label>
                          </div>

                          <div className="form-check">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="reject"
                              name="decision"
                              value="reject"
                              checked={decision === "reject"}
                              onChange={(e) => setDecision(e.target.value)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="reject"
                            >
                              Reject
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Reason for Rejection */}
                      {decision === "reject" && (
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Reason for Rejection</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Enter reason"
                            />
                          </div>
                        </div>
                      )}

                      {/* Reason for Acceptance */}
                      {decision === "accept" && (
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Reason for Acceptance</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Enter reason"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* /.col */}
                </div>
                {/* /.row */}
                {/* /.row */}
              </div>
              <div className="d-flex justify-content-end align-items-center gap-3 mt-2">
                <p className="mb-0">Status</p>
                <select
                  className="form-select purple-btn2"
                  style={{ width: "150px" }}
                >
                  <option value="draft">PO Draft</option>
                  <option value="accept">Accept</option>
                  <option value="reject">Reject</option>
                  <option value="submit">Submit</option>
                </select>
              </div>

              <div className="row mt-2 justify-content-end">
                {/* <div className="col-md-2">
                  <button className="purple-btn2 w-100">Print</button>
                </div> */}
                <div className="col-md-2">
                  <button className="purple-btn2 w-100">Submit</button>
                </div>
                <div className="col-md-2">
                  <button className="purple-btn1 w-100">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <footer className="footer">
          <p className="">
            Powered by <img src="./images/go-logo.JPG" />
          </p>
        </footer> */}
      </div>
    </main>
  );
};

export default MaterialRejctionSlipCreate;
