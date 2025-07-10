import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import SingleSelector from "../components/base/Select/SingleSelector";
import { baseURL } from "../confi/apiDomain";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import { DownloadIcon } from "../components";

const GatePassDetails = () => {
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminComment, setAdminComment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState({
    value: "",
    label: "Select Status",
  });
  const [statusList, setStatusList] = useState([]);
  const [isStatusDisabled, setIsStatusDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (id) {
      axios
        .get(`${baseURL}gate_passes/${id}.json?token=${token}`)
        .then((response) => {
          setDetails(response.data);
          if (response.data.status_list) {
            const statusOptions = response.data.status_list.map((status) => ({
              value: status.toLowerCase(),
              label: status,
            }));
            setStatusList(statusOptions);
            if (response.data.selected_status) {
              setSelectedStatus({
                value: response.data.selected_status.toLowerCase(),
                label: response.data.selected_status,
              });
            }
            setIsStatusDisabled(response.data.disabled || false);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch data");
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError("ID not provided.");
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        status_log: {
          status: selectedStatus?.value || "draft",
          remarks: adminComment,
        },
      };

      const response = await axios.patch(
        `${baseURL}gate_passes/${id}/update_status.json?token=${token}`,
        payload
      );

      console.log("Status update successful:", response.data);
      alert("Status updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status. Please try again.");
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!details) return <p>No details found.</p>;

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section p-3 pt-2">
          <a href="">Home &gt; Store &gt; Store Operations &gt; Gate Pass</a>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mt-3">Gate Pass Details</h5>
            {details?.status === "draft" && (
              <Link
                to={`/gate-pass-edit/${id}?token=${token}`}
                className="d-flex align-items-center me-5 mt-2"
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
          </div>
          <form onSubmit={handleSubmit}>
            <CollapsibleCard title="Gate Pass Information">
              <div className="card-body">
                {details?.approval_logs && details.approval_logs.length > 0 && (
                  <div className="row  justify-content-end">
                    <div className="col-md-2 nav-item">
                      <button
                        type="button"
                        className="purple-btn2 mb-3"
                        onClick={openModal}
                        style={{
                          backgroundColor:
                            details?.status === "approved" ? "green" : "",
                          border: "none",
                        }}
                      >
                        <span>Approval Logs</span>
                      </button>
                    </div>
                  </div>
                )}
                <div className="details_page">
                  <div className="row px-3">
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                      <div className="col-6">
                        <label>Gate Pass Type</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3 text-dark">:</span>
                          {details.gate_pass_type_name || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                      <div className="col-6">
                        <label>Gate Pass No</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3 text-dark">:</span>
                          {details.gate_pass_no || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                      <div className="col-6">
                        <label>Gate Pass Date & Time</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3 text-dark">:</span>
                          {details.gate_pass_date
                            ? `${new Date(
                                details.gate_pass_date
                              ).toLocaleDateString("en-GB")} ${new Date(
                                details.gate_pass_date
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}`
                            : "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                      <div className="col-6">
                        <label>Project</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3 text-dark">:</span>
                          {details.project?.name || "N/A"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                      <div className="col-6">
                        <label>Sub-Project</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3 text-dark">:</span>
                          {details.sub_project?.name || "N/A"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                      <div className="col-6">
                        <label>From Store</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3 text-dark">:</span>
                          {details.from_store?.name || "N/A"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                      <div className="col-6">
                        <label>To Vendor</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3 text-dark">:</span>
                          {details.to_resource.vendor_name || "N/A"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                      <div className="col-6">
                        <label>Vehicle No</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3 text-dark">:</span>
                          {details.vehicle_no || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                      <div className="col-6">
                        <label>Driver Name</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3 text-dark">:</span>
                          {details.driver_name || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                      <div className="col-6">
                        <label>Driver Contact</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3 text-dark">:</span>
                          {details.driver_contact_no || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                      <div className="col-6">
                        <label>Contact Person</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3 text-dark">:</span>
                          {details.contact_person || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                      <div className="col-6">
                        <label>Contact Person No</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3 text-dark">:</span>
                          {details.contact_person_no || "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                      <div className="col-6">
                        <label>Returnable</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3 text-dark">:</span>
                          {details.returnable ? "Yes" : "No"}
                        </label>
                      </div>
                    </div>
                    {details.returnable && (
                      <>
                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                          <div className="col-6">
                            <label>Expected Return Date</label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3 text-dark">:</span>
                              {details.expected_return_date || "-"}
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                          <div className="col-6">
                            <label>Due Date</label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3 text-dark">:</span>
                              {details.due_at
                                ? new Date(
                                    details.due_date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                          <div className="col-6">
                            <label>Issued By</label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3 text-dark">:</span>
                              {details.created_by_name || "N/A"}
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleCard>

            <CollapsibleCard title="Material / Asset Details" isOpen={true}>
              <div className="card-body">
                <div className="tbl-container mx-2 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>Sr.No.</th>
                        <th>Material / Asset Type</th>
                        <th>Material / Asset Sub-Type</th>
                        <th>Material / Asset Name</th>
                        <th>Generic Info</th>
                        <th>Brand</th>
                        <th>Colour</th>
                        <th>Unit</th>
                        <th>Gate Pass Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details?.gate_pass_materials?.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.material_type}</td>
                          <td>{item.material_sub_type}</td>
                          {/* <td>{item.material}</td> */}
                          {/* <td>{item.material_sub_type}</td> */}
                          <td>
                            {item.other_material_name
                              ? item.other_material_name
                              : item.material}
                            {/* {
                              item.other_material_description
                              // <div
                              //   style={{ fontSize: "0.85em", color: "#888" }}
                              // >
                              //   {item.other_material_description}
                              // </div>
                            } */}
                          </td>

                          <td>{item.generic_specification}</td>
                          <td>{item.brand}</td>
                          <td>{item.colour}</td>
                          <td>{item.uom}</td>
                          <td>{item.gate_pass_qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CollapsibleCard>

            <CollapsibleCard title="Attachments" isOpen={true}>
              <div className="card-body">
                <div className="tbl-container mx-2 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Sr. No.</th>
                        <th className="text-start">Document Name</th>
                        <th className="text-start">File Name</th>
                        {/* <th className="text-start">File Type</th> */}
                        <th className="text-start">Upload Date</th>
                        <th className="text-start">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details?.attachments?.length > 0 ? (
                        details.attachments.map((att, index) => (
                          <tr key={index}>
                            <td className="text-start">{index + 1}</td>
                            <td className="text-start">
                              {att.document_name || "Attachment"}
                            </td>
                            <td className="text-start">
                              {att.file_name || "N/A"}
                            </td>
                            {/* <td className="text-start">
                              {att.document_content_type || "N/A"}
                            </td> */}
                            <td className="text-start">
                              {att.created_at
                                ? new Date(att.created_at).toLocaleDateString()
                                : "N/A"}
                            </td>
                            {/* <td className="text-start">
                              <a
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View
                              </a>
                            </td> */}
                            <td className="text-start">
                              <a
                                href={`${baseURL}gate_passes/${id}/download_attachment?token=${token}&blob_id=${att.blob_id}`}
                                download={att.file_name}
                              >
                                <DownloadIcon />
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No attachments
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CollapsibleCard>

            <div className="row mx-1 mt-3">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Remarks</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter remarks..."
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row mt-4 justify-content-end align-items-center mx-2">
              <div className="col-md-3">
                <div className="form-group d-flex gap-3 align-items-center mx-3">
                  <label
                    className="form-label mt-2"
                    style={{ fontSize: "0.95rem", color: "black" }}
                  >
                    Status
                  </label>
                  <SingleSelector
                    options={statusList}
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    placeholder="Select Status"
                    isClearable={false}
                    isDisabled={isStatusDisabled}
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
            </div>

            <div className="row mt-4 justify-content-end">
              <div className="col-md-2">
                <button type="submit" className="purple-btn2 w-100 mt-2">
                  Submit
                </button>
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
          </form>

          <div className="mt-4">
            <h5 className=" ">Audit Log</h5>
            <div className="tbl-container px-0">
              <table className="w-100">
                <thead>
                  <tr>
                    <th>Sr.No.</th>
                    <th>Created By</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {details?.status_logs?.map((log, index) => (
                    <tr key={log.id}>
                      <td>{index + 1}</td>
                      <td>{log.created_by_name}</td>
                      <td>{new Date(log.created_at).toLocaleDateString()}</td>
                      <td>{log.status}</td>
                      <td>{log.remarks || "-"}</td>
                    </tr>
                  ))}
                  {!details?.status_logs?.length && (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No audit log data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Log Modal */}
      <Modal size="lg" show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <h5>Approval Log</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="row mt-2 px-2">
            <div className="col-12">
              <div className="tbl-container me-2 mt-3">
                {/* Check if approval_logs is empty or undefined */}
                {!details?.approval_logs ||
                details?.approval_logs.length === 0 ? (
                  // Display a message if no logs are available
                  <div className="text-center py-4">
                    <p className="text-muted">No approval logs available.</p>
                  </div>
                ) : (
                  // Render the table if logs are available
                  <table className="w-100" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "66px !important" }}>Sr.No.</th>
                        <th>Approval Level</th>
                        <th>Approved By</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Remark</th>
                        <th>Users</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details?.approval_logs.map((log, id) => (
                        <tr key={id}>
                          <td className="text-start">{id + 1}</td>
                          <td className="text-start">{log.approval_level}</td>
                          <td className="text-start">
                            {log.approved_by || "-"}
                          </td>
                          <td className="text-start">{log.date}</td>
                          <td className="text-start">
                            <span
                              className="px-2 py-1 rounded text-white"
                              style={{
                                backgroundColor:
                                  log.status === "Pending" ? "red" : "green",
                              }}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="text-start">
                            <p>{log.remark || "-"}</p>
                          </td>
                          <td className="text-start">{log.users}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default GatePassDetails;
