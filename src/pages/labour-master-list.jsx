
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseURL } from "../confi/apiDomain";
import SingleSelector from "../components/base/Select/SingleSelector";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LabourMaster = () => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showOnlyPinned, setShowOnlyPinned] = useState(false);
  const [pinnedRows, setPinnedRows] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [settingShow, setSettingShow] = useState(false);
  const [show, setShow] = useState(false);
  const [activeSearch, setActiveSearch] = useState("");
  const [labourList, setLabourList] = useState([]);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Or any number you prefer

  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);


  const [labours, setLabours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414";
    const fetchLabours = async () => {
      try {
        const response = await axios.get(
          `${baseURL}labours.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        setLabours(response.data.labours);
        
        setLoading(false);
      } catch (err) {
        setError("Failed to load labour list.");
        setLoading(false);
      }
    };

    fetchLabours();
  }, []);

  console.log("res:",labours)


 



 

 
  //   column sort and setting
  const [columnVisibility, setColumnVisibility] = useState({
    sr_no: true,
    labour_code: true,
    contractor_name: true,
    labour_sub_type: true,
    firstname: true,
    lastname: true,
    middlename: true,
    date_of_birth: true,
    phone_no: true,
    job_title: true,
    labour_category: true,
    work_shift: true,
    availability: true,
    employment_status: true,
    bank_name: true,
    account_number: true,
    branch_name: true,
    ifsc_code: true,
    union_membership: true,
    hourly_rate: true,
    overtime_rate: true,
    address: true,
    department: true,
    supervisor: true,
    hire_date: true,
    certifications: true,
    // photo: true,
    // documents: true,
    license_info: true,
    action: true,
  });

  const allColumns = [
    { field: "sr_no", headerName: "Sr No.", width: 100 },
    { field: "labour_code", headerName: "Labour Code/ID", width: 150 },
    { field: "contractor_name", headerName: "Contractor Name", width: 180 },
    { field: "labour_sub_type", headerName: "Labour Sub-Type", width: 150 },
    { field: "firstname", headerName: "First Name", width: 130 },
    { field: "lastname", headerName: "Last Name", width: 130 },
    { field: "middlename", headerName: "Middle Name", width: 130 },
    { field: "date_of_birth", headerName: "Date of Birth", width: 150 ,
       renderCell: (params) => {
    if (!params.value) return ""; // handle empty/null

    const date = new Date(params.value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formatted = `${day}-${month}-${year}`;

    return <span>{formatted}</span>;
  },
    },
    { field: "phone_no", headerName: "Phone Number", width: 150 },
    { field: "job_title", headerName: "Job Title/Position", width: 180 },
    { field: "labour_category", headerName: "Labour Category", width: 150 },
    { field: "work_shift", headerName: "Work Shifts", width: 130 },
    { field: "availability", headerName: "Availability", width: 130 },
    { field: "employment_status", headerName: "Employment Status", width: 180 },
    { field: "bank_name", headerName: "Bank Account Name", width: 180 },
    { field: "account_number", headerName: "Bank Account No.", width: 170 },
    { field: "branch_name", headerName: "Bank Branch Name", width: 170 },
    { field: "ifsc_code", headerName: "Bank Branch IFSC Code", width: 170 },
    { field: "union_membership", headerName: "Union Memberships", width: 180 },
    { field: "hourly_rate", headerName: "Hourly Rate/Salary", width: 170 },
    { field: "overtime_rate", headerName: "Overtime Rate", width: 150 },
    { field: "address", headerName: "Address", width: 200 },
    { field: "department", headerName: "Department", width: 150 },
    { field: "supervisor", headerName: "Supervisor", width: 150 },
    { field: "hire_date", headerName: "Hire Date", width: 150 },
    { field: "certifications", headerName: "Equipment Certifications", width: 200 },
    // { field: "photo", headerName: "Photo", width: 120 },
    // { field: "documents", headerName: "Documents", width: 150 },
    { field: "license_info", headerName: "License/Permit Information", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <>
          <button className="btn mt-0 pt-0" onClick={() => handleDelete(params.row.id)}>
            <svg
              width="16"
              height="20"
              viewBox="0 0 16 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.7921 2.44744H10.8778C10.6485 1.0366 9.42966 0 8.00005 0C6.57044 0 5.35166 1.03658 5.12225 2.44744H1.20804C0.505736 2.48655 -0.0338884 3.08663 0.00166019 3.78893V5.26379C0.00166019 5.38914 0.0514441 5.51003 0.140345 5.59895C0.229246 5.68787 0.35015 5.73764 0.475508 5.73764H1.45253V17.2689C1.45253 18.4468 2.40731 19.4025 3.58612 19.4025H12.4139C13.5927 19.4025 14.5475 18.4468 14.5475 17.2689V5.73764H15.5245C15.6498 5.73764 15.7707 5.68785 15.8597 5.59895C15.9486 5.51005 15.9983 5.38914 15.9983 5.26379V3.78893C16.0339 3.08663 15.4944 2.48654 14.7921 2.44744ZM8.00005 0.94948C8.90595 0.94948 9.69537 1.56823 9.91317 2.44744H6.08703C6.30483 1.56821 7.09417 0.94948 8.00005 0.94948ZM13.5998 17.2688C13.5998 17.5835 13.4744 17.8849 13.2522 18.1072C13.0299 18.3294 12.7285 18.4539 12.4138 18.4539H3.58608C2.93089 18.4539 2.40017 17.9231 2.40017 17.2688V5.73762H13.5998L13.5998 17.2688ZM15.0506 4.78996H0.949274V3.78895C0.949274 3.56404 1.08707 3.39512 1.20797 3.39512H14.792C14.9129 3.39512 15.0507 3.56314 15.0507 3.78895L15.0506 4.78996ZM4.91788 16.5533V7.63931C4.91788 7.37706 5.13035 7.16548 5.3926 7.16548C5.65396 7.16548 5.86643 7.37706 5.86643 7.63931V16.5533C5.86643 16.8147 5.65396 17.0271 5.3926 17.0271C5.13035 17.0271 4.91788 16.8147 4.91788 16.5533ZM7.52531 16.5533L7.5262 7.63931C7.5262 7.37706 7.73778 7.16548 8.00003 7.16548C8.26228 7.16548 8.47386 7.37706 8.47386 7.63931V16.5533C8.47386 16.8147 8.26228 17.0271 8.00003 17.0271C7.73778 17.0271 7.5262 16.8147 7.5262 16.5533H7.52531ZM10.1327 16.5533L10.1336 7.63931C10.1336 7.37706 10.3461 7.16548 10.6075 7.16548C10.8697 7.16548 11.0822 7.37706 11.0822 7.63931V16.5533C11.0822 16.8147 10.8697 17.0271 10.6075 17.0271C10.3461 17.0271 10.1336 16.8147 10.1336 16.5533H10.1327Z"
                fill="#B25657"
              />
            </svg>
          </button>



          <span
            onClick={() => handleEdit(params.row)} // Pass the whole row for editing
            style={{ cursor: "pointer", marginLeft: 8 }}
          >
            {/* Edit */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"></path></svg>
          </span>
        </>
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
    // let rowsToShow = showOnlyPinned
    //   ? labourList.filter((row) => pinnedRows.includes(row.id))
    //   : labourList;

    return labours.map((item, index) => ({
      ...item,
      sr_no: index + 1,
      
      // documents: item.document_upload ? `${item.documents} - ${item.document_upload.fileName}` : "-",
    }));
    return rowsToShow;
  };

 
 
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



          {/* {labourList.map((row, idx) => (
            <pre key={idx}>{JSON.stringify(row, null, 2)}</pre>
          ))} */}
          <div className="card mt-5 pb-4">
            {/* data grid start */}
            <div className="d-flex justify-content-end mx-2 mt-4 mb-2">
              {/* <button className="purple-btn2">Bulk Upload</button> */}
              <button
                className="purple-btn2 me-2"
                data-bs-toggle="modal"
                data-bs-target="#addnewModal"
                // onClick={() => setShowModal(true)}
                // onClick={handleOpen}
              // onClick={() => {
              //     // setFieldErrors({});
              //     // setShowModal(true);
              //     handleOpen
              // }}
              onClick={() => navigate("/labour-master-create")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="white"
                  className="bi bi-plus"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                </svg>
                <span>Add</span>
              </button>
            </div>
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
                // onSelectionModelChange={(ids) => {
                //   setSelectedBoqDetails(ids.map(String));
                //   console.log("Selected Row IDs:", ids); // This will log the selected row ids array
                // }}
                // onRowSelectionModelChange={(ids) => {
                //   setSelectedBoqDetails(ids);
                //   console.log("Selected Row IDs: 2", ids);
                // }}
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


      {/* <Modal centered size="xl" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <h5><span>Labour Master</span></h5>
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
              <label>Department <span>*</span></label>
              <SingleSelector
                options={departmentOptions}
                value={
                  departmentOptions.find(
                    (option) => option.value === formData.department
                  ) || null
                }
                onChange={(selectedOption) =>
                  handleInputChange({
                    target: {
                      name: "department",
                      value: selectedOption?.value || "",
                    },
                  })
                }
                placeholder="Select Department"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label>Supervisor <span>*</span></label>
              <SingleSelector
                options={supervisorOptions}
                value={
                  supervisorOptions.find(
                    (option) => option.value === formData.supervisor
                  ) || null
                }
                onChange={(selectedOption) =>
                  handleInputChange({
                    target: {
                      name: "supervisor",
                      value: selectedOption?.value || "",
                    },
                  })
                }
                placeholder="Select Supervisor"
              />

            </div>
            <div className="col-md-4 mb-3">
              <label>Hire Date <span>*</span></label>
              <input type="date" name="hire_date" value={formData.hire_date} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="col-md-4 mb-3">
              <label>Equipment Certifications  <span>*</span></label>
              <input type="text" name="certifications" value={formData.certifications} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="col-md-4 mb-3">
              <label>Photo  <span>*</span></label>
              <input type="file" name="photo" onChange={(e) => handleFileChange(e, "photo")} className="form-control" />
            </div>
            <div className="col-md-4 mb-3">
              <label>Documents <span>*</span></label>
              <SingleSelector
                options={documentOptions}
                value={
                  documentOptions.find(
                    (option) => option.value === formData.documents
                  ) || null
                }
                onChange={(selectedOption) =>
                  handleInputChange({
                    target: {
                      name: "documents",
                      value: selectedOption?.value || "",
                    },
                  })
                }
                placeholder="Select Document"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Documents Upload <span>*</span></label>
              <input
                type="file"
                name="document"
                onChange={(e) => handleFileChange(e, "document_upload")}
                className="form-control"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label>License/Permit Information <span>*</span></label>
              <input type="text" name="license_info" value={formData.license_info} onChange={handleInputChange} className="form-control" />
            </div>


          </div>

          <div className="row mt-2 justify-content-center mt-5">
            <div className="col-md-3 mt-2">
              <button className="purple-btn2 w-100"
                onClick={handleCreate}
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
      </Modal> */}


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
