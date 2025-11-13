import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { baseURL } from "../confi/apiDomain";
import FormatDate from "../components/FormatDate";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MaterialRejctionSlipCreate = () => {
     const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const { id } = useParams();
  const [submitting, setSubmitting] = useState(false); // For loading state during API call
  const navigate = useNavigate();
  

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${baseURL}/mor_rejection_slips/${id}.json?token=${token}`
  //       );
  //       const fetchedData = response.data;
  //       setData(fetchedData);

  //       // Setting default values based on API response
  //       if (fetchedData.status) {
  //         setDecision(fetchedData.status); // 'accepted' or 'rejected'
  //         if (fetchedData.status === "rejected") {
  //           setReason(fetchedData.rejection_reason || ""); // Set rejection reason if exists
  //         } else if (fetchedData.status === "accepted") {
  //           setReason(fetchedData.acceptance_reason || ""); // Set acceptance reason if exists
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching rejection slip data:", error);
  //       setError("Failed to fetch data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (id) {
  //     fetchData();
  //   }
  // }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/mor_rejection_slips/${id}.json?token=${token}`
        );
        const fetchedData = response.data;
        setData(fetchedData);

        if (fetchedData.status) {
          setDecision(fetchedData.status); // 'accepted' or 'rejected'
        }

        // Set both rejection and acceptance reasons if available
        if (fetchedData.rejection_reason) {
          setReason(fetchedData.rejection_reason);
        }
        if (fetchedData.acceptance_reason) {
          setReason(fetchedData.acceptance_reason);
        }

        // Disable Submit if status is already accepted/rejected
        if (
          fetchedData.status === "accepted" ||
          fetchedData.status === "rejected"
        ) {
          setSubmitting(true); // Disable submit button
        }
      } catch (error) {
        console.error("Error fetching rejection slip data:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);

    if (decision !== "accepted" && decision !== "rejected") {
      toast.error("Please select either 'Accept' or 'Reject' before submitting.");
      setLoading(false);
      return;
    }

    // Validation: If rejecting, reason must be provided
    if (decision === "rejected" && reason.trim() === "") {
      toast.error("Rejection reason is required.");
      setLoading(false);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        status: decision,
        rejection_reason: decision === "rejected" ? reason : "",
        acceptance_reason: decision === "accepted" ? reason : "",
      };

      // const token = "${token}"; // Add token if required
      const response = await axios.put(
        `${baseURL}/mor_rejection_slips/${id}.json?token=${token}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update successful:", response.data);
      toast.success("Status updated successfully!", { autoClose: 1200 });
      setReason("");
      navigate(`/material-rejection-slip?token=${token}`);
    } catch (error) {
      console.error("Error updating rejection slip:", error);
      let errorMessage = "Failed to update status. Please try again.";
      const resp = error?.response;
      if (resp?.data) {
        const data = resp.data;
        if (typeof data === "string") {
          errorMessage = data;
        } else if (Array.isArray(data)) {
          errorMessage = data.filter(Boolean).join(", ");
        } else if (typeof data === "object") {
          if (typeof data.error === "string") {
            errorMessage = data.error;
          } else if (Array.isArray(data.error)) {
            errorMessage = data.error.filter(Boolean).join(", ");
          } else if (Array.isArray(data.errors)) {
            errorMessage = data.errors.filter(Boolean).join(", ");
          } else if (data.errors && typeof data.errors === "object") {
            try {
              const collected = Object.values(data.errors)
                .flat()
                .filter(Boolean)
                .join(", ");
              if (collected) errorMessage = collected;
            } catch (_) {}
          } else if (Array.isArray(data.full_messages)) {
            errorMessage = data.full_messages.filter(Boolean).join(", ");
          } else if (data.message) {
            errorMessage = data.message;
          }
        }
      }
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Navigate to the new route when cancel is clicked
    navigate(`/material-rejection-slip?token=${token}`);
  };

  // if (loading) return <p>Loading...</p>;
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

              <div className="card-body">
                <div className="row px-3 mt-3">
                  <div className="col-lg-6 col-md-6 row px-3">
                    <div className="col-6">
                      <label>Company</label>
                    </div>
                    <div className="col-6">
                      <span style={{ color: "#8b0203" }}>: {data.company}</span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 row px-3">
                    <div className="col-6">
                      <label>Project</label>
                    </div>
                    <div className="col-6">
                      <span style={{ color: "#8b0203" }}>: {data.project}</span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 row px-3">
                    <div className="col-6">
                      <label>Sub-Project</label>
                    </div>
                    <div className="col-6">
                      <span style={{ color: "#8b0203" }}>
                        : {data.sub_project}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 row px-3">
                    <div className="col-6">
                      <label>Rejection Slip No</label>
                    </div>
                    <div className="col-6">
                      <span style={{ color: "#8b0203" }}>
                        : {data.rejection_slip_number}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 row px-3">
                    <div className="col-6">
                      <label>Rejection Date</label>
                    </div>
                    <div className="col-6">
                      {/* <span>:{data.rejection_date}</span> */}
                      <span style={{ color: "#8b0203" }}>
                        :{" "}
                        {new Date(data.rejection_date).toLocaleDateString(
                          "en-GB"
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 row px-3">
                    <div className="col-6">
                      <label>Supplier</label>
                    </div>
                    <div className="col-6">
                      <span style={{ color: "#8b0203" }}>
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
                      <span style={{ color: "#8b0203" }}>
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
                      {/* <span>
                        :{" "}
                        {data.rejection_materials[0]?.grn_material
                          ?.good_receive_note?.po_date || "N/A"}
                      </span> */}

                      <span style={{ color: "#8b0203" }}>
                        :{" "}
                        {data.rejection_materials[0]?.grn_material
                          ?.good_receive_note?.po_date
                          ? new Date(
                              data.rejection_materials[0].grn_material.good_receive_note.po_date
                            ).toLocaleDateString("en-GB")
                          : "N/A"}
                      </span>
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
                            <th>Material Description</th>
                            {/* <th>
                              Material Description<htd></htd>
                            </th> */}
                            <th>UOM</th>
                            <th>GRN Date</th>
                            <th>Received Qty</th>
                            <th>Defective Qty</th>
                            <th>Accepted Qty</th>
                            <th>Defective Reason</th>
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
                                  {/* {item.grn_material.good_receive_note
                                    .grn_date || "N/A"} */}
                                  <FormatDate
                                    timestamp={
                                      item.grn_material.good_receive_note
                                        .grn_date || "N/A"
                                    }
                                  />
                                </td>
                                <td>{item.grn_material.received}</td>
                                <td>{item.grn_material.defective}</td>
                                <td>{item.grn_material.accepted}</td>
                                <td>{item.grn_material.defective_reason}</td>
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

                    {/* <div className="row mt-3 justify-content-between align-items-end">
                      <h5 className="col-md-3"> Document Attachment</h5>
                    </div> */}
                    {/* <div className="tbl-container  mt-2">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>Sr.No.</th>
                            <th>Document Name</th>
                            {/* <th>
                              Material Description<htd></htd>
                            </th> */}
                    {/* <th>File Name</th>
                            <th>File Type</th>
                            <th>Upload Date</th>
                            <th>Action</th> */}
                    {/* <th>Accepted Qty</th> */}
                    {/* </tr>
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
                                <td> */}
                    {/* {item.grn_material.good_receive_note
                                    .grn_date || "N/A"} */}
                    {/* <FormatDate
                                    timestamp={
                                      item.grn_material.good_receive_note
                                        .grn_date || "N/A"
                                    }
                                  />
                                </td> */}
                    {/* <td>{item.grn_material.received}</td>
                                <td>{item.grn_material.defective}</td>
                                <td>{item.grn_material.accepted}</td>
                              </tr>
                            ))
                          ) : ( */}
                    {/* <tr>
                              <td colSpan="7" className="text-center">
                                No materials found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table> */}
                    {/* </div>  */}
                    <div className="row mt-3">
                      {/* Radio Buttons */}
                      <div className="col-md-12">
                        <div className="form-group d-flex align-items-center">
                          <label className="me-3">
                            Select Decision:
                            <span className="ms-1" color="#8b0203">
                              *
                            </span>
                          </label>

                          <div className="form-check me-3">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="accept"
                              name="decision"
                              value="accepted"
                              checked={decision === "accepted"}
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
                            {/* <input
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
                            </label> */}
                            <input
                              type="radio"
                              className="form-check-input"
                              id="reject"
                              name="decision"
                              value="rejected"
                              checked={decision === "rejected"}
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
                      {/* Reason for Rejection */}
                      {decision === "rejected" && (
                        <div className="col-md-6">
                          <div className="form-group mt-2">
                            <label>
                              Reason for Rejection
                              <span className="ms-1" color="#8b0203">
                                *
                              </span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Enter rejection reason"
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {/* Reason for Acceptance */}
                      {decision === "accepted" && (
                        <div className="col-md-6">
                          <div className="form-group mt-2">
                            <label>Reason for Acceptance</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Enter acceptance reason"
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {/* Show both reasons if available */}
                    </div>
                  </div>
                  {/* /.col */}
                </div>

                {/* /.row */}
                {/* /.row */}
              </div>

              <div className="row mt-2 justify-content-end">
                {/* <div className="col-md-2">
                  <button className="purple-btn2 w-100">Print</button>
                </div> */}

                <div className="col-md-2">
                  <div style={{ textAlign: "center" }}>
                    {loading && (
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
                        <p>Submitting ...</p>
                      </div>
                    )}
                    <button
                      // className="purple-btn2 w-100"
                      className={`purple-btn2 mt-2 w-100 ${
                        submitting ? "disabled-btn" : ""
                      }`}
                      onClick={handleSubmit}
                      // disabled={submitting}
                      disabled={submitting} // Disable when status is accepted/rejected
                    >
                      Submit
                    </button>
                  </div>
                </div>
                <div className="col-md-2" >
                  <button className="purple-btn1 w-100 " onClick={handleCancel}>
                    Cancel
                  </button>
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
      <ToastContainer position="top-right" autoClose={1200} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </main>
  );
};

export default MaterialRejctionSlipCreate;
