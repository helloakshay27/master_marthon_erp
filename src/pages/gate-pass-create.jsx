import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import MultiSelector from "../components/base/Select/MultiSelector";
import SingleSelector from "../components/base/Select/SingleSelector";
import { baseURL } from "../confi/apiDomain";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Table } from "../components";

const GatePassCreate = () => {
  const [formData, setFormData] = useState({
    project_id: null,
    sub_project_id: null,
    gate_pass_no: "",
    gate_pass_type: "",
    is_returnable: "returnable", // Default to returnable
    store_id: null,
    mto_po_number: "",
    to_store_id: null,
    vehicle_no: "",
    driver_name: "",
    expected_return_date: "",
    gate_pass_date_time: "",
    issued_by: "",
    contact_person: "",
    contact_no: "",
    gate_no: "",
    material_items: [],
  });

  const [projects, setProjects] = useState([]);
  const [subProjects, setSubProjects] = useState([]);
  const [stores, setStores] = useState([]);
  const [toStores, setToStores] = useState([]);
  const [gatePassTypes, setGatePassTypes] = useState([
    { value: "transfer_to_site", label: "Transfer to Site" },
    { value: "return_to_vendor", label: "Return to Vendor" },
    { value: "repair_maintenance", label: "Repair/Maintenance" },
    { value: "general", label: "General" },
    { value: "testing_calibration", label: "Testing/Calibration" },
  ]);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const navigate = useNavigate();

  const [vendorTypes] = useState([
    { value: "master", label: "Master Vendor" },
    { value: "non_master", label: "Non-Master Vendor" },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.project_id) {
      alert("Please select a Project");
      return;
    }
    if (!formData.sub_project_id) {
      alert("Please select a Sub-Project");
      return;
    }
    if (!formData.mto_po_number) {
      if (formData.gate_pass_type === "transfer_to_site") {
        alert("Please enter MTO/SO Number");
      } else if (formData.gate_pass_type === "repair_maintenance") {
        alert("Please select To Vendor");
      } else {
        alert("Please enter PO/WO Number");
      }
      return;
    }
    if (!formData.vehicle_no) {
      alert("Please enter Vehicle No");
      return;
    }
    if (!formData.gate_pass_date_time) {
      alert("Please enter Gate Pass Date & Time");
      return;
    }
    if (
      formData.gate_pass_type === "return_to_vendor" &&
      !formData.expected_return_date
    ) {
      alert("Please enter Expected Return Date for Return to Vendor");
      return;
    }
    if (formData.material_items.length === 0) {
      alert("Please add at least one material item");
      return;
    }

    try {
      const response = await axios.post(`${baseURL}gate_passes.json`, {
        gate_pass: {
          ...formData,
          material_items_attributes: formData.material_items,
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Gate Pass created successfully!");
        navigate("/gate-pass-list");
      }
    } catch (error) {
      console.error("Error creating gate pass:", error);
      alert("Failed to create gate pass. Please try again.");
    }
  };

  const handleRemoveMaterial = (index) => {
    const updatedItems = [...formData.material_items];
    updatedItems.splice(index, 1);
    setFormData({
      ...formData,
      material_items: updatedItems,
    });
  };

  const [documentRows, setDocumentRows] = useState([
    {
      srNo: 1,
      upload: null,
      fileType: "",
      uploadDate: new Date().toISOString().split("T")[0],
    },
  ]);
  const documentRowsRef = useRef(documentRows);

  const handleAddDocumentRow = () => {
    const newRow = {
      srNo: documentRows.length + 1,
      upload: null,
      fileType: "",
      uploadDate: new Date().toISOString().split("T")[0],
    };
    documentRowsRef.current.push(newRow);
    setDocumentRows([...documentRowsRef.current]);
  };

  const handleRemoveDocumentRow = (index) => {
    if (documentRows.length > 1) {
      const updatedRows = documentRows.filter((_, i) => i !== index);

      // Reset row numbers properly
      updatedRows.forEach((row, i) => {
        row.srNo = i + 1;
      });

      documentRowsRef.current = updatedRows;
      setDocumentRows([...updatedRows]);
    }
  };

  const handleFileChange = (index, file) => {
    if (!file) return; // Ensure a file is selected

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];
      const fileType = file.name.split(".").pop().toUpperCase();

      documentRowsRef.current[index].upload = {
        filename: file.name,
        content: base64String,
        content_type: file.type,
      };
      documentRowsRef.current[index].fileType = fileType;
      documentRowsRef.current[index].uploadDate = new Date()
        .toISOString()
        .split("T")[0];

      setDocumentRows([...documentRowsRef.current]);
    };

    reader.readAsDataURL(file);

    // Reset the input field to allow re-selecting the same file
    const inputElement = document.getElementById(`file-input-${index}`);
    if (inputElement) {
      inputElement.value = ""; // Clear input value
    }
  };

  const getHeaderTitle = () => {
    switch (formData.gate_pass_type) {
      case "transfer_to_site":
        return "Transfer to Site";
      case "return_to_vendor":
        return "Return to Vendor";
      case "repair_maintenance":
        return "Repair/Maintenance";
      case "general":
        return "General";
      case "testing_calibration":
        return "Testing/Calibration";
      default:
        return "Create Gate Pass";
    }
  };

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">Home &gt; Store &gt; Store Operations &gt; Gate Pass</a>
          <h5 className="mt-3">Gate Pass list</h5>
          <div className="head-material text-center">
            <h4>{getHeaderTitle()}</h4>
          </div>
          <div className="card card-default mt-5 p-2b-4">
            <div className="card-header3">
              <h3 className="card-title">{getHeaderTitle()}</h3>
            </div>
            <div className="card-body">
              {/* Radio buttons for Returnable/Non-Returnable */}
              <div className="row mb-4">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="me-3">Returnable Status:</label>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="isReturnable"
                        id="returnable"
                        value="returnable"
                        checked={formData.is_returnable === "returnable"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_returnable: e.target.value,
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor="returnable">
                        Returnable
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="isReturnable"
                        id="nonReturnable"
                        value="non_returnable"
                        checked={formData.is_returnable === "non_returnable"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_returnable: e.target.value,
                          })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="nonReturnable"
                      >
                        Non-Returnable
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Project *</label>
                    <SingleSelector
                      options={projects}
                      onChange={(selected) =>
                        setFormData({
                          ...formData,
                          project_id: selected?.value,
                        })
                      }
                      value={projects.find(
                        (p) => p.value === formData.project_id
                      )}
                      placeholder="Select Project"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Sub-Project *</label>
                    <SingleSelector
                      options={subProjects}
                      onChange={(selected) =>
                        setFormData({
                          ...formData,
                          sub_project_id: selected?.value,
                        })
                      }
                      value={subProjects.find(
                        (p) => p.value === formData.sub_project_id
                      )}
                      placeholder="Select Sub-Project"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Gate Pass No</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.gate_pass_no}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gate_pass_no: e.target.value,
                        })
                      }
                      placeholder="Enter Gate Pass No"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Gate Pass Type</label>
                    <SingleSelector
                      options={gatePassTypes}
                      onChange={(selected) =>
                        setFormData({
                          ...formData,
                          gate_pass_type: selected?.value,
                        })
                      }
                      value={gatePassTypes.find(
                        (t) => t.value === formData.gate_pass_type
                      )}
                      placeholder="Select Type"
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>From Store</label>
                    <SingleSelector
                      options={stores}
                      onChange={(selected) =>
                        setFormData({ ...formData, store_id: selected?.value })
                      }
                      value={stores.find((s) => s.value === formData.store_id)}
                      placeholder="Select From Store"
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    {formData.gate_pass_type === "repair_maintenance" ? (
                      <>
                        <label>To Vendor *</label>
                        <SingleSelector
                          options={vendorTypes}
                          onChange={(selected) =>
                            setFormData({
                              ...formData,
                              mto_po_number: selected?.value,
                            })
                          }
                          value={vendorTypes.find(
                            (v) => v.value === formData.mto_po_number
                          )}
                          placeholder="Select Vendor Type"
                        />
                      </>
                    ) : (
                      <>
                        <label>
                          {formData.gate_pass_type === "transfer_to_site"
                            ? "MTO/SO Number *"
                            : formData.gate_pass_type === "return_to_vendor"
                            ? "PO/WO No *"
                            : "MTO/PO Number *"}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.mto_po_number}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mto_po_number: e.target.value,
                            })
                          }
                          placeholder={
                            formData.gate_pass_type === "transfer_to_site"
                              ? "Enter MTO/SO Number"
                              : formData.gate_pass_type === "return_to_vendor"
                              ? "Enter PO/WO No"
                              : "Enter MTO/PO Number"
                          }
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>To Store</label>
                    <SingleSelector
                      options={toStores}
                      onChange={(selected) =>
                        setFormData({
                          ...formData,
                          to_store_id: selected?.value,
                        })
                      }
                      value={toStores.find(
                        (s) => s.value === formData.to_store_id
                      )}
                      placeholder="Select To Store"
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Vehicle No. *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.vehicle_no}
                      onChange={(e) =>
                        setFormData({ ...formData, vehicle_no: e.target.value })
                      }
                      placeholder="Enter Vehicle No"
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Driver Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.driver_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          driver_name: e.target.value,
                        })
                      }
                      placeholder="Enter Driver Name"
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>
                      Expected Return Date{" "}
                      {formData.gate_pass_type === "return_to_vendor" && "*"}
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.expected_return_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expected_return_date: e.target.value,
                        })
                      }
                      required={formData.gate_pass_type === "return_to_vendor"}
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Gate Pass Date & Time *</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={formData.gate_pass_date_time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gate_pass_date_time: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Issued By</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.issued_by}
                      onChange={(e) =>
                        setFormData({ ...formData, issued_by: e.target.value })
                      }
                      placeholder="Enter Issued By"
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Contact Person</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.contact_person}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_person: e.target.value,
                        })
                      }
                      placeholder="Enter Contact Person"
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Contact No</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.contact_no}
                      onChange={(e) =>
                        setFormData({ ...formData, contact_no: e.target.value })
                      }
                      placeholder="Enter Contact No"
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Gate No</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.gate_no}
                      onChange={(e) =>
                        setFormData({ ...formData, gate_no: e.target.value })
                      }
                      placeholder="Enter Gate No"
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-end px-2 mt-3">
                <h5>Material / Asset Details</h5>
              </div>

              <div className="tbl-container mx-2 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>Sr.No.</th>
                      <th>Material / Asset Type</th>
                      <th>Material / Asset Sub-Type</th>
                      <th>Material / Asset Name</th>
                      <th>Material Details</th>
                      <th>Unit</th>
                      <th>Gate Pass Qty</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.material_items.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.material_type}</td>
                        <td>{item.material_sub_type}</td>
                        <td>{item.material_name}</td>
                        <td>{item.material_details}</td>
                        <td>{item.unit}</td>
                        <td>{item.gate_pass_qty}</td>
                        <td>
                          <button
                            className="btn"
                            onClick={() => handleRemoveMaterial(index)}
                          >
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
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <div className="d-flex justify-content-between align-items-end mx-1 mt-5">
                  <h5 className="mt-3">
                    Document Attachments{" "}
                    {/* <span style={{ color: "red", fontSize: "16px" }}>*</span> */}
                  </h5>
                  <button
                    className="purple-btn2 mt-3"
                    onClick={handleAddDocumentRow}
                  >
                    <span className="material-symbols-outlined align-text-top me-2">
                      add
                    </span>
                    <span>Add</span>
                  </button>
                </div>

                <Table
                  columns={[
                    { label: "Sr No", key: "srNo" },
                    { label: "Upload File", key: "upload" },
                    { label: "File Type", key: "fileType" },
                    { label: "Upload Date", key: "uploadDate" },
                    { label: "Action", key: "action" },
                  ]}
                  data={documentRows.map((row, index) => ({
                    srNo: index + 1,
                    upload: (
                      <td style={{ border: "none" }}>
                        <input
                          type="file"
                          id={`file-input-${index}`}
                          key={row?.srNo}
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleFileChange(index, e.target.files[0])
                          }
                          accept=".xlsx,.csv,.pdf,.docx,.doc,.xls,.txt,.png,.jpg,.jpeg,.zip,.rar,.jfif,.svg,.mp4,.mp3,.avi,.flv,.wmv"
                        />
                        <label
                          htmlFor={`file-input-${index}`}
                          style={{
                            display: "inline-block",
                            width: "300px",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            cursor: "pointer",
                            color: "#555",
                            backgroundColor: "#f5f5f5",
                            textAlign: "center",
                          }}
                        >
                          {row.upload?.filename
                            ? row.upload.filename
                            : "Choose File"}
                        </label>
                      </td>
                    ),
                    fileType: row.fileType || "-",
                    uploadDate: row.uploadDate || "-",
                    action: (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRemoveDocumentRow(index)}
                        disabled={documentRows.length === 1}
                      >
                        Remove
                      </button>
                    ),
                  }))}
                  isAccordion={false}
                />
              </div>

              <div className="row mt-4 justify-content-end">
                <div className="col-md-2">
                  <button className="purple-btn2 w-100" onClick={handleSubmit}>
                    Submit
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    className="purple-btn1 w-100"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GatePassCreate;
