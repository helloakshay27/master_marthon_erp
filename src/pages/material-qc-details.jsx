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
const MaterialQCDetails = () => {
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
    
        useEffect(() => {
            setMaterials([
                {
                    id: 1,
                    details: {
                        morNo: 'MOR001', code: 'Code001', qcRequired: 'Yes', type: 'Type1', subType: 'Sub-Type1', brand: 'Brand1', mtcReceived: 'No', uom: 'UOM1',
                    },
                    attachments: [
                        {
                            id: 101,
                            fileType: 'PDF',
                            fileName: 'TestReport1.pdf',
                            uploadDate: '2025-09-09T10:00',
                            fileUrl: 'https://example.com/TestReport1.pdf',
                            file: null,
                            isExisting: true,
                            status: 'Approved',
                        },
                        {
                            id: 102,
                            fileType: 'Image',
                            fileName: 'Photo1.jpg',
                            uploadDate: '2025-09-09T11:00',
                            fileUrl: 'https://example.com/Photo1.jpg',
                            file: null,
                            isExisting: true,
                            status: 'Pending',
                        },
                    ],
                },
                {
                    id: 2,
                    details: {
                        morNo: 'MOR002', code: 'Code002', qcRequired: 'No', type: 'Type2', subType: 'Sub-Type2', brand: 'Brand2', mtcReceived: 'Yes', uom: 'UOM2',
                    },
                    attachments: [
                        {
                            id: 201,
                            fileType: 'PDF',
                            fileName: 'Certificate2.pdf',
                            uploadDate: '2025-09-08T09:30',
                            fileUrl: 'https://example.com/Certificate2.pdf',
                            file: null,
                            isExisting: true,
                            status: 'Rejected',
                        },
                    ],
                },
                {
                    id: 3,
                    details: {
                        morNo: 'MOR003', code: 'Code003', qcRequired: 'Yes', type: 'Type3', subType: 'Sub-Type3', brand: 'Brand3', mtcReceived: 'No', uom: 'UOM3',
                    },
                    attachments: [
                        {
                            id: 301,
                            fileType: 'Excel',
                            fileName: 'Specs3.xlsx',
                            uploadDate: '2025-09-07T15:45',
                            fileUrl: 'https://example.com/Specs3.xlsx',
                            file: null,
                            isExisting: true,
                            status: 'Approved',
                        },
                        {
                            id: 302,
                            fileType: 'PDF',
                            fileName: 'Manual3.pdf',
                            uploadDate: '2025-09-07T16:00',
                            fileUrl: 'https://example.com/Manual3.pdf',
                            file: null,
                            isExisting: true,
                            status: 'Pending',
                        },
                    ],
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

                                                    <div className="details_page">
                                                        <div className="row px-3">
                                                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Company</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>Sanvo Resorts Pvt. Ltd.-II</label></div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Material Category</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>Material</label></div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Project</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>Nexzone - Phase II</label></div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Sub Project</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>Nexzone - Phase II</label></div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Inspection ID</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>PO/SRPL/NXZPh2/18254</label></div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Inspection Date</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>12-08-2025</label></div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Gate No.</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>G-104</label></div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Supplier</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>LANDMARK REALTY</label></div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Store</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>Main Warehouse</label></div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Gate Entry Date & Time</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>12-08-2025 10:45 AM</label></div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>PO No.</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>PO-56789</label></div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Vehicle No.</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>MH12AB3456</label></div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Gate Entry No.</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>GE-2025-0012</label></div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Delivery Challan No.</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>DC-90876</label></div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Remark</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>Material received in good condition</label></div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Description</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>Cement OPC 53 Grade, 500 bags</label></div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Delivery Challan Date</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>11-08-2025</label></div>
                                                            </div>
                                                        </div>
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
                                                                                                                                <th className="text-start">Sr. No</th>
                                                                                                                                <th className="text-start">Material Description</th>
                                                                                                                                <th className="text-start">MOR No.</th>
                                                                                                                                <th className="text-start">Code</th>
                                                                                                                                <th className="text-start">Material Type</th>
                                                                                                                                <th className="text-start"> Material Sub-Type</th>
                                                                                                                                {/* <th className="text-start">Brand</th> */}
                                                                                                                                <th className="text-start">UOM</th>
                                                                                                                                <th className="text-start">Is QC Required</th>
                                                    
                                                                                                                                <th className="text-start">Is MTC Received</th>
                                                    
                                                                                                                            </tr>
                                                                                                                        </thead>
                                                                                                                        <tbody>
                                                                                                                            <tr>
                                                                                                                                <td className="text-start">{matIdx + 1}</td>
                                                                                                                                <td className="text-start">{mat.details.description}</td>
                                                                                                                                <td className="text-start">{mat.details.morNo}</td>
                                                                                                                                
                                                                                                                                <td className="text-start">{mat.details.code}</td>
                                                                                                                                <td className="text-start">{mat.details.type}</td>
                                                                                                                                <td className="text-start">{mat.details.subType}</td>
                                                                                                                                {/* <td className="text-start">{mat.details.brand}</td> */}
                                                                                                                                <td className="text-start">{mat.details.uom}</td>
                                                                                                                                <td className="text-start">{mat.details.qcRequired}</td>
                                                    
                                                                                                                                <td className="text-start">{mat.details.mtcReceived}</td>
                                                    
                                                                                                                            </tr>
                                                                                                                        </tbody>
                                                                                                                    </table>
                                                                                                                </div>
                                                                                                                <CollapsibleCard title="Document Attachments">
                                                                                                                    <div className="d-flex justify-content-between mt-3 ">
                                                                                                                        <h5 className=" "></h5>
                                                                                                                        <div
                                                                                                                            className="card-tools d-flex"
                                                                                                                            data-bs-toggle="modal"
                                                                                                                            data-bs-target="#attachModal"
                                                                                                                            onClick={() => handleAddAttachment(matIdx)}
                                                                                                                        >
                                                                                                                            {/* <button
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
                                                                                                                            </button> */}
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
                                                                                                                                        <td></td>
                                                                                                                                        <td className="document">
                                                                                                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                                                                                                {att.fileUrl && (
                                                                                                                                                    <a
                                                                                                                                                        href={att.fileUrl}
                                                                                                                                                        download
                                                                                                                                                        target="_blank"
                                                                                                                                                        rel="noopener noreferrer"
                                                                                                                                                        className="btn btn-sm btn-link text-primary me-2"
                                                                                                                                                        title="Download"
                                                                                                                                                        style={{ display: 'flex', alignItems: 'center' }}
                                                                                                                                                    >
                                                                                                                                                        <span className="material-symbols-outlined" style={{ fontSize: 36, lineHeight: 1 }}>
                                                                                                                                                            file_download
                                                                                                                                                        </span>
                                                                                                                                                    </a>
                                                                                                                                                )}
                                                                                                                                                {/* <button
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
                                                                                                                                                </button> */}
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
                                    {/* <div
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
                                    </div> */}
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

export default MaterialQCDetails;
