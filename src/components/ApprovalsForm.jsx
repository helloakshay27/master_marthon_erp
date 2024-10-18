import React, { useState } from "react";
import Select from "react-select";
import { Form, FormCheck } from "react-bootstrap";

export default function ApprovalsForm({ mode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [formRows, setFormRows] = useState([
    { id: 1, isActive: false, sendEmails: false, selectedUsers: [] },
  ]);

  const options = [
    { value: "Rajnish Patil", label: "Rajnish Patil" },
    { value: "Lockated Demo", label: "Lockated Demo" },
    { value: "Abdul G", label: "Abdul G" },
    { value: "Kiran Sharma", label: "Kiran Sharma" },
    { value: "Dinesh Shinde", label: "Dinesh Shinde" },
    { value: "PSIPL 1", label: "PSIPL 1" },
    { value: "Jayesh P", label: "Jayesh P" },
    { value: "Rabi Narayan", label: "Rabi Narayan" },
    { value: "Zs Demo", label: "Zs Demo" },
    { value: "Suyash Jagdale", label: "Suyash Jagdale" },
  ];

  const toggleCardBody = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleCheckboxChange = (id, event) => {
    const { name, checked } = event.target;
    setFormRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [name]: checked } : row))
    );
  };

  const handleChange = (id, selectedOptions) => {
    setFormRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, selectedUsers: selectedOptions || [] } : row
      )
    );
  };

  const addNewRow = () => {
    setFormRows((prevRows) => [
      ...prevRows,
      {
        id: Date.now(),
        isActive: false,
        sendEmails: false,
        selectedUsers: [],
      },
    ]);
  };

  const removeRow = (id) => {
    setFormRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleSubmit = () => {
    if (mode === "add") {
      console.log("Create or Save new data", formRows);
    } else if (mode === "edit") {
      console.log("Update existing data", formRows);
    }
  };

  const handleNext = () => {
    console.log("Go to the next step");
  };

  return (
    <div className="p-4">
      <div className="form-group">
        <label>Function</label>
        <select className="form-control form-select" style={{ width: "100%" }}>
          <option selected="selected">GDN</option>
          <option>Purchase Offer</option>
          <option>GRN</option>
          <option>Work Order</option>
          <option>Work Order Invoice</option>
          <option>Bill</option>
          <option>Vender Elevation</option>
          <option>Permit</option>
          <option>Permit Extend</option>
          <option>Permit Closure</option>
          <option>Supplier</option>
          <option>GDN</option>
        </select>
      </div>

      <div className="card mt-3">
        <div className="card-header3">
          <h3 className="card-title">Approval Levels</h3>
          <div className="card-tools">
            <button
              type="button"
              className="btn btn-tool"
              onClick={toggleCardBody}
            >
              <svg
                width={32}
                height={32}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx={16} cy={16} r={16} fill="#8B0203" />
                <path
                  d={
                    isCollapsed
                      ? "M16 24L9.0718 12L22.9282 12L16 24Z"
                      : "M16 8L22.9282 20L9.0718 20L16 8Z"
                  }
                  fill="white"
                />
              </svg>
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="card-body pt-0 mt-0">
            {formRows.map((row, index) => (
              <div className="row my-2 align-items-center" key={row.id}>
                <div className="col-md-2">
                  <div className="form-group">
                    <p>Order</p>
                    <input
                      className="form-control"
                      placeholder="Enter Number Of Orders"
                      type="text"
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <p>Name Of Levels</p>
                    <input
                      className="form-control"
                      placeholder="Enter Name Of Levels"
                      type="text"
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>Users</label>
                    <Select
                      isMulti
                      name="users"
                      options={options}
                      value={row.selectedUsers}
                      onChange={(selectedOptions) =>
                        handleChange(row.id, selectedOptions)
                      }
                      placeholder="Type in to search..."
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <Form.Group
                      controlId="formCheckboxes"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <FormCheck
                        type="checkbox"
                        name="isActive"
                        label="Active"
                        checked={row.isActive}
                        onChange={(event) =>
                          handleCheckboxChange(row.id, event)
                        }
                        style={{ marginRight: "20px" }}
                      />
                      <FormCheck
                        type="checkbox"
                        name="sendEmails"
                        label="Send Emails"
                        checked={row.sendEmails}
                        onChange={(event) =>
                          handleCheckboxChange(row.id, event)
                        }
                      />
                    </Form.Group>
                  </div>
                </div>

                {/* Add 'Close' button only for additional rows */}
                {index > 0 && (
                  <div className="col-md-2">
                    <button
                      className="purple-btn2"
                      onClick={() => removeRow(row.id)}
                    >
                      <span className="material-symbols-outlined align-text-top me-2">
                        close{" "}
                      </span>
                      <span>Close</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button className="purple-btn2" onClick={addNewRow}>
              <span className="material-symbols-outlined align-text-top me-2">
                add{" "}
              </span>
              <span>Add</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        {mode === "add" ? (
          <>
            <button className="purple-btn2" onClick={handleSubmit}>
              Create
            </button>
            <button className="purple-btn1" onClick={handleNext}>
              Save And Next
            </button>
          </>
        ) : (
          <button className="purple-btn2" onClick={handleSubmit}>
            <span>Update</span>
          </button>
        )}
      </div>
    </div>
  );
}
