import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import SingleSelector from "../components/base/Select/SingleSelector";

const RopoMappingDetail = () => {
  const { id } = useParams();
  //   const urlParams = new URLSearchParams(location.search);
  // const token = urlParams.get("token");
  const token = "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414";

  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Add status change handler
const handleStatusChange = (option) => {
  setSelectedStatus(option?.value || '');
};

  useEffect(() => {
    axios
      .get(`https://marathon.lockated.com/ropo_mappings/${id}.json?token=${token}`)
      .then((res) => {
        setPurchaseOrderData(res.data);
         // Set initial status from API response
       const options = res.data.status_list?.map((s) => ({
        label: s,
        value: s,
      })) || [];

      const matchedOption = options.find(
        (opt) => opt.value.toLowerCase() === (res.data.status || '').toLowerCase()
      );

      setSelectedStatus(matchedOption || null);
    })

      .catch((err) => {
        console.error("Error fetching data", err);
      });
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };


  // Add this function after the existing useState declarations
const [selectedStatus, setSelectedStatus] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);

const handleStatusUpdate = async () => {
  if (!selectedStatus) {
    alert('Please select a status');
    return;
  }

  setIsSubmitting(true);

  try {
    const response = await axios.patch(
      `https://marathon.lockated.com/ropo_mappings/${id}/update_status.json?token=${token}`,
      {
        status_log: {
          status: selectedStatus.value.toLowerCase(),
          remarks: '',
          comments: '',
          admin_comment: ''
        }
      }
    );

    // Check if response status is 200 or if we have data
    if (response.status === 200 || response.data) {
      alert('Status updated successfully');
      window.location.reload();
    } else {
      throw new Error('Update failed');
    }

  } catch (error) {
    console.error('Error updating status:', error);
    alert(
      error.response?.data?.message || 
      error.message || 
      'Failed to update status'
    );
  } finally {
    setIsSubmitting(false);
  }
};



// Update the Submit button to use the new function


  if (!purchaseOrderData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <main className="h-100 w-100">
        <div className="main-content">
          <div className="website-content container-fluid">
            <div className="module-data-section">
              <a href="">
                Home &gt; Store &gt; Store Operations &gt; ROPO Mapping
              </a>
              <h5 className="mt-3">ROPO Mapping</h5>

              <div className="row my-4 align-items-center">
                <div className="col-md-12 px-2">
                  <section className="mor p-2">
                    <div className="container-fluid card">
                      <div className="card-body">
                        {/* Action Buttons */}
                        <div className="d-flex justify-content-end ms-4 mt-2">
                          {purchaseOrderData?.selected_status === "Draft" && (
                            <Link
                              to={`/ropo-mapping-edit/${id}?token=${token}`}
                              className="d-flex align-items-center"
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
                          {purchaseOrderData?.approval_logs &&
                            purchaseOrderData.approval_logs.length > 0 && (
                              <button
                                type="button"
                                className="purple-btn2 mb-3"
                                onClick={openModal}
                                style={{
                                  backgroundColor:
                                    purchaseOrderData?.status === "approved"
                                      ? "green"
                                      : "",
                                  border: "none",
                                }}
                              >
                                <span>Approval Logs</span>
                              </button>
                            )}
                        </div>

                        {/* PO Details */}
                     <div className="row">
  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
    <div className="col-6">
      <label style={{ fontWeight: 'bold' }}>Project</label>
    </div>
    <div className="col-6">
      <label className="text">
        <span className="me-3 text-dark">:</span>
        <span style={{ color: '#8B0203' }}>
          {purchaseOrderData.project?.name}
        </span>
      </label>
    </div>
  </div>

  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
    <div className="col-6">
      <label style={{ fontWeight: 'bold' }}>Sub-Project</label>
    </div>
    <div className="col-6">
      <label className="text">
        <span className="me-3 text-dark">:</span>
        <span style={{ color: '#8B0203' }}>
          {purchaseOrderData.pms_site?.name}
        </span>
      </label>
    </div>
  </div>

  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
    <div className="col-6">
      <label style={{ fontWeight: 'bold' }}>Date</label>
    </div>
    <div className="col-6">
      <label className="text">
        <span className="me-3 text-dark">:</span>
        <span style={{ color: '#8B0203' }}>
          {formatDate(purchaseOrderData.mapping_date)}
        </span>
      </label>
    </div>
  </div>

  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
    <div className="col-6">
      <label style={{ fontWeight: 'bold' }}>Remarks</label>
    </div>
    <div className="col-6">
      <label className="text">
        <span className="me-3 text-dark">:</span>
        <span style={{ color: '#8B0203' }}>
          {purchaseOrderData.remarks}
        </span>
      </label>
    </div>
  </div>
</div>  
                        <div className="d-flex justify-content-between  align-items-center mt-3">
                          <h5
                            className="mt-2 "
                            data-bs-toggle="modal"
                            data-bs-target="#sereneModal"
                          >
                            MOR & PO Mapping
                          </h5>
                        </div>

                        {/* Material Table */}
                        <div className="tbl-container me-2 mt-3">
                          <table className="w-100">
                            <thead>
                              <tr>
                                <th>Material</th>
                                <th>MOR Number</th>
                                <th>PO</th>
                                <th>Pending Qty</th>
                                <th>Ordered Qty</th>
                                <th>PO UOM</th>
                                <th>Converted Ordered Qty</th>
                                <th>Rate</th>
                                <th>Material Cost</th>
                                <th>Total Received Qty</th>
                              </tr>
                            </thead>
                            <tbody>
                              {purchaseOrderData?.ropo_mor_inventories?.map(
                                (item, index) => (
                                  <tr key={index}>
                                    <td>{item.material_name || "-"}</td>
                                    <td>{item.mor_number || "-"}</td>
                                    <td>{item.po_number || "-"}</td>
                                    <td>{item.pending_qty || "-"}</td>
                                    <td>{item.order_qty || "-"}</td>
                                    <td>{item.uom_name || "-"}</td>
                                    <td>{item.required_quantity || "-"}</td>
                                    <td>{item.rate || "-"}</td>
                                    <td>{item.material_cost || "-"}</td>
                                    <td>{item.grn_qty || "-"}</td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </section>
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
                      options={purchaseOrderData.status_list?.map((s) => ({
                        label: s,
                        value: s,
                      }))}
                    
                     value={selectedStatus} // now it's an object, not string
                      onChange={(option) => setSelectedStatus(option)} // store whole object
                      isClearable={false}
                      isDisabled={purchaseOrderData.disabled}
                    />
                  </div>
                </div>
              </div>

              <div className="row mt-2 justify-content-end">
                <div className="col-md-2 mt-2">
                 <button 
  type="button" 
  className="purple-btn2 w-100"
  onClick={handleStatusUpdate}
  disabled={isSubmitting}
>
  {isSubmitting ? 'Updating...' : 'Submit'}
</button>
                </div>
                <div className="col-md-2">
                  <button type="button" className="purple-btn1 w-100">
                    Cancel
                  </button>
                </div>
              </div>
              <h5 className="mt-3">Audit Logs</h5>
              <div className="tbl-container px-0">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>Sr.No.</th>
                      <th>User</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>PO Remark</th>
                      <th>PO Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrderData.status_logs?.length > 0 ? (
                      purchaseOrderData.status_logs.map((log, idx) => (
                        <tr key={log.id}>
                          <td className="text-start">{idx + 1}</td>
                          <td className="text-start">{log.created_by_name || "-"}</td>
                          <td className="text-start">{formatDate(log.created_at)}</td>
                          <td className="text-start">{log.status || "-"}</td>
                          <td className="text-start">{log.remarks || "-"}</td>
                          <td className="text-start">{log.comments || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No logs found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Approval Log Modal */}
      <Modal size="lg" show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <h5>Approval Log</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="row mt-2 px-2">
            <div className="col-12">
              <div className="tbl-container me-2 mt-3">
                {!purchaseOrderData?.approval_logs ||
                purchaseOrderData.approval_logs.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No approval logs available.</p>
                  </div>
                ) : (
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>Sr.No.</th>
                        <th>Approval Level</th>
                        <th>Approved By</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Remark</th>
                        <th>Users</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseOrderData.approval_logs.map((log, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{log.approval_level}</td>
                          <td>{log.approved_by || "-"}</td>
                          <td>{log.date}</td>
                          <td>
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
                          <td>{log.remark || "-"}</td>
                          <td>{log.users}</td>
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

export default RopoMappingDetail;
