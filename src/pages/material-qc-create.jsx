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
    // -----------------------
    const [materials, setMaterials] = useState([]); // Each material: { id, details, attachments: [] }

    // Example API response mapping
    // Dummy data for materials (no attachments)
    // setMaterials([
    //     {
    //         id: 1,
    //         details: {
    //             morNo: 'MOR001', code: 'Code001', qcRequired: 'Yes', type: 'Type1', subType: 'Sub-Type1', brand: 'Brand1', mtcReceived: 'No', uom: 'UOM1',
    //         },
    //         attachments: [],
    //     },
    //     {
    //         id: 2,
    //         details: {
    //             morNo: 'MOR002', code: 'Code002', qcRequired: 'No', type: 'Type2', subType: 'Sub-Type2', brand: 'Brand2', mtcReceived: 'Yes', uom: 'UOM2',
    //         },
    //         attachments: [],
    //     },
    //     {
    //         id: 3,
    //         details: {
    //             morNo: 'MOR003', code: 'Code003', qcRequired: 'Yes', type: 'Type3', subType: 'Sub-Type3', brand: 'Brand3', mtcReceived: 'No', uom: 'UOM3',
    //         },
    //         attachments: [],
    //     },
    // ]);


    useEffect(() => {
        setMaterials([
            {
                id: 1,
                details: {
                    morNo: 'MOR001', code: 'Code001', qcRequired: 'Yes', type: 'Type1', subType: 'Sub-Type1', brand: 'Brand1', mtcReceived: 'No', uom: 'UOM1', project: 'Project1', subProject: 'Sub-Project1', description: 'Material 1 Description',
                },
                attachments: [],
            },
            {
                id: 2,
                details: {
                    morNo: 'MOR002', code: 'Code002', qcRequired: 'No', type: 'Type2', subType: 'Sub-Type2', brand: 'Brand2', mtcReceived: 'Yes', uom: 'UOM2', project: 'Project2', subProject: 'Sub-Project2', description: 'Material 2 Description',
                },
                attachments: [],
            },
            {
                id: 3,
                details: {
                    morNo: 'MOR003', code: 'Code003', qcRequired: 'Yes', type: 'Type3', subType: 'Sub-Type3', brand: 'Brand3', mtcReceived: 'No', uom: 'UOM3', project: 'Project3', subProject: 'Sub-Project3', description: 'Material 3 Description',
                },
                attachments: [],
            },
        ]);
    }, []);

    const handleAddAttachment = (matIdx) => {
        setMaterials(prev =>
            prev.map((mat, idx) =>
                idx === matIdx
                    ? {
                        ...mat,
                        attachments: [
                            ...mat.attachments,
                            {
                                id: Date.now(),
                                fileType: "",
                                fileName: "",
                                uploadDate: getLocalDateTime(),
                                fileUrl: "",
                                file: null,
                                isExisting: false,
                                status: "",
                            },
                        ],
                    }
                    : mat
            )
        );
    };

    const handleRemoveAttachment = (matIdx, attId) => {
        setMaterials(prev =>
            prev.map((mat, idx) =>
                idx === matIdx
                    ? { ...mat, attachments: mat.attachments.filter(att => att.id !== attId) }
                    : mat
            )
        );
    };

    const handleAttachmentStatusChange = (matIdx, attId, newStatus) => {
        setMaterials(prev =>
            prev.map((mat, idx) =>
                idx === matIdx
                    ? {
                        ...mat,
                        attachments: mat.attachments.map(att =>
                            att.id === attId ? { ...att, status: newStatus } : att
                        ),
                    }
                    : mat
            )
        );
    };
    // ---------------------

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
                                                                PO No.<span>*</span>
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
                                                                    Gate Entry No.<span>*</span>
                                                                </label>
                                                                <SingleSelector
                                                                    options={companies}
                                                                    value={selectedCompany}
                                                                    onChange={handleCompanyChange}
                                                                    placeholder="Select Gate Entry No."
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 ">
                                                            <div className="form-group">
                                                                <label> Company</label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    value={""}
                                                                    placeholder=""
                                                                    fdprocessedid="qv9ju9"

                                                                />
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-md-4 mt-2">
                                                            <div className="form-group">
                                                                <label>Project</label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    value={""}
                                                                    placeholder=""
                                                                    fdprocessedid="qv9ju9"

                                                                />
                                                            </div>
                                                        </div> */}
                                                        {/* <div className="col-md-4 mt-2">
                                                            <div className="form-group">
                                                                <label>Sub-Project</label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    value={""}
                                                                    placeholder=""
                                                                    fdprocessedid="qv9ju9"

                                                                />
                                                            </div>
                                                        </div> */}
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
                                                        {/* <div className="col-md-4 mt-2 ">
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
                                                        </div> */}
                                                        {/* <div className="col-md-4  mt-2">
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
                                                        </div> */}




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

                                                        {/* <div className="col-md-4 mt-2">
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
                                                        </div> */}
                                                        {/* <div className="col-md-4 mt-2">
                                                            <div className="form-group">
                                                                <label>Description</label>
                                                                <textarea
                                                                    className="form-control"
                                                                    rows={3}
                                                                    placeholder="Enter ..."
                                                                    defaultValue={""}

                                                                />
                                                            </div>
                                                        </div> */}


                                                    </div>


                                                    {materials.map((mat, matIdx) => (
                                                        <React.Fragment key={mat.id}>
                                                            <div className="d-flex justify-content-between mt-5 me-2">
                                                                <h5 className=" ">Material Details {matIdx + 1} </h5>
                                                            </div>
                                                            <div className="tbl-container mt-3 mb-5" style={{ maxHeight: "500px" }}>
                                                                <table className="w-100">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="text-start" rowSpan={2}>Sr. No</th>
                                                                            <th className="text-start" rowSpan={2}>Project</th>
                                                                            <th className="text-start" rowSpan={2}>Sub-Project</th>
                                                                            <th className="text-start" rowSpan={2}>Material Description</th>
                                                                            <th className="text-start" rowSpan={2}>MOR No.</th>
                                                                            <th className="text-start" rowSpan={2}> Material Code</th>
                                                                            <th className="text-start" rowSpan={2}>Material Type</th>
                                                                            <th className="text-start" rowSpan={2}> Material Sub-Type</th>
                                                                            {/* <th className="text-start" rowSpan={2}>Brand</th> */}
                                                                            
                                                                            
                                                                            <th className="text-start">Ordered Qty</th>
                                                                            <th className="text-start" rowSpan={2}>UOM</th>
                                                                            <th className="text-start" rowSpan={2}>Is QC Required</th>
                                                                            <th className="text-start" rowSpan={2}>Is MTC Received</th>
                                                                            {/* <th className="text-start" colSpan={5}>Quantity</th> */}
                                                                        </tr>
                                                                        {/* <tr>
                                                                            <th className="text-start">Ordered</th>
                                                                            <th className="text-start">Breakage</th>
                                                                            <th className="text-start">Defective</th>
                                                                            <th className="text-start">Accepted</th>
                                                                            <th className="text-start">Tolerance Qty</th>
                                                                        </tr> */}
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td className="text-start">{matIdx + 1}</td>
                                                                            <td className="text-start">Nexone</td>
                                                                            <td className="text-start">Antilia</td>
                                                                            <td className="text-start">{mat.details.description}</td>
                                                                            <td className="text-start">{mat.details.morNo}</td>
                                                                            <td className="text-start">{mat.details.code}</td>
                                                                            <td className="text-start">{mat.details.type}</td>
                                                                            <td className="text-start">{mat.details.subType}</td>
                                                                            {/* <td className="text-start">{mat.details.brand}</td> */}
                                                                            
                                                                           
                                                                            <td className="text-start" style={{ minWidth: 90 }}>
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control"
                                                                                    value={mat.details.orderedQty || ""}
                                                                                    disabled
                                                                                />
                                                                            </td>
                                                                            <td className="text-start">{mat.details.uom}</td>
                                                                            <td className="text-start">{mat.details.qcRequired}</td>
                                                                            <td className="text-start">{mat.details.mtcReceived}</td>
                                                                            {/* <td className="text-start" style={{ minWidth: 90 }}>
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control"
                                                                                    value={mat.details.orderedQty || ""}
                                                                                    disabled
                                                                                />
                                                                            </td>
                                                                            <td className="text-start" style={{ minWidth: 90 }}>
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control"
                                                                                    value={mat.details.breakageQty || ""}
                                                                                    onChange={(e) => {
                                                                                        const val = e.target.value;
                                                                                        setMaterials(prev => prev.map((m, idx) => idx === matIdx ? { ...m, details: { ...m.details, breakageQty: val } } : m));
                                                                                    }}
                                                                                />
                                                                            </td>
                                                                            <td className="text-start" style={{ minWidth: 90 }}>
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control"
                                                                                    value={mat.details.defectiveQty || ""}
                                                                                    onChange={(e) => {
                                                                                        const val = e.target.value;
                                                                                        setMaterials(prev => prev.map((m, idx) => idx === matIdx ? { ...m, details: { ...m.details, defectiveQty: val } } : m));
                                                                                    }}
                                                                                />
                                                                            </td>
                                                                            <td className="text-start" style={{ minWidth: 90 }}>
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control"
                                                                                    value={mat.details.acceptedQty || ""}
                                                                                    disabled
                                                                                />
                                                                            </td>
                                                                            <td className="text-start" style={{ minWidth: 110 }}>
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control"
                                                                                    value={mat.details.toleranceQty || ""}
                                                                                    disabled
                                                                                />
                                                                            </td> */}
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            <CollapsibleCard title="Document Attachment:">
                                                                <div className="d-flex justify-content-between mt-3 ">
                                                                    <h5 className=" "></h5>
                                                                    <div
                                                                        className="card-tools d-flex"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#attachModal"
                                                                        onClick={() => handleAddAttachment(matIdx)}
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
                                                                                <th className="main2-th">Status</th>
                                                                                <th className="main2-th">Remark</th>
                                                                                <th className="main2-th" style={{ width: 100 }}>
                                                                                    Action
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {mat.attachments.map((att, index) => (
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
                                                                                            onChange={e => {
                                                                                                const newFileName = e.target.value;
                                                                                                setMaterials(prev => prev.map((m, idx) =>
                                                                                                    idx === matIdx
                                                                                                        ? {
                                                                                                            ...m,
                                                                                                            attachments: m.attachments.map(a =>
                                                                                                                a.id === att.id ? { ...a, fileName: newFileName } : a
                                                                                                            ),
                                                                                                        }
                                                                                                        : m
                                                                                                ));
                                                                                            }}
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
                                                                                                onChange={e => {
                                                                                                    const file = e.target.files[0];
                                                                                                    if (!file) return;
                                                                                                    const contentType = file.type;
                                                                                                    const reader = new FileReader();
                                                                                                    reader.onloadend = () => {
                                                                                                        const base64Content = reader.result.split(",")[1];
                                                                                                        setMaterials(prev => prev.map((m, idx) =>
                                                                                                            idx === matIdx
                                                                                                                ? {
                                                                                                                    ...m,
                                                                                                                    attachments: m.attachments.map(a =>
                                                                                                                        a.id === att.id
                                                                                                                            ? {
                                                                                                                                ...a,
                                                                                                                                file,
                                                                                                                                fileType: contentType,
                                                                                                                                fileName: file.name,
                                                                                                                                isExisting: false,
                                                                                                                                document_file_name: a.document_file_name || file.name,
                                                                                                                                uploadDate: getLocalDateTime(),
                                                                                                                                attachments: [
                                                                                                                                    {
                                                                                                                                        filename: file.name,
                                                                                                                                        content: base64Content,
                                                                                                                                        content_type: contentType,
                                                                                                                                        document_file_name: a.document_file_name || file.name,
                                                                                                                                    },
                                                                                                                                ],
                                                                                                                            }
                                                                                                                            : a
                                                                                                                    ),
                                                                                                                }
                                                                                                                : m
                                                                                                        ));
                                                                                                    };
                                                                                                    reader.readAsDataURL(file);
                                                                                                }}
                                                                                            />
                                                                                        )}
                                                                                    </td>
                                                                                    <td>
                                                                                        <SingleSelector
                                                                                            options={[
                                                                                                { label: 'Pass', value: 'Pass' },
                                                                                                { label: 'Fail', value: 'Fail' },
                                                                                                { label: 'External Checking', value: 'External Checking' },
                                                                                            ]}
                                                                                            value={{ label: att.status || 'Select Status', value: att.status || '' }}
                                                                                            onChange={option => {
                                                                                                const newStatus = option ? option.value : '';
                                                                                                setMaterials(prev => prev.map((m, idx) =>
                                                                                                    idx === matIdx
                                                                                                        ? {
                                                                                                            ...m,
                                                                                                            attachments: m.attachments.map(a =>
                                                                                                                a.id === att.id ? { ...a, status: newStatus } : a
                                                                                                            ),
                                                                                                        }
                                                                                                        : m
                                                                                                ));
                                                                                            }}
                                                                                            placeholder="Select Status"
                                                                                            classNamePrefix="react-select"
                                                                                            isClearable={false}
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        {/* <input type="text"  className="form-control"/> */}
                                                                                        <textarea className="form-control"></textarea>
                                                                                    </td>
                                                                                    <td className="document">
                                                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-sm btn-link text-danger"
                                                                                                onClick={() => {
                                                                                                    setMaterials(prev => prev.map((m, idx) =>
                                                                                                        idx === matIdx
                                                                                                            ? {
                                                                                                                ...m,
                                                                                                                attachments: m.attachments.filter(a => a.id !== att.id),
                                                                                                            }
                                                                                                            : m
                                                                                                    ));
                                                                                                }}
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
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </CollapsibleCard>
                                                        </React.Fragment>
                                                    ))}






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
                                <div className="row w-100 mt-3">
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
                                <div className="row w-100 mt-3">
                                    <div className="col-md-12 mt-2">
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
