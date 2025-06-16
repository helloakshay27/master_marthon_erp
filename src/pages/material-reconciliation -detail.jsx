import React, { version } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import SingleSelector from "../components/base/Select/SingleSelector";
import { baseURL } from "../confi/apiDomain";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import { useParams, useNavigate } from "react-router-dom";

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

  useEffect(() => {
    axios
      .get(`${baseURL}material_reconciliations/${id}.json?token=${token}`)
      .then((response) => {
        setDetails(response.data);
        setSelectedStatus({
          value: response.data.status,
          label:
            response.data.status.charAt(0).toUpperCase() +
            response.data.status.slice(1),
        });
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
              mor_inventory_id: item.mor_inventory_id,
              material: item.material,
              stock_as_on: item.stock_as_on,
              rate: item.rate,
              deadstock_qty: item.deadstock_qty,
              theft_or_missing_qty: item.theft_or_missing_qty,
              adjustment_qty: item.adjustment_qty,
              adjustment_rate: item.adjustment_rate,
              adjustment_value: item.adjustment_value,
              net_quantity: calculateNetQuantity(
                item.stock_as_on,
                item.deadstock_qty,
                item.theft_or_missing_qty,
                item.adjustment_qty
              ),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        status_log: {
          status: selectedStatus?.value || "draft",
          comments: formData.remarks || "",
          admin_comment: adminComment,
        },
      };

      const response = await axios.post(
        `${baseURL}material_reconciliations/${id}/update_status.json?token=${token}`,
        payload
      );

      console.log("Status update successful:", response.data);
      alert("Status updated successfully!");
      navigate(`/material-reconciliation-list?token=${token}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status. Please try again.");
    }
  };

  const statusOptions = [
    { value: "", label: "Select Status" },
    { value: "draft", label: "Draft" },
    { value: "submitted", label: "Submitted" },
    { value: "approved", label: "Approved" },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-3 pt-2">
          <form onSubmit={handleSubmit}>
            <CollapsibleCard title="Material Reconciliation">
              <div className="card-body ">
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
                        <th>Rate (Weighted Average)(INR)</th>
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
                            <td>{item.stock_as_on}</td>
                            <td>{item.rate}</td>
                            <td>{item.deadstock_qty}</td>
                            <td>{item.theft_or_missing_qty}</td>
                            <td>{item.wastage_qty}</td>
                            <td>{item.adjustment_qty}</td>
                            <td>{item.adjustment_rate}</td>
                            <td>{item.adjustment_value}</td>
                            <td>{item.net_quantity}</td>
                            <td>{item.remarks}</td>
                            <td>{item.reason}</td>
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
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={(selectedOption) => {
                      setSelectedStatus(
                        selectedOption || { value: "", label: "Select Status" }
                      );
                    }}
                    placeholder="Select Status"
                    isClearable={false}
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
                  onClick={() => navigate("/material-reconciliation")}
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
                    <td>{log.admin_comment || "-"}</td>
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
    </div>
  );
};

export default MaterialReconciliationDetail;
