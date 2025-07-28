
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseURL } from "../confi/apiDomain";
import SingleSelector from "../components/base/Select/SingleSelector";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Button } from "react-bootstrap";

const LabourMaster = () => {
    const [pageSize, setPageSize] = useState(10);
     const [showModal, setShowModal] = useState(false);
    const [showOnlyPinned, setShowOnlyPinned] = useState(false);
    const [pinnedRows, setPinnedRows] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [settingShow, setSettingShow] = useState(false);
    const [show, setShow] = useState(false);
    const [activeSearch, setActiveSearch] = useState("");
    const [billEntries, setBillEntries] = useState([]);

    const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);

    const [formData, setFormData] = useState({
  labour_code: "",
  contractor_name: "",
  labour_sub_type: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  dob: "",
  phone_number: "",
  job_title: "",
  labour_category: "",
  work_shifts: "",
  availability: "",
  employment_status: "",
  bank_account_name: "",
  bank_account_no: "",
  bank_branch_name: "",
  ifsc_code: "",
  union_memberships: "",
  hourly_rate: "",
  overtime_rate: "",
  address: "",
  department: "",
  supervisor: "",
  hire_date: "",
  certifications: "",
  license_info: "",
  documents: "",   // assuming dropdown value
  photo: null      // for file input
});



const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleFileChange = (e, fieldName) => {
  const file = e.target.files[0];
  if (file) {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
  }
};

    //   column sort and setting
    const [columnVisibility, setColumnVisibility] = useState({
        sr_no: true,
        labour_code: true,
        contractor_name: true,
        labour_sub_type: true,
        first_name: true,
        last_name: true,
        middle_name: true,
        dob: true,
        phone_number: true,
        job_title: true,
        labour_category: true,
        work_shifts: true,
        availability: true,
        employment_status: true,
        bank_account_name: true,
        bank_account_no: true,
        bank_branch_name: true,
        ifsc_code: true,
        union_memberships: true,
        hourly_rate: true,
        overtime_rate: true,
        address: true,
        department: true,
        supervisor: true,
        hire_date: true,
        certifications: true,
        photo: true,
        documents: true,
        license_info: true,
        action: true,
    });

    const allColumns = [
        { field: "sr_no", headerName: "Sr No.", width: 100 },
        { field: "labour_code", headerName: "Labour Code/ID", width: 150 },
        { field: "contractor_name", headerName: "Contractor Name", width: 180 },
        { field: "labour_sub_type", headerName: "Labour Sub-Type", width: 150 },
        { field: "first_name", headerName: "First Name", width: 130 },
        { field: "last_name", headerName: "Last Name", width: 130 },
        { field: "middle_name", headerName: "Middle Name", width: 130 },
        { field: "dob", headerName: "Date of Birth", width: 150 },
        { field: "phone_number", headerName: "Phone Number", width: 150 },
        { field: "job_title", headerName: "Job Title/Position", width: 180 },
        { field: "labour_category", headerName: "Labour Category", width: 150 },
        { field: "work_shifts", headerName: "Work Shifts", width: 130 },
        { field: "availability", headerName: "Availability", width: 130 },
        { field: "employment_status", headerName: "Employment Status", width: 180 },
        { field: "bank_account_name", headerName: "Bank Account Name", width: 180 },
        { field: "bank_account_no", headerName: "Bank Account No.", width: 170 },
        { field: "bank_branch_name", headerName: "Bank Branch Name", width: 170 },
        { field: "ifsc_code", headerName: "Bank Branch IFSC Code", width: 170 },
        { field: "union_memberships", headerName: "Union Memberships", width: 180 },
        { field: "hourly_rate", headerName: "Hourly Rate/Salary", width: 170 },
        { field: "overtime_rate", headerName: "Overtime Rate", width: 150 },
        { field: "address", headerName: "Address", width: 200 },
        { field: "department", headerName: "Department", width: 150 },
        { field: "supervisor", headerName: "Supervisor", width: 150 },
        { field: "hire_date", headerName: "Hire Date", width: 150 },
        { field: "certifications", headerName: "Equipment Certifications", width: 200 },
        { field: "photo", headerName: "Photo", width: 120 },
        { field: "documents", headerName: "Documents", width: 150 },
        { field: "license_info", headerName: "License/Permit Information", width: 200 },
        {
            field: "action",
            headerName: "Action",
            width: 100,
            renderCell: (params) => (
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(params.row.id)}>
                    Delete
                </button>
            ),
        },


    ];

    const columns = allColumns.filter((col) => columnVisibility[col.field]);

    const handleSettingClose = () => setSettingShow(false);
    // const handleClose = () => setShow(false);
    const handleSettingModalShow = () => setSettingShow(true);
    const handleModalShow = () => setShow(true);

    const handleToggleColumn = (field) => {
        setColumnVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleShowAll = () => {
        const updatedVisibility = allColumns.reduce((acc, column) => {
            acc[column.field] = true;
            return acc;
        }, {});
        setColumnVisibility(updatedVisibility);
    };

    const handleHideAll = () => {
        const updatedVisibility = allColumns.reduce((acc, column) => {
            acc[column.field] = false;
            return acc;
        }, {});
        setColumnVisibility(updatedVisibility);
    };

    const handleResetColumns = () => {
        const defaultVisibility = allColumns.reduce((acc, column) => {
            acc[column.field] = true;
            return acc;
        }, {});
        setColumnVisibility(defaultVisibility);
    };

    const getTransformedRows = () => {
        let rowsToShow = showOnlyPinned
            ? billEntries.filter((row) => pinnedRows.includes(row.id))
            : billEntries;

        // const normalizedSearchTerm = searchKeyword.trim().toLowerCase();
        // if (normalizedSearchTerm) {
        //     rowsToShow = rowsToShow.filter((item) =>
        //         Object.values(item).some(
        //             (value) =>
        //                 value && String(value).toLowerCase().includes(normalizedSearchTerm)
        //         )
        //     );
        // }

        return rowsToShow;
    };

    const labourCategoryOptions = [
  { value: "Skilled", label: "Skilled" },
  { value: "Unskilled", label: "Unskilled" },
  { value: "Semi-skilled", label: "Semi-skilled" },
  { value: "Supervisor", label: "Supervisor" },
  { value: "Technician", label: "Technician" },
  { value: "Engineer", label: "Engineer" },
  { value: "Foreman", label: "Foreman" },
  { value: "Operator", label: "Operator" },
  { value: "Helper", label: "Helper" },
  { value: "Electrician", label: "Electrician" },
];
const availabilityOptions = [
  { value: "available", label: "Available" },
  { value: "not_available", label: "Not Available" },
  { value: "on_leave", label: "On Leave" },
  { value: "in_training", label: "In Training" },
  { value: "on_duty", label: "On Duty" }
];
const employmentStatusOptions = [
  { value: "permanent", label: "Permanent" },
  { value: "contract", label: "Contract" },
  { value: "probation", label: "Probation" },
  { value: "intern", label: "Intern" },
  { value: "terminated", label: "Terminated" }
];
    return (
        <>
            <style type="text/css">
                {`.tbl-container {

height: auto !important;
max-height: 100% !important;

}
.css-5n0k77:last-child{
display:none !important;
}
.MuiDataGrid-cell, .MuiDataGrid-cell > div {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  max-width: 100% !important;
  display: block !important;
}
        `}
            </style>

            <div className="website-content overflow-auto">
                <div className="module-data-section p-4">
                    <a href="#">Setup &gt; Purchase Setup &gt; Labour Master</a>
                    <h5 className="mt-4">Labour Master</h5>

                    <div className="card mt-5 pb-4">
                        <div className="d-flex justify-content-end ">
                            <div className="card-tools">
                                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={handleOpen}>
                                    <i className="bi bi-plus"></i> Add
                                </button>
                            </div>
                        </div>

                        <div className="tbl-container  mt-3">
                            <table className="w-100">
                                <thead>
                                    <tr>
                                        <th>Sr No.</th>
                                        <th>Labour Code/ID</th>
                                        <th>Contractor Name</th>
                                        <th>Labour Sub-Type</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Middle Name</th>
                                        <th>Date of Birth</th>
                                        <th>Phone Number</th>
                                        <th>Job Title/Position</th>
                                        <th>Labour Category</th>
                                        <th>Work Shifts</th>
                                        <th>Availability</th>
                                        <th>Employment Status</th>
                                        <th>Bank Account Name</th>
                                        <th>Bank Account No.</th>
                                        <th>Bank Branch Name</th>
                                        <th>Bank Branch IFSC Code</th>
                                        <th>Union Memberships</th>
                                        <th>Hourly Rate/Salary</th>
                                        <th>Overtime Rate</th>
                                        <th>Address</th>
                                        <th>Department</th>
                                        <th>Supervisor</th>
                                        <th>Hire Date</th>
                                        <th>Equipment Certifications</th>
                                        <th>Photo</th>
                                        <th>Documents</th>
                                        <th>License/Permit Information</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2].map((num) => (
                                        <tr key={num} data-bs-toggle="modal" data-bs-target="#readOnlyModal">
                                            <td>{num}</td>
                                            {Array(28).fill(null).map((_, i) => (
                                                <td key={i}></td>
                                            ))}
                                            <td>
                                                <div className="d-flex justify-content-center gap-2">
                                                    <img src="../Data_Mapping/img/Green_check.svg" alt="Check" />
                                                    <img src="../Data_Mapping/img/Edit.svg" alt="Edit" data-bs-toggle="modal" data-bs-target="#exampleModal" />
                                                    <img src="../Data_Mapping/img/Delete_red.svg" alt="Delete" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* data grid start */}

                        <div
                            className="mt-3 mx-3"
                            style={{
                                //   width: "100%",
                                //   height: "430px",
                                //   boxShadow: "unset",
                                overflowY: "hidden",
                            }}
                        >
                            <DataGrid
                                rows={getTransformedRows()}
                                columns={columns}
                                pageSize={pageSize}
                                autoHeight={true}
                                // getRowId={(row) => row.id}
                                getRowId={(row) => {
                                    //   console.log("Row ID:", row.id);
                                    return row.id;
                                }}
                                loading={false}
                                disableSelectionOnClick
                                // checkboxSelection // <-- enables checkboxes and select all
                                //  checkboxSelection={!!fromStatus} //
                                // selectionModel={selectedBoqDetails}
                                //   onSelectionModelChange={(ids) => setSelectedBoqDetails(ids)}
                                onSelectionModelChange={(ids) => {
                                    setSelectedBoqDetails(ids.map(String));
                                    console.log("Selected Row IDs:", ids); // This will log the selected row ids array
                                }}
                                onRowSelectionModelChange={(ids) => {
                                    setSelectedBoqDetails(ids);
                                    console.log("Selected Row IDs: 2", ids);
                                }}
                                components={{
                                    ColumnMenu: () => null,
                                }}
                                localeText={{
                                    noRowsLabel: "No data available",
                                }}
                                sx={{
                                    "& .MuiDataGrid-columnHeaders": {
                                        backgroundColor: "#f8f9fa",
                                        color: "#000",
                                        fontWeight: "bold",
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 1,
                                    },
                                    "& .MuiDataGrid-cell": {
                                        borderColor: "#dee2e6",
                                    },
                                    "& .MuiDataGrid-columnHeader": {
                                        borderColor: "#dee2e6",
                                    },
                                    // Red color for checked checkboxes
                                    "& .MuiCheckbox-root.Mui-checked .MuiSvgIcon-root": {
                                        color: "#8b0203",
                                    },
                                    // Black for header (select all) checkbox, even when checked
                                    "& .MuiDataGrid-columnHeader .MuiCheckbox-root .MuiSvgIcon-root":
                                    {
                                        color: "#fff",
                                    },
                                    // Make checkboxes smaller
                                    "& .MuiCheckbox-root .MuiSvgIcon-root": {
                                        fontSize: "1.1rem", // adjust as needed (default is 1.5rem)
                                    },
                                    // // Hide vertical scrollbar
                                    // "& .MuiDataGrid-virtualScroller": {
                                    //   overflowY: "hidden !important",
                                    // },
                                }}
                            />
                        </div>

                        {/* data grid end */}
                    </div>
                </div>

                
            </div>


            <Modal centered size="xl" show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <h5>Labour Master</h5>
  </Modal.Header>
  <Modal.Body>


<div className="row">
  <div className="col-md-4 mb-3">
    <label>Labour Code <span>*</span></label>
    <input type="text" name="labour_code" value={formData.labour_code} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Contractor Name <span>*</span></label>
    <input type="text" name="contractor_name" value={formData.contractor_name} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Labour Sub Type <span>*</span></label>
    <input type="text" name="labour_sub_type" value={formData.labour_sub_type} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>First Name <span>*</span></label>
    <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Last Name <span>*</span></label>
    <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Middle Name <span>*</span></label>
    <input type="text" name="middle_name" value={formData.middle_name} onChange={handleInputChange} className="form-control" />
  </div>
  
  <div className="col-md-4 mb-3">
    <label>Date of Birth</label>
    <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Phone Number</label>
    <input type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Job Title/Position <span>*</span></label>
    <input type="text" name="job_title" value={formData.job_title} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Labour Category <span>*</span></label>
     <SingleSelector
    options={labourCategoryOptions}
    value={labourCategoryOptions.find(option => option.value === formData.labour_category) || null}
    onChange={(selectedOption) =>
      handleInputChange({
        target: { name: "labour_category", value: selectedOption?.value || "" },
      })
    }
    placeholder="Select Labour Category"
  />
  </div>
  <div className="col-md-4 mb-3">
    <label>Work Shifts <span>*</span></label>
    <input type="text" name="work_shifts" value={formData.work_shifts} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Availability <span>*</span></label>
     <SingleSelector
    options={availabilityOptions}
    value={
      availabilityOptions.find(
        (option) => option.value === formData.availability
      ) || null
    }
    onChange={(selectedOption) =>
      handleInputChange({
        target: { name: "availability", value: selectedOption?.value || "" },
      })
    }
    placeholder="Select Availability"
  />
    
  </div>
  <div className="col-md-4 mb-3">
    <label>Employment Status <span>*</span></label>
     <SingleSelector
    options={employmentStatusOptions}
    value={
      employmentStatusOptions.find(
        (option) => option.value === formData.employment_status
      ) || null
    }
    onChange={(selectedOption) =>
      handleInputChange({
        target: {
          name: "employment_status",
          value: selectedOption?.value || "",
        },
      })
    }
    placeholder="Select Employment Status"
  />
    
  </div>
  <div className="col-md-4 mb-3">
    <label>Bank Account Name <span>*</span></label>
    <input type="text" name="bank_account_name" value={formData.bank_account_name} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Bank Account No <span>*</span></label>
    <input type="text" name="bank_account_no" value={formData.bank_account_no} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Bank Branch Name <span>*</span></label>
    <input type="text" name="bank_branch_name" value={formData.bank_branch_name} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Bank Branch IFSC Code <span>*</span></label>
    <input type="text" name="ifsc_code" value={formData.ifsc_code} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Union Memberships <span>*</span></label>
    <input type="text" name="union_memberships" value={formData.union_memberships} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Hourly Rate/Salary <span>*</span></label>
    <input type="number" name="hourly_rate" value={formData.hourly_rate} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Overtime Rate <span>*</span></label>
    <input type="number" name="overtime_rate" value={formData.overtime_rate} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Address <span>*</span></label>
    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Department</label>
    <input type="text" name="department" value={formData.department} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Supervisor</label>
    <input type="text" name="supervisor" value={formData.supervisor} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Hire Date</label>
    <input type="date" name="hire_date" value={formData.hire_date} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Certifications</label>
    <input type="text" name="certifications" value={formData.certifications} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>License Info</label>
    <input type="text" name="license_info" value={formData.license_info} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="col-md-4 mb-3">
    <label>Documents</label>
    <select name="documents" value={formData.documents} onChange={handleInputChange} className="form-control">
      <option value="">Select</option>
      <option value="aadhar">Aadhar Card</option>
      <option value="pan">PAN Card</option>
      <option value="dl">Driving License</option>
    </select>
  </div>
  <div className="col-md-4 mb-3">
    <label>Photo</label>
    <input type="file" name="photo" onChange={(e) => handleFileChange(e, "photo")} className="form-control" />
  </div>
</div>

 <div className="row mt-2 justify-content-center mt-5">
                                <div className="col-md-3 mt-2">
                                    <button className="purple-btn2 w-100" 
                                    // onClick={handleCreate}
                                    >Create</button>
                                </div>
                                <div className="col-md-3">
                                    <button type="button" className="purple-btn1 w-100" data-bs-dismiss="modal" aria-label="Close"
                                        // onClick={() => {
                                        //     setShowModal(false);
                                        //     setEditRowIndex(null); // <-- Reset here too
                                        // }}
                                        >Cancel</button>
                                </div>
                            </div>
                        


  </Modal.Body>
</Modal>


  {/* Settings Modal */}
      <Modal
        show={settingShow}
        onHide={handleSettingClose}
        dialogClassName="modal-right"
        className="setting-modal"
        backdrop={true}
      >
        <Modal.Header>
          <div className="container-fluid p-0">
            <div className="border-0 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn"
                  aria-label="Close"
                  onClick={handleSettingClose}
                >
                  <svg
                    width="10"
                    height="16"
                    viewBox="0 0 10 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 2L2 8L8 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <Button
                style={{ textDecoration: "underline" }}
                variant="alert"
                onClick={handleResetColumns}
              >
                Reset
              </Button>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body style={{ height: "400px", overflowY: "auto" }}>
          {allColumns
            .filter(
              (column) => column.field !== "srNo" && column.field !== "Star"
            )
            .map((column) => (
              <div
                className="row justify-content-between align-items-center mt-2"
                key={column.field}
              >
                <div className="col-md-6">
                  <button type="submit" className="btn btn-md">
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={22}
                      height={22}
                      viewBox="0 0 48 48"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19 10C19 11.0609 18.5786 12.0783 17.8284 12.8284C17.0783 13.5786 16.0609 14 15 14C13.9391 14 12.9217 13.5786 12.1716 12.8284C11.4214 12.0783 11 11.0609 11 10C11 8.93913 11.4214 7.92172 12.1716 7.17157C12.9217 6.42143 13.9391 6 15 6C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10ZM15 28C16.0609 28 17.0783 27.5786 17.8284 26.8284C18.5786 26.0783 19 25.0609 19 24C19 22.9391 18.5786 21.9217 17.8284 21.1716C17.0783 20.4214 16.0609 20 15 20C13.9391 20 12.9217 20.4214 12.1716 21.1716C11.4214 21.9217 11 22.9391 11 24C11 25.0609 11.4214 26.0783 12.1716 26.8284C12.9217 27.5786 13.9391 28 15 28ZM15 42C16.0609 42 17.0783 41.5786 17.8284 40.8284C18.5786 40.0783 19 39.0609 19 38C19 36.9391 18.5786 35.9217 17.8284 35.1716C17.0783 34.4214 16.0609 34 15 34C13.9391 34 12.9217 34.4214 12.1716 35.1716C11.4214 35.9217 11 36.9391 11 38C11 39.0609 11.4214 40.0783 12.1716 40.8284C12.9217 41.5786 13.9391 42 15 42ZM37 10C37 11.0609 36.5786 12.0783 35.8284 12.8284C35.0783 13.5786 34.0609 14 33 14C31.9391 14 30.9217 13.5786 30.1716 12.8284C29.4214 12.0783 29 11.0609 29 10C29 8.93913 29.4214 7.92172 30.1716 7.17157C30.9217 6.42143 31.9391 6 33 6C34.0609 6 35.0783 6.42143 35.8284 7.17157C36.5786 7.92172 37 8.93913 37 10ZM33 28C34.0609 28 35.0783 27.5786 35.8284 26.8284C36.5786 26.0783 37 25.0609 37 24C37 22.9391 36.5786 21.9217 35.8284 21.1716C35.0783 20.4214 34.0609 20 33 20C31.9391 20 30.9217 20.4214 30.1716 21.1716C29.4214 21.9217 29 22.9391 29 24C29 25.0609 29.4214 26.0783 30.1716 26.8284C30.9217 27.5786 31.9391 28 33 28ZM33 42C34.0609 42 35.0783 41.5786 35.8284 40.8284C36.5786 40.0783 37 39.0609 37 38C37 36.9391 36.5786 35.9217 35.8284 35.1716C35.0783 34.4214 34.0609 34 33 34C31.9391 34 30.9217 34.4214 30.1716 35.1716C29.4214 35.9217 29 36.9391 29 38C29 39.0609 29.4214 40.0783 30.1716 40.8284C30.9217 41.5786 31.9391 42 33 42Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  <label>{column.headerName}</label>
                </div>
                <div className="col-md-4">
                  <div className="form-check form-switch mt-1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={columnVisibility[column.field]}
                      onChange={() => handleToggleColumn(column.field)}
                      role="switch"
                      id={`flexSwitchCheckDefault-${column.field}`}
                    />
                  </div>
                </div>
              </div>
            ))}
        </Modal.Body>

        <Modal.Footer>
          <button className="purple-btn2" onClick={handleShowAll}>
            Show All
          </button>
          <button className="purple-btn1" onClick={handleHideAll}>
            Hide All
          </button>
        </Modal.Footer>
      </Modal>

        </>
    );
};

export default LabourMaster;
