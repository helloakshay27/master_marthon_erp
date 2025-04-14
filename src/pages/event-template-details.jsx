import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Table from "../components/base/Table/Table";
import ShortTable from "../components/base/Table/ShortTable";
import { DynamicModalBox } from "../components";
import SelectBox from "../components/base/Select/SelectBox";

export default function EventTemplateDetails() {
  const [templateDetails, setTemplateDetails] = useState(null);
  const [bidTemplateFields, setBidTemplateFields] = useState([]);
  const [showShortTableEditModal, setShowShortTableEditModal] = useState(false);
  const [bidMaterialTemplateFields, setBidMaterialTemplateFields] = useState(
    []
  );
  const [error, setError] = useState(null);
  const [editShortTableRow, setEditShortTableRow] = useState({
    label: "",
    value: "",
    fieldName: "",
    isRequired: false,
    isReadOnly: false,
    fieldOwner: "",
  });
  const id = useParams();
  console.log("id", id);

  const bid = [
    {
      id: 20,
      field_name: "Freight Charge",
      is_required: false,
      is_read_only: false,
      field_owner: "admin",
      extra_fields: null,
      created_at: "2025-03-21T15:24:31.446+05:30",
      updated_at: "2025-03-21T15:24:31.446+05:30",
    },
    {
      id: 21,
      field_name: "GST on Freight",
      is_required: false,
      is_read_only: false,
      field_owner: "admin",
      extra_fields: null,
      created_at: "2025-03-21T15:24:31.447+05:30",
      updated_at: "2025-03-21T15:24:31.447+05:30",
    },
    {
      id: 22,
      field_name: "Realised GST",
      is_required: false,
      is_read_only: false,
      field_owner: "admin",
      extra_fields: null,
      created_at: "2025-03-21T15:24:31.449+05:30",
      updated_at: "2025-03-21T15:24:31.449+05:30",
    },
    {
      id: 23,
      field_name: "Warranty Clause",
      is_required: false,
      is_read_only: false,
      field_owner: "admin",
      extra_fields: null,
      created_at: "2025-03-21T15:24:31.449+05:30",
      updated_at: "2025-03-21T15:24:31.449+05:30",
    },
    {
      id: 24,
      field_name: "Payment Terms",
      is_required: false,
      is_read_only: false,
      field_owner: "admin",
      extra_fields: null,
      created_at: "2025-03-21T15:24:31.450+05:30",
      updated_at: "2025-03-21T15:24:31.450+05:30",
    },
    {
      id: 25,
      field_name: "Loading/Unloading",
      is_required: false,
      is_read_only: false,
      field_owner: "admin",
      extra_fields: null,
      created_at: "2025-03-21T15:24:31.451+05:30",
      updated_at: "2025-03-21T15:24:31.451+05:30",
    },
  ];

  useEffect(() => {
    const fetchTemplateDetails = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/event_templates/${id.id}`
        );
        setTemplateDetails(response.data);
        setBidTemplateFields(response.data.bid_template_fields || []);
        console.log("bid_template_fields", response.data.bid_template_fields);

        setBidMaterialTemplateFields(
          response.data.bid_material_template_fields || []
        );
      } catch (err) {
        setError("Failed to fetch template details");
        console.error(err);
      }
    };

    fetchTemplateDetails();
  }, []);

  const renderTableColumns = () => {
    return [
      { key: "srNo", label: "Sr No." },
      { key: "field_name", label: "Field Name" },
    ];
  };

  const handleShortTableChange = (updatedFields) => {
    setBidTemplateFields(updatedFields);
  };

  const handleEditShortTableRow = (row) => {
    setEditShortTableRow({
      ...row,
      fieldName: row.label,
      isRequired: row.isRequired || false,
      isReadOnly: row.isReadOnly || false,
      fieldOwner: row.fieldOwner || "",
    });
    setShowShortTableEditModal(true);
  };
  const handleShortTableEditModalSubmit = () => {
    const updatedFields = bidTemplateFields.map((field) =>
      field.label === editShortTableRow.label
        ? {
            ...field,
            label: editShortTableRow.fieldName,
            isRequired: editShortTableRow.isRequired,
            isReadOnly: editShortTableRow.isReadOnly,
            fieldOwner: editShortTableRow.fieldOwner,
          }
        : field
    );

    setBidTemplateFields(updatedFields);
    updateBidTemplateFields(updatedFields);
    setShowShortTableEditModal(false);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!templateDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section">
          <div className="d-flex justify-content-between align-items-center px-4 py-2 bg-light border-bottom thead">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a href="/event-template-list" className="text-decoration-none text-primary">
                  Event Template List
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Event Template Details
                </li>
              </ol>
            </nav>
            <h5 className="mt-3 ms-3">Event Template Details </h5>
            <div style={{ width: "15%" }}></div>
          </div>
          {/* <h4 className="px-3">Event Template Details</h4> */}
          
          <div className="material-boxes mt-3">
            <div className="container-fluid ">
              <Table
                columns={renderTableColumns()}
                isMinWidth={true}
                data={bidMaterialTemplateFields}
                customRender={{
                  srNo: (cell, rowIndex) => <p>{rowIndex + 1}</p>,
                  field_name: (cell) => <p>{cell}</p>,
                }}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end">
            {console.log("bidTemplateFields", bidTemplateFields)}
            <ShortTable
              data={bidTemplateFields} // Ensure correct data is passed
              editable={true}
              onValueChange={handleShortTableChange}
              onInputClick={handleEditShortTableRow}
              onDeleteClick={(index) => {
                const updatedFields = bidTemplateFields.filter(
                  (_, i) => i !== index
                );
                setBidTemplateFields(updatedFields);
                updateBidTemplateFields(updatedFields);
              }}
            />
          </div>
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
          </DynamicModalBox>
        </div>
      </div>
    </div>
  );
}
