import React, { version } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import SingleSelector from "../components/base/Select/SingleSelector";
import { baseURL } from "../confi/apiDomain";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MaterialReconciliationDetail = () => {
  const [adminComment, setAdminComment] = useState("");

  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    pms_project_id: "",
    pms_site_id: "",
    pms_store_id: "",
    pms_company_setup_id: "",
    created_by_id: "",
    reco_date: "",
    remarks: "",
    material_reconciliation_items_attributes: [],
  });
  const [selectedStatus, setSelectedStatus] = useState({
    value: "",
    label: "Select Status",
  });
  const [statusList, setStatusList] = useState([]);
  const [isStatusDisabled, setIsStatusDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const calculateNetQuantity = (
    stockAsOn,
    deadstockQty,
    theftQty,
    damageQty,
    adjustmentQty
  ) => {
    const stock = parseFloat(stockAsOn) || 0;
    const deadstock = parseFloat(deadstockQty) || 0;
    const theft = parseFloat(theftQty) || 0;
    const damage = parseFloat(damageQty) || 0;
    const adjustment = parseFloat(adjustmentQty) || 0;
    return stock - deadstock - theft - damage + adjustment;
  };

  const formatNumber = (val) => {
    if (val === null || val === undefined || val === "") return "0.00";
    const num = Number(val);
    if (isNaN(num)) return "0.00";
    return num.toFixed(2);
  };

  useEffect(() => {
    // setLoading(true);
    axios
      .get(`${baseURL}material_reconciliations/${id}.json?token=${token}`)
      .then((response) => {
        console.log("API Response:", response.data);
        console.log("Approval logs in response:", response.data.approval_logs);
        setDetails(response.data);

        // Set status list and selected status from API
        if (response.data.status_list) {
          const statusOptions = response.data.status_list.map((status) => ({
            value: status.toLowerCase(),
            label: status,
          }));
          setStatusList(statusOptions);

          // Set selected status if available
          if (response.data.selected_status) {
            setSelectedStatus({
              value: response.data.selected_status.toLowerCase(),
              label: response.data.selected_status,
            });
          }

          // Set disabled state
          setIsStatusDisabled(response.data.disabled || false);
        }

        setFormData({
          pms_project_id: response.data.project.id,
          pms_site_id: response.data.sub_project.id,
          pms_store_id: response.data.store.id,
          pms_company_setup_id: response.data.company.id,
          created_by_id: response.data.created_by.id,
          reco_date: response.data.reco_date,
          remarks: response.data.remarks,
          material_reconciliation_items_attributes:
            response.data.material_reconciliation_items.map((item) => ({
              id: item.id,
              material_inventory_id: item.material_inventory_id,
              material: item.material,
              stock_as_on: item.stock_as_on,
              rate: item.rate,
              deadstock_qty: item.deadstock_qty,
              damage_qty: item.damage_qty,
              theft_or_missing_qty: item.theft_or_missing_qty,
              adjustment_qty: item.adjustment_qty,
              adjustment_rate: item.adjustment_rate,
              adjustment_value: item.adjustment_value,
              net_quantity: item.net_quantity,

              remarks: item.remarks,
              reason: item.reason,
            })),
        });
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (itemIndex, field, value) => {
    const updatedItems = [...formData.material_reconciliation_items_attributes];
    const currentItem = updatedItems[itemIndex];

    // Update the changed field
    updatedItems[itemIndex] = {
      ...currentItem,
      [field]: value,
    };

    // If deadstock, theft, or adjustment quantity changes, recalculate net quantity
    if (
      field === "deadstock_qty" ||
      field === "theft_or_missing_qty" ||
      field === "wastage_qty" || // Add damage/wastage field
      field === "adjustment_qty"
    ) {
      const newDeadstockQty =
        field === "deadstock_qty" ? value : currentItem.deadstock_qty;
      const newTheftQty =
        field === "theft_or_missing_qty"
          ? value
          : currentItem.theft_or_missing_qty;

      const newDamageQty = // Add damage quantity
        field === "wastage_qty" ? value : currentItem.wastage_qty;
      const newAdjustmentQty =
        field === "adjustment_qty" ? value : currentItem.adjustment_qty;

      // Calculate net quantity
      const stock = parseFloat(currentItem.stock_as_on) || 0;
      const deadstock = parseFloat(newDeadstockQty) || 0;
      const theft = parseFloat(newTheftQty) || 0;
      const damage = parseFloat(newDamageQty) || 0; // Parse damage quantity
      const adjustment = parseFloat(newAdjustmentQty) || 0;

      updatedItems[itemIndex].net_quantity =
        stock - deadstock - theft - damage + adjustment;
    }

    setFormData({
      ...formData,
      material_reconciliation_items_attributes: updatedItems,
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.put(
  //       `${baseURL}material_reconciliations/${id}/update_status.json?token=${token}`,
  //       {
  //         material_reconciliation: {
  //           ...formData,
  //           status: "draft",
  //         },
  //       }
  //     );
  //     if (response.status === 200) {
  //       alert("Material reconciliation updated successfully");
  //       navigate(`/material-reconciliation-list?token=${token}`);
  //     }
  //   } catch (error) {
  //     console.error("Error updating material reconciliation:", error);
  //     alert("Failed to update material reconciliation");
  //   }
  // };
  // Step 3: Handle remark change

  const payload = {
    status_log: {
      status: selectedStatus?.value || "draft",

      remarks: adminComment,
    },
  };
  // console.log("payload:",payload)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // setLoading(true);
      const payload = {
        status_log: {
          status: selectedStatus?.value || "draft",
          // comments: formData.remarks || "",
          remarks: adminComment,
        },
      };
      console.log("payload on submit:", payload);

      const response = await axios.post(
        `${baseURL}material_reconciliations/${id}/update_status.json?token=${token}`,
        payload
      );

      console.log("Status update successful:", response.data);
      toast.success("Status updated successfully!");
      setAdminComment("");
      setTimeout(() => {
        window.location.reload();
      }, 500);
      // navigate(`/material-reconciliation-list?token=${token}`);
    } catch (error) {
      console.error("Error updating status:", error);
      const getApiErrorMessage = (err) => {
        const status = err?.response?.status;
        const data = err?.response?.data;
        if (typeof data === "string" && data.trim()) return data;
        if (data?.message) return data.message;
        if (Array.isArray(data?.errors) && data.errors.length > 0) {
          return data.errors.join(", ");
        }
        if (data?.errors && typeof data.errors === "object") {
          try {
            const combined = Object.values(data.errors)
              .flat()
              .filter(Boolean)
              .join(", ");
            if (combined) return combined;
          } catch (_) {}
        }
        if (data && typeof data === "object") {
          try {
            const str = JSON.stringify(data);
            if (str && str.length <= 500) return str;
          } catch (_) {}
        }
        return status ? `Request failed with status ${status}` : (err?.message || "Error updating status. Please try again.");
      };
      toast.error(getApiErrorMessage(error));
      setLoading(false);
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
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
        <p>loading...</p>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!details) {
    return null;
  }

  return (
    <div>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-3 pt-2">
          <a href="">
            Home &gt; Store &gt; Store Operations &gt; Material Reconciliation
          </a>
          <div className="d-flex justify-content-end m-4">
            {details?.status === "draft" && (
              <Link
                to={`/material-reconciliation-edit/${id}?token=${token}`}
                className="d-flex align-items-center"
                style={{ borderColor: "#8b0203" }}
              >
                <button
                  class="purple-btn1"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
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
            <CollapsibleCard title="Material Reconciliation">
              <div className="card-body ">
                {/* Debug info */}
                {console.log("Details:", details)}
                {console.log("Approval logs:", details?.approval_logs)}
                {console.log(
                  "Approval logs length:",
                  details?.approval_logs?.length
                )}

                {/* Show button if approval logs exist */}
                {details?.approval_logs && details.approval_logs.length > 0 && (
                  <div className="row mt-1 justify-content-end">
                    <div className="col-md-2 nav-item">
                      <button
                        type="button"
                        className="purple-btn2"
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
                <div className="row mt-3">
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>Company </label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>
                          :
                        </span>
                        <span>{details.company.name}</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>Project</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>
                          :
                        </span>
                        <span>{details.project.name}</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div className="col-6">
                      <label>Sub-Project</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>
                          :
                        </span>
                        <span>{details.sub_project.name}</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div className="col-6">
                      <label>Store</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>
                          :
                        </span>
                        <span>{details.store.name}</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div className="col-6">
                      <label>Material Reco. No.</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>
                          :
                        </span>
                        <span>{details.reco_number}</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                    <div className="col-6">
                      <label>Date</label>
                    </div>
                    <div className="col-6">
                      <label className="text">
                        <span className="me-3" style={{ color: "black" }}>
                          :
                        </span>
                        <span>
                          {details.reco_date.split("-").reverse().join("-")}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className=" d-flex justify-content-between align-items-end px-2  mt-3">
                  <h5 className=" ">Material</h5>
                </div>
                <div className="tbl-container mx-2 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>Sr.No.</th>
                        <th>Material</th>
                        <th>Stock As on</th>
                        {/* <th>Rate (Weighted Average)(INR)</th> */}
                        <th>Deadstock Qty</th>
                        <th>Theft / Missing Qty</th>
                        <th> Damage Qty</th>
                        <th>Adjustment Quantity</th>
                        <th>Adjustment Rate(INR)</th>
                        <th>Adjustment Value(INR)</th>
                        <th>Net Quantity</th>
                        <th>Remarks</th>
                        <th>Reason</th>
                        {/* <th>Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {/* {formData.material_reconciliation_items_attributes.map(
                        (item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.material}</td>
                            <td>{item.stock_as_on}</td>
                            <td>{item.rate}</td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={item.deadstock_qty}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "deadstock_qty",
                                    e.target.value
                                  )
                                }
                                min="0"
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={item.theft_or_missing_qty}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "theft_or_missing_qty",
                                    e.target.value
                                  )
                                }
                                min="0"
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={item.wastage_qty}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "wastage_qty",
                                    e.target.value
                                  )
                                }
                                min="0"
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={item.adjustment_qty}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "adjustment_qty",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={item.adjustment_rate}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "adjustment_rate",
                                    e.target.value
                                  )
                                }
                                disabled
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={item.adjustment_value}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "adjustment_value",
                                    e.target.value
                                  )
                                }
                                disabled
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={item.net_quantity}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                value={item.remarks}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "remarks",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                value={item.reason}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "reason",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <button type="button" className="btn">
                                <svg
                                  width={18}
                                  height={18}
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.76 6L6 11.76M6 6L11.76 11.76"
                                    stroke="#8B0203"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                                    stroke="#8B0203"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        )
                      )} */}
                      {formData.material_reconciliation_items_attributes.map(
                        (item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.material}</td>
                            <td>{formatNumber(item.stock_as_on)}</td>
                            {/* <td>{formatNumber(item.rate)}</td> */}
                            <td>{formatNumber(item.deadstock_qty)}</td>
                            <td>{formatNumber(item.theft_or_missing_qty)}</td>
                            <td>{formatNumber(item.damage_qty)}</td>
                            <td>{formatNumber(item.adjustment_qty)}</td>
                            <td>{formatNumber(item.adjustment_rate)}</td>
                            <td>{formatNumber(item.adjustment_value)}</td>
                            <td>{formatNumber(item.net_quantity)}</td>
                            <td>{item.remarks}</td>
                            <td>{item.reason?.name || item.reason || "-"}</td>
                            {/* <td>-</td> */}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CollapsibleCard>
            <div className="row mx-1 mt-3">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Remark</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter ..."
                    defaultValue={""}
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                  />
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
                    options={statusList}
                    value={selectedStatus}
                    onChange={(selectedOption) => {
                      setSelectedStatus(
                        selectedOption || { value: "", label: "Select Status" }
                      );
                    }}
                    placeholder="Select Status"
                    isClearable={false}
                    isDisabled={isStatusDisabled}
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
            </div>
            <div className="row mt-2 justify-content-end">
              <div className="col-md-2">
                <button type="submit" className="purple-btn2 w-100 mt-2">
                  Submit
                </button>
              </div>
              <div className="col-md-2">
                <button
                  type="button"
                  className="purple-btn1 w-100"
                  onClick={() => navigate(`/material-reconciliation-list?token=${token}`)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
          <div className=" d-flex justify-content-">
            <h5 className=" ">Audit Log</h5>
          </div>
          <div className="tbl-container px-0">
            <table className="w-100">
              <thead>
                <tr>
                  <th>Sr.No.</th>
                  <th>User</th>
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
                    <td>
                      {new Date(log.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </td>
                    <td>{log.remarks || "-"}</td>
                    {/* <td>{log.admin_comment || "-"}</td> */}
                  </tr>
                ))}
                {!details?.status_logs?.length && (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No audit log data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
                          <td className="text-start">{log.approved_by}</td>
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default MaterialReconciliationDetail;
