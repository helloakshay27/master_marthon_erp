import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";

import { Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useParams } from "react-router-dom";

import SingleSelector from "../components/base/Select/SingleSelector";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
const MaterialQCCreate = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const [showRows, setShowRows] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [pageSize, setPageSize] = useState(5);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companies, setCompanies] = useState([]);

    // tax table functionality

    const handleProjectChange = (value) => {
        setSelectedProject(value);
        setSelectedSite(null);
        setSites(
            value?.sites?.map((site) => ({
                value: site.id,
                label: site.name,
            })) || []
        );
    };

    const handleSiteChange = (value) => {
        setSelectedSite(value);
    };

    const handleCompanyChange = (selectedOption) => {
        setSelectedCompany(selectedOption);
        setSelectedProject(null);
        setSelectedSite(null);
        setProjects(
            selectedOption?.projects?.map((project) => ({
                value: project.id,
                label: project.name,
                sites: project.pms_sites,
            })) || []
        );
        setSites([]);
    };

    const fetchProjects = async (companyId) => {
        try {
            const response = await axios.get(
                `${baseURL}projects.json?token=${token}&q[company_id_eq]=${companyId}`
            );
            setProjects(
                response.data.projects.map((project) => ({
                    value: project.id,
                    label: project.name,
                }))
            );
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const fetchSites = async (projectId) => {
        try {
            const response = await axios.get(
                `${baseURL}sites.json?token=${token}&q[project_id_eq]=${projectId}`
            );
            setSites(
                response.data.sites.map((site) => ({
                    value: site.id,
                    label: site.name,
                }))
            );
        } catch (error) {
            console.error("Error fetching sites:", error);
        }
    };

    useEffect(() => {
        if (selectedProject?.value) {
            fetchSites(selectedProject.value);
        }
    }, [selectedProject]);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get(
                `${baseURL}pms/company_setups.json?token=${token}`
            );
            const formattedCompanies = response?.data.companies.map((company) => ({
                value: company.id,
                label: company.company_name,
                projects: company.projects,
            }));
            setCompanies(formattedCompanies);
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        if (selectedCompany?.value) {
            fetchProjects(selectedCompany.value);
        }
    }, [selectedCompany]);

    

    const statusOptions = [
        {
            label: "Select Status",
            value: "",
        },
        {
            label: "Draft",
            value: "draft",
        },

        {
            label: "Submitted",
            value: "submitted",
        },
    ];

    const [status, setStatus] = useState("");
    const [remark, setRemark] = useState("");
    const [comment, setComment] = useState("");
    //   console.log("status:", status)
    // Step 2: Handle status change
    const handleStatusChange = (selectedOption) => {
        // setStatus(e.target.value);
        setStatus(selectedOption.value);
        // handleStatusChange(selectedOption); // Handle status change
    };

    // Step 3: Handle remark change
    const handleRemarkChange = (e) => {
        setRemark(e.target.value);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const [remark2, setRemark2] = useState("");
    // Step 3: Handle remark change
    const handleRemarkChange2 = (e) => {
        setRemark2(e.target.value);
    };


    // attachment like mor******
    const [attachments, setAttachments] = useState([

    ]);

    const getLocalDateTime = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset(); // in minutes
        const localDate = new Date(now.getTime() - offset * 60000);
        return localDate.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:MM"

    };

    const handleAddRow = () => {
        setAttachments((prev) => [
            ...prev,
            {
                id: Date.now(),
                fileType: "",
                fileName: "",
                uploadDate: getLocalDateTime(),
                fileUrl: "",
                file: null,
                isExisting: false,
            },
        ]);
    };

    const handleRemove = (id) => {
        setAttachments((prev) => prev.filter((att) => att.id !== id));
    };

    const handleFileChange = (e, id) => {
        const file = e.target.files[0];
        if (!file) return;

        const contentType = file.type;

        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Content = reader.result.split(",")[1]; // Remove data:<type>;base64, prefix

            setAttachments((prev) =>
                prev.map((att) =>
                    att.id === id
                        ? {
                            ...att,
                            file,
                            fileType: contentType,
                            fileName: file.name,
                            isExisting: false,
                            document_file_name: att.document_file_name || file.name,
                            uploadDate: getLocalDateTime(),
                            attachments: [
                                {
                                    filename: file.name,
                                    content: base64Content,
                                    content_type: contentType,
                                    document_file_name: att.document_file_name || file.name,
                                },
                            ],
                        }
                        : att
                )
            );
        };

        reader.readAsDataURL(file);
    };

    const handleFileNameChange = (id, newFileName) => {
        setAttachments((prev) =>
            prev.map((att) =>
                att.id === id
                    ? {
                        ...att,
                        fileName: newFileName,
                        attachments: att.attachments?.length
                            ? [
                                {
                                    ...att.attachments[0],
                                    filename: newFileName,
                                },
                            ]
                            : [],
                    }
                    : att
            )
        );
    };

    const attachmentsPayload = attachments
        .flatMap((att) => att.attachments || []);

    console.log("attachments:", attachmentsPayload)

    return (
        <>
            <div className="website-content overflow-auto">
                <div className="module-data-section ms-2">
                    <a href="">Home &gt; Store &gt; Material QC &gt; Inward Material QC List</a>
                    <h5 className="mt-3">Inward Material QC</h5>
                    <div className="row container-fluid my-4 align-items-center">
                        <div className="col-md-12 ">
                            <div
                                className="tab-content mor-content active"
                                id="pills-tabContent"
                            >
                                <div
                                    className="tab-pane fade show active"
                                    id="pills-home"
                                    role="tabpanel"
                                    aria-labelledby="pills-home-tab"
                                >
                                    <section className="mor p-2 pt-2">
                                        <div className="row">
                                            {/* form-select EXAMPLE */}
                                            <div
                                                className="card card-default"
                                                id="mor-material-details"
                                            >
                                                <div className="card-body mt-0">



                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <label htmlFor="event-no-select">
                                                                PO No.
                                                            </label>
                                                            <div className="form-group">
                                                                <SingleSelector
                                                                    options={[]}
                                                                    placeholder="Select PO No."
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 ">
                                                            <div className="form-group">
                                                                <label>
                                                                    Company
                                                                </label>
                                                                <SingleSelector
                                                                    options={companies}
                                                                    value={selectedCompany}
                                                                    onChange={handleCompanyChange}
                                                                    placeholder="Select Company"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4  ">
                                                            <div className="form-group">
                                                                <label>
                                                                    Project
                                                                </label>
                                                                <SingleSelector
                                                                    options={projects}
                                                                    value={selectedProject}
                                                                    onChange={handleProjectChange}
                                                                    placeholder="Select Project"
                                                                // isDisabled={!selectedCompany}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4  mt-2">
                                                            <div className="form-group">
                                                                <label>
                                                                    Sub-Project
                                                                </label>

                                                                <SingleSelector
                                                                    options={sites}
                                                                    onChange={handleSiteChange}
                                                                    value={selectedSite}
                                                                    placeholder={`Select Sub-Project`} // Dynamic placeholder
                                                                // isDisabled={!selectedCompany}
                                                                />
                                                            </div>
                                                        </div>




                                                        <div className="col-md-4 mt-2">
                                                            <div className="form-group">
                                                                <label>Supplier</label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    value={""}
                                                                    placeholder=""
                                                                    fdprocessedid="qv9ju9"

                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 mt-2">
                                                            <div className="form-group">
                                                                <label>Inspection ID</label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    value={""} // Bind to state

                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 mt-2">
                                                            <div className="form-group">
                                                                <label>Inspection Date</label>
                                                                <div
                                                                    id="datepicker"
                                                                    className="input-group date"
                                                                    data-date-format="mm-dd-yyyy"
                                                                >
                                                                    <input
                                                                        className="form-control"
                                                                        type="date"
                                                                        value={""}

                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>



                                                        <div className="col-md-4  mt-2">
                                                            <div className="form-group">
                                                                <label>Gate No.</label>

                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    value={""}

                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-4 mt-2">
                                                            <div className="form-group">
                                                                <label>Store</label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    value={""}

                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-4 mt-2">
                                                            <div className="form-group">
                                                                <label>Gate Entry Date & Time</label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    value={""}

                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 mt-2">
                                                            <div className="form-group">
                                                                <label>Vehicle No.</label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    placeholder=""
                                                                    fdprocessedid="qv9ju9"

                                                                />
                                                            </div>

                                                        </div>
                                                        <div className="col-md-4 mt-2">
                                                            <div className="form-group">
                                                                <label>Gate Entry No.</label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    placeholder=""
                                                                    fdprocessedid="qv9ju9"
                                                                    value={""}

                                                                />
                                                            </div>

                                                        </div>
                                                        <div className="col-md-4 mt-2">
                                                            <div className="form-group">
                                                                <label>Delivery Chalan No.</label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    placeholder=""
                                                                    fdprocessedid="qv9ju9"
                                                                    value={""}

                                                                />
                                                            </div>

                                                        </div>
                                                        <div className="col-md-4 mt-2">
                                                            <div className="form-group">
                                                                <label>Delivery Challan Date</label>
                                                                <div
                                                                    id="datepicker"
                                                                    className="input-group date"
                                                                    data-date-format="mm-dd-yyyy"
                                                                >
                                                                    <input
                                                                        className="form-control"
                                                                        type="date"
                                                                        value={""}

                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-4 mt-2">
                                                            <div className="form-group">
                                                                <label>Remark</label>
                                                                <textarea
                                                                    className="form-control"
                                                                    rows={3}
                                                                    placeholder="Enter ..."
                                                                    defaultValue={""}
                                                                    value={remark2}
                                                                    onChange={handleRemarkChange2}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 mt-2">
                                                            <div className="form-group">
                                                                <label>Description</label>
                                                                <textarea
                                                                    className="form-control"
                                                                    rows={3}
                                                                    placeholder="Enter ..."
                                                                    defaultValue={""}

                                                                />
                                                            </div>
                                                        </div>


                                                    </div>


                                                    <div className="d-flex justify-content-between mt-5 me-2">
                                                        <h5 className=" ">Material Details</h5>
                                                    </div>

                                                    {/* New Material QC Table */}
                                                    <div className="tbl-container mt-3 mb-5" style={{ maxHeight: "500px" }}>
                                                        <table className="w-100">
                                                            <thead>
                                                                <tr>
                                                                    <th className="text-start">Sr. No</th>
                                                                    <th className="text-start">MOR No.</th>
                                                                    <th className="text-start">Code</th>
                                                                    <th className="text-start">Is QC Required</th>
                                                                    <th className="text-start">Type</th>
                                                                    <th className="text-start">Sub-Type</th>
                                                                    <th className="text-start">Brand Name</th>
                                                                    <th className="text-start">Is MTC Received</th>
                                                                    <th className="text-start">UOM</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {/* Add your table rows here */}
                                                                <tr>
                                                                    <td>1</td>
                                                                    <td>MOR001</td>
                                                                    <td>Code001</td>
                                                                    <td>Yes</td>
                                                                    <td>Type1</td>
                                                                    <td>Sub-Type1</td>
                                                                    <td>Brand1</td>
                                                                    <td>No</td>
                                                                    <td>UOM1</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>


                                                    <CollapsibleCard title="QC Checklist:">
                                                        <CollapsibleCard title="1. Checklist Title">

                                                            {/* Results Table */}
                                                            <div className="tbl-container mt-3 mb-5" style={{ maxHeight: "500px" }}>
                                                                <table className="w-100">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="text-start">Sr. No.</th>
                                                                            <th className="text-start">Description</th>
                                                                            <th className="text-start">Results</th>
                                                                            <th className="text-start">Units</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {/* Add your table rows here */}
                                                                        <tr>
                                                                            <td>1</td>
                                                                            <td>Sample Description</td>
                                                                            <td>Pass</td>
                                                                            <td>kg</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            <div className="row w-100">
                                                                <div className="col-md-12">
                                                                    <div className="form-group">
                                                                        <label>Note</label>
                                                                        <textarea
                                                                            className="form-control"
                                                                            rows={3}
                                                                            placeholder="Enter ..."
                                                                            defaultValue={""}

                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CollapsibleCard>
                                                    </CollapsibleCard>

                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="d-flex justify-content-between mt-5 ">
                                    <h5 className=" ">Document Attachment</h5>
                                    <div
                                        className="card-tools d-flex"
                                        data-bs-toggle="modal"
                                        data-bs-target="#attachModal"
                                        // onClick={openattachModal}
                                        onClick={handleAddRow}
                                    >
                                        <button
                                            className="purple-btn2 mb-2 "
                                            data-bs-toggle="modal"
                                            data-bs-target="#attachModal"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={20}
                                                height={20}
                                                fill="currentColor"
                                                className="bi bi-plus"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                                            </svg>
                                            <span>Add Attachments</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="tbl-container mb-4" style={{ maxHeight: "500px" }}>
                                    <table className="w-100">
                                        <thead>
                                            <tr>
                                                <th className="main2-th">File Type</th>
                                                <th className="main2-th">File Name </th>
                                                <th className="main2-th">Upload At</th>
                                                <th className="main2-th">Upload File</th>
                                                <th className="main2-th" style={{ width: 100 }}>
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attachments.map((att, index) => (
                                                <tr key={att.id}>
                                                    <td>
                                                        <input
                                                            className="form-control document_content_type"
                                                            readOnly
                                                            disabled
                                                            value={att.fileType}
                                                            placeholder="File Type"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control file_name"
                                                            required
                                                            value={att.fileName}
                                                            onChange={(e) => handleFileNameChange(att.id, e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control created_at"
                                                            readOnly
                                                            disabled
                                                            type="datetime-local"
                                                            step="1"
                                                            value={att.uploadDate || ""}
                                                        />
                                                    </td>
                                                    <td>
                                                        {!att.isExisting && (
                                                            <input
                                                                type="file"
                                                                className="form-control"
                                                                required
                                                                onChange={(e) => handleFileChange(e, att.id)}
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="document">
                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                            <div className="attachment-placeholder">
                                                                {att.isExisting && (
                                                                    <div className="file-box">
                                                                        <div className="image">
                                                                            <a href={att.fileUrl} target="_blank" rel="noreferrer">
                                                                                <img
                                                                                    alt="preview"
                                                                                    className="img-responsive"
                                                                                    height={50}
                                                                                    width={50}
                                                                                    src={att.fileUrl}
                                                                                />
                                                                            </a>
                                                                        </div>
                                                                        <div className="file-name">
                                                                            <a href={att.fileUrl} download>
                                                                                <span className="material-symbols-outlined">file_download</span>
                                                                            </a>
                                                                            <span>{att.fileName}</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-link text-danger"
                                                                onClick={() => handleRemove(att.id)}
                                                            >
                                                                <span className="material-symbols-outlined">cancel</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>


                                </div>
                                <div className="row w-100">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label>Remark</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                placeholder="Enter ..."
                                                defaultValue={""}
                                                value={remark}
                                                onChange={handleRemarkChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row w-100">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label>Comments</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                placeholder="Enter ..."
                                                defaultValue={""}
                                                value={comment}
                                                onChange={handleCommentChange}
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
                                                onChange={handleStatusChange}
                                                value={statusOptions.find(
                                                    (option) => option.value === status
                                                )} // Set "Draft" as the selected status
                                                placeholder="Select Status"
                                                isClearable={false}
                                                // isDisabled={true} // Disable the selector
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2 justify-content-end w-100">
                                    {/* <div className="col-md-2">
                    <button className="purple-btn2 w-100">Print</button>
                  </div> */}
                                    <div className="col-md-2 mt-2" >
                                        <button
                                            className="purple-btn2 w-100"

                                        >
                                            Submit
                                        </button>
                                    </div>
                                    <div className="col-md-2">
                                        <button className="purple-btn1 w-100">Cancel</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {loading2 && (
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
                    <p>Submitting...</p>
                </div>
            )}

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
        </>
    );
};

export default MaterialQCCreate;
