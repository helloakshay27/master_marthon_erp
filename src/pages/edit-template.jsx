import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../components/base/Table/Table";
import ShortTable from "../components/base/Table/ShortTable";
import DynamicModalBox from "../components/base/Modal/DynamicModalBox";
import SelectBox from "../components/base/Select/SelectBox";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { baseURL } from "../confi/apiDomain";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTemplate() {
  const [templateName, setTemplateName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [columns, setColumns] = useState([
    {
      label: "Sr no.",
      key: "srNo",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "Material Name",
      key: "descriptionOfItem",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "Material Type",
      key: "material_type",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "Material Sub type",
      key: "material_sub_type",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "Quantity requested",
      key: "quantity_requested",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "Creator Attachment",
      key: "creator_attachment",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "Discount",
      key: "discount",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "Realised Discount",
      key: "realised_discount",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "GST",
      key: "gst",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "Realised GST",
      key: "realised_gst",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "Landed Amount",
      key: "landed_amount",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "Participant Attachment",
      key: "participant_attachment",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "Vendor Remark",
      key: "vendor_remark",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "Total",
      key: "total",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "Quantity",
      key: "quantity",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "UOM",
      key: "unit",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "Location",
      key: "location",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "Rate",
      key: "rate",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
    {
      label: "Amount",
      key: "amount",
      isRequired: true,
      isReadOnly: true,
      fieldOwner: "admin",
    },
  ]);

  const [shortTableData, setShortTableData] = useState([
    // { label: "Freight Charge", value: "" },
    // { label: "GST on Freight", value: "" },
    // { label: "Realised GST", value: "" },
    { label: "Warranty Clause", value: "" },
    { label: "Payment Terms", value: "" },
    { label: "Loading/Unloading", value: "" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newColumn, setNewColumn] = useState({
    fieldName: "",
    isRequired: false,
    isReadOnly: false,
    fieldOwner: "",
    fieldType: "string",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editColumn, setEditColumn] = useState({
    fieldName: "",
    isRequired: false,
    isReadOnly: false,
    fieldOwner: "",
    fieldType: "string",
  });

  const [showShortTableEditModal, setShowShortTableEditModal] = useState(false);
  const [editShortTableRow, setEditShortTableRow] = useState({
    label: "",
    value: "",
    fieldName: "",
    isRequired: false,
    isReadOnly: false,
    fieldOwner: "",
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/department_list?token=${token}`
        );
        const options = response.data.list.map((dept) => ({
          value: dept.value,
          label: dept.name,
        }));
        setDepartmentOptions(options);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const response = await axios.get(`${baseURL}/rfq/event_templates/${id}`);
        const templateData = response.data;

        setTemplateName(templateData.name);
        setDepartmentName(templateData.department_id);

        // Ensure no duplicate columns are added
        const updatedColumns = [
          ...columns.filter((col) => !templateData.bid_material_template_fields.some((field) => field.field_name.toLowerCase().replace(/\s+/g, "_") === col.key)),
          ...templateData.bid_material_template_fields.map((field) => ({
            id: field.id,
            label: field.field_name,
            key: field.field_name.toLowerCase().replace(/\s+/g, "_"),
            isRequired: field.is_required,
            isReadOnly: field.is_read_only,
            fieldOwner: field.field_owner,
            fieldType: "string",
          })),
        ];

        setColumns(updatedColumns);

        // Ensure no duplicate rows are added to shortTableData
        const updatedShortTableData = [
          ...shortTableData.filter((row) => !templateData.bid_template_fields.some((field) => field.field_name === row.label)),
          ...templateData.bid_template_fields.map((field) => ({
            id: field.id,
            label: field.field_name,
            value: "",
            isRequired: field.is_required,
            isReadOnly: field.is_read_only,
            fieldOwner: field.field_owner,
          })),
        ];

        setShortTableData(updatedShortTableData);
      } catch (error) {
        console.error("Error fetching template data:", error);
      }
    };

    fetchTemplateData();
  }, [id]);

  const handleAddColumn = () => {
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    const newColumnKey = newColumn.fieldName.toLowerCase().replace(/\s+/g, "_");
    setColumns([
      ...columns,
      { label: newColumn.fieldName, key: newColumnKey, ...newColumn },
    ]);
    setShowModal(false);
  };

  const handleRemoveColumn = (columnKey) => {
    setColumns(columns.filter((col) => col.key !== columnKey));
    toast.success("Column deleted successfully");
  };

  const handleEditColumn = (column) => {
    setEditColumn({
      fieldName: column.label,
      isRequired: column.isRequired || false,
      isReadOnly: column.isReadOnly || false,
      fieldOwner: column.fieldOwner || "",
      key: column.key,
      fieldType: column.fieldType || "string",
    });
    setShowEditModal(true);
  };

  const handleEditModalSubmit = () => {
    const updatedColumns = columns.map((col) =>
      col.key === editColumn.key
        ? {
            ...col,
            label: editColumn.fieldName,
            isRequired: editColumn.isRequired,
            isReadOnly: editColumn.isReadOnly,
            fieldOwner: editColumn.fieldOwner,
            fieldType: editColumn.fieldType,
          }
        : col
    );
    setColumns(updatedColumns);
    setShowEditModal(false);
  };

  const handleShortTableChange = (updatedData) => {
    const defaultLabels = ["Freight Charge", "GST on Freight", "Realised GST"];
    const filteredData = updatedData.filter(
      (row) => !defaultLabels.includes(row.label)
    );
    setShortTableData([
      ...shortTableData.filter((row) => defaultLabels.includes(row.label)),
      ...filteredData,
    ]);
  };

  const handleShortTableInputClick = (row) => {
    setEditShortTableRow({
      ...row,
      fieldName: row.label,
      isRequired: row.isRequired || false,
      isReadOnly: row.isReadOnly || false,
      fieldOwner: row.fieldOwner || "",
    });
    setShowShortTableEditModal(true);
  };
  console.log("shortTableData :---", shortTableData, editShortTableRow);

  const handleShortTableEditModalSubmit = () => {
    if (editShortTableRow.label === "") {
      // Add new row
      setShortTableData([
        ...shortTableData,
        {
          label: editShortTableRow.fieldName,
          value: editShortTableRow.value,
          isRequired: editShortTableRow.isRequired,
          isReadOnly: editShortTableRow.isReadOnly,
          fieldOwner: editShortTableRow.fieldOwner,
        },
      ]);
    } else {
      // Update existing row
      const updatedShortTableData = shortTableData.map((row) =>
        row.label === editShortTableRow.label
          ? {
              ...editShortTableRow,
              label: editShortTableRow.fieldName,
              value: editShortTableRow.value,
            }
          : row
      );
      setShortTableData(updatedShortTableData);
    }
    setShowShortTableEditModal(false);
  };

  const handleAddShortTableRow = () => {
    setShowShortTableEditModal(true);
    setEditShortTableRow({
      label: "",
      value: "",
      fieldName: "",
      isRequired: false,
      isReadOnly: false,
      fieldOwner: "",
    });
  };

  const handleSubmit = async () => {
    try {
      const bidTemplateFields = shortTableData.map((row) => ({
        id: row.id, // Include ID for existing rows
        field_name: row.label,
        is_required: row.isRequired || false,
        is_read_only: row.isReadOnly || false,
        field_owner: row.fieldOwner || "admin",
        extra_fields: row.extra_fields || [],
      }));

      // Ensure required fields are included in the payload without duplicates
      const requiredFields = ["Warranty Clause", "Payment Terms", "Loading/Unloading"];
      requiredFields.forEach((field) => {
        if (!bidTemplateFields.some((row) => row.field_name === field)) {
          bidTemplateFields.push({
            field_name: field,
            is_required: false,
            is_read_only: false,
            field_owner: "admin",
            extra_fields: [],
          });
        }
      });

      const bidMaterialTemplateFields = columns.map((col) => ({
        id: col.id, // Include ID for existing columns
        field_name: col.label,
        is_required: col.isRequired || false,
        is_read_only: col.isReadOnly || false,
        field_owner: col.fieldOwner || "user",
        extra_fields: col.extra_fields || {},
      }));

      const payload = {
        event_template: {
          name: templateName,
          department_id: departmentName,
          bid_template_fields_attributes: bidTemplateFields,
          bid_material_template_fields_attributes: bidMaterialTemplateFields,
        },
      };

      const response = await axios.put(`${baseURL}/rfq/event_templates/${id}`, payload);

      if (response.status === 200) {
        toast.success("Template updated successfully!", { autoClose: 1000 });
        setTimeout(() => {
          navigate("/event-template-list");
        }, 1500);
      }

      console.log("Template updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating template:", error);
    }
  };

  return (
    <div className="website-content overflowY-auto">
      <div className="d-flex justify-content-between align-items-center px-4 py-2 bg-light border-bottom thead">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <a href="/" className="text-decoration-none text-primary">
                RFQ List
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Create Template
            </li>
          </ol>
        </nav>
        <h5 className="mt-3 ms-3">Create Template</h5>
        <div style={{ width: "15%" }}></div>
      </div>
      <div className="pt-3">
        <div className="module-data-section mx-3">
          <div className="card p-3 mt-3">
            <div className="row align-items-end justify-items-end mb-3 mt-3">
              <div className="col-md-4 col-sm-6 mt-0 mb-2">
                <div className="form-group">
                  <label className="po-fontBold">
                    Template Name <span style={{ color: "red" }}>*</span>
                  </label>
                </div>
                <input
                  className="form-control"
                  placeholder="Enter Template Name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>
              <div className="col-md-4 col-sm-6 mt-0 mb-2">
                <div className="form-group">
                  <label className="po-fontBold">
                    Department Name <span style={{ color: "red" }}>*</span>
                  </label>
                </div>
                <SelectBox
                  options={departmentOptions}
                  defaultValue={departmentName}
                  onChange={(value) => setDepartmentName(value)}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end align-items-center">
              <button className="purple-btn2 mt-3" onClick={handleAddColumn}>
                <span className="material-symbols-outlined align-text-top">
                  add{" "}
                </span>
                <span>Add Column for Bid Material</span>
              </button>
            </div>
            <Table
              columns={columns}
              data={[
                columns.reduce((acc, col) => {
                  acc[col.key] = (
                    <div className="d-flex align-items-center">
                      <button
                        className="purple-btn2 ms-2 rounded-circle p-0"
                        style={{
                          border: "none",
                          color: "white",
                          width: "25px",
                          height: "25px",
                        }}
                        onClick={() => handleEditColumn(col)}
                      >
                        <i className="bi bi-pencil" style={{ border: 0 }}></i>
                      </button>
                      <button
                        className="purple-btn2 ms-2 rounded-circle p-0"
                        style={{
                          border: "none",
                          color: "white",
                          width: "25px",
                          height: "25px",
                        }}
                        onClick={() => handleRemoveColumn(col.key)}
                      >
                        <i className="bi bi-trash" style={{ border: 0 }}></i>
                      </button>
                    </div>
                  );
                  return acc;
                }, {}),
              ]}
            />
            <div className="d-flex justify-content-end align-items-center">
              <button
                className="purple-btn2 mt-3"
                onClick={handleAddShortTableRow}
              >
                <span className="material-symbols-outlined align-text-top">
                  add
                </span>
                <span>Add Row for bid template</span>
              </button>
            </div>
            <div className="d-flex justify-content-end align-items-center">
              <ShortTable
                data={shortTableData}
                editable={true}
                onValueChange={handleShortTableChange}
                onInputClick={handleShortTableInputClick}
              />
            </div>
            <div className="d-flex justify-content-end align-items-center">
              <button className="purple-btn2 mt-3 " onClick={handleSubmit}>
                {/* <span className="material-symbols-outlined align-text-top">
                  save{" "}
                </span> */}
                <span>Update Template</span>
              </button>
            </div>
            <DynamicModalBox
              show={showModal}
              onHide={() => setShowModal(false)}
              title="Add New Column"
              footerButtons={[
                {
                  label: "Cancel",
                  onClick: () => setShowModal(false),
                },
                {
                  label: "Add Column",
                  onClick: handleModalSubmit,
                },
              ]}
            >
              <div className="form-group mt-3">
                <label>Field Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newColumn.fieldName}
                  onChange={(e) =>
                    setNewColumn({ ...newColumn, fieldName: e.target.value })
                  }
                  placeholder="Enter Field Name"
                />
              </div>
              <div className="form-group mt-3 d-flex align-items-base">
                <input
                  type="checkbox"
                  className="form-check-input me-1"
                  checked={newColumn.isRequired}
                  onChange={(e) =>
                    setNewColumn({ ...newColumn, isRequired: e.target.checked })
                  }
                />
                <label className="form-check-label">Is Required</label>
              </div>
              <div className="form-group mt-3 d-flex align-items-base">
                <input
                  type="checkbox"
                  className="form-check-input me-1"
                  checked={newColumn.isReadOnly}
                  onChange={(e) =>
                    setNewColumn({ ...newColumn, isReadOnly: e.target.checked })
                  }
                />
                <label className="form-check-label">Is Read Only</label>
              </div>
              <div className="form-group mt-3">
                <SelectBox
                  label={"Field Owner"}
                  options={[
                    { value: "Admin", label: "Admin" },
                    { value: "User", label: "User" },
                  ]}
                  defaultValue=""
                  onChange={(value) =>
                    setNewColumn({ ...newColumn, fieldOwner: value })
                  }
                />
              </div>
              <div className="form-group mt-3">
                <SelectBox
                  label={"Field Type"}
                  options={[
                    { value: "string", label: "String" },
                    { value: "integer", label: "Integer" },
                  ]}
                  defaultValue="string"
                  onChange={(value) =>
                    setNewColumn({ ...newColumn, fieldType: value })
                  }
                />
              </div>
            </DynamicModalBox>
            <DynamicModalBox
              show={showEditModal}
              onHide={() => setShowEditModal(false)}
              title="Edit Column"
              footerButtons={[
                {
                  label: "Cancel",
                  onClick: () => setShowEditModal(false),
                },
                {
                  label: "Save Changes",
                  onClick: handleEditModalSubmit,
                },
              ]}
            >
              <div className="form-group mt-3">
                <label>Field Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editColumn.fieldName}
                  onChange={(e) =>
                    setEditColumn({ ...editColumn, fieldName: e.target.value })
                  }
                  placeholder="Enter Field Value"
                />
              </div>
              <div className="form-group mt-3 d-flex align-items-base">
                <input
                  type="checkbox"
                  className="form-check-input me-1"
                  checked={editColumn.isRequired}
                  onChange={(e) =>
                    setEditColumn({
                      ...editColumn,
                      isRequired: e.target.checked,
                    })
                  }
                />
                <label className="form-check-label">Is Required</label>
              </div>
              <div className="form-group mt-3 d-flex align-items-base">
                <input
                  type="checkbox"
                  className="form-check-input me-1"
                  checked={editColumn.isReadOnly}
                  onChange={(e) =>
                    setEditColumn({
                      ...editColumn,
                      isReadOnly: e.target.checked,
                    })
                  }
                />
                <label className="form-check-label">Is Read Only</label>
              </div>
              <div className="form-group mt-3">
                <SelectBox
                  label={"Field Owner"}
                  options={[
                    { value: "Admin", label: "Admin" },
                    { value: "User", label: "User" },
                  ]}
                  defaultValue={editColumn.fieldOwner}
                  onChange={(value) =>
                    setEditColumn({ ...editColumn, fieldOwner: value })
                  }
                />
              </div>
              <div className="form-group mt-3">
                <SelectBox
                  label={"Field Type"}
                  options={[
                    { value: "string", label: "String" },
                    { value: "integer", label: "Integer" },
                  ]}
                  defaultValue={editColumn.fieldType}
                  onChange={(value) =>
                    setEditColumn({ ...editColumn, fieldType: value })
                  }
                />
              </div>
            </DynamicModalBox>
            <DynamicModalBox
              show={showShortTableEditModal}
              onHide={() => setShowShortTableEditModal(false)}
              title="Edit Short Table Row"
              footerButtons={[
                {
                  label: "Cancel",
                  onClick: () => setShowShortTableEditModal(false),
                },
                {
                  label: "Save Changes",
                  onClick: handleShortTableEditModalSubmit,
                },
              ]}
            >
              <div className="form-group mt-3">
                <div className="form-group mt-3">
                  <label>Field Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editShortTableRow.fieldName}
                    onChange={(e) =>
                      setEditShortTableRow({
                        ...editShortTableRow,
                        fieldName: e.target.value,
                      })
                    }
                    placeholder="Enter Field Name"
                  />
                </div>
                <div className="form-group mt-3 d-flex align-items-base">
                  <input
                    type="checkbox"
                    className="form-check-input me-1"
                    checked={editShortTableRow.isRequired}
                    onChange={(e) =>
                      setEditShortTableRow({
                        ...editShortTableRow,
                        isRequired: e.target.checked,
                      })
                    }
                  />
                  <label className="form-check-label">Is Required</label>
                </div>
                <div className="form-group mt-3 d-flex align-items-base">
                  <input
                    type="checkbox"
                    className="form-check-input me-1"
                    checked={editShortTableRow.isReadOnly}
                    onChange={(e) =>
                      setEditShortTableRow({
                        ...editShortTableRow,
                        isReadOnly: e.target.checked,
                      })
                    }
                  />
                  <label className="form-check-label">Is Read Only</label>
                </div>
                <div className="form-group mt-3">
                  <SelectBox
                    label={"Field Owner"}
                    options={[
                      { value: "Admin", label: "Admin" },
                      { value: "User", label: "User" },
                    ]}
                    defaultValue={editShortTableRow.fieldOwner}
                    onChange={(value) =>
                      setEditShortTableRow({
                        ...editShortTableRow,
                        fieldOwner: value,
                      })
                    }
                  />
                </div>
              </div>
            </DynamicModalBox>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
