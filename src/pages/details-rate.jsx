import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector"; // Adjust path as needed
import { Modal, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import { useParams } from "react-router-dom";
// import Modal from "react-bootstrap/Modal";

const RateDetails = () => {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    const { id } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10; // Items per page
    const [totalEntries, setTotalEntries] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showRevisionModal, setShowRevisionModal] = useState(false);
    // ...existing state...
    const [activeTab, setActiveTab] = useState("details");
    const [showRemarkModal, setShowRemarkModal] = useState(false);
    const [selectedRemark, setSelectedRemark] = useState("");


    const [rateDetails, setRateDetails] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [status, setStatus] = useState('');
    const [remark, setRemark] = useState('');
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);  // State for loading indicator
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [dateType, setDateType] = useState("");
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    console.log("current page:",currentPage)
    const fetchRateDetails = async (page) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${baseURL}rate_details/${id}.json?page=${page}&per_page=10&token=${token}`
            );
            setRateDetails(response.data);
            setStatus(response.data.selected_status || "");
            console.log("data list... ", response.data)
            setTotalPages(response?.data?.pagination?.total_pages); // Set total pages
            setTotalEntries(response?.data?.pagination?.total_entries);

            if (response?.data?.display_name) {
                setShowRevisionModal(true);
            }
            if (response.data.materials) {
                setLoading(false);
                setTableData(
                    response.data.materials.map((mat) => {
                        let rate = "";
                        let avgRate = "";
                        let poRate = "";

                        if (mat.rate_type === "manual") {
                            rate = mat.rate || "";
                        } else if (mat.rate_type === "average") {
                            avgRate = mat.rate;
                            console.log("avg rate:", avgRate)
                        } else if (mat.rate_type === "last") {
                            poRate = mat.rate;
                        }

                        return {
                            ...mat,
                            rate,
                            avgRate,
                            poRate,
                            rateChecked: mat.rate_type === "manual",
                            avgRateChecked: mat.rate_type === "average",
                            poRateChecked: mat.rate_type === "last",
                        };
                    })
                );

            }
        } catch (error) {
            console.error("Error fetching rate details:", error);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRateDetails(currentPage);
        setActiveTab("details");
    }, [currentPage,id]);

    const statusOptions = [
        // {
        //     label: "Select Status",
        //     value: "",
        // },
        ...(rateDetails?.status_list || []).map((status) => ({
            label: status,
            value: status.toLowerCase(),
        })),
    ];

    // Step 2: Handle status change
    const handleStatusChange = (selectedOption) => {
        // setStatus(e.target.value);
        setStatus(selectedOption.value);
        console.log("Selected Status:", selectedOption.value); // Optional: Log the selected status for debugging
        // handleStatusChange(selectedOption); // Handle status change
    };

    // Step 3: Handle remark change
    const handleRemarkChange = (e) => {
        setRemark(e.target.value);
    };

    const payload = {
        status_log: {
            status: status,
            remarks: remark
        }
    };

    console.log("detail status change", payload);
    const handleSubmit = async () => {
        // Prepare the payload for the API
        const payload = {
            status_log: {
                status: status,
                remarks: remark
            }
        };

        console.log("detail status change", payload);
        setLoading2(true);

        try {
            const response = await axios.patch(
                `${baseURL}rate_details/${id}/update_status.json?token=${token}`,
                payload,  // The request body containing status and remarks
                {
                    headers: {
                        'Content-Type': 'application/json', // Set the content type header
                    },
                }

            );
            await fetchRateDetails(id);


            if (response.status === 200) {
                console.log('Status updated successfully:', response.data);
                setRemark("")
                setLoading2(false);
                alert('Status updated successfully');
                // Handle success (e.g., update the UI, reset fields, etc.)
                // toast.success("Status updated successfully!");
            } else {
                console.log('Error updating status:', response.data);
                // toast.error("Failed to update status.");
                // Handle error (e.g., show an error message)
            }
        } catch (error) {
            console.error('Request failed:', error);
            // Handle network or other errors (e.g., show an error message)
        } finally {
            setLoading2(false);
        }
    };

    const [showDateModal, setShowDateModal] = useState(false);
    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const [dateRange, setDateRange] = useState({
        from: formatDate(new Date(new Date().setMonth(new Date().getMonth() - 6))), // 6 months ago
        to: formatDate(new Date()), // Today's date
    });



    const openDateModal = (material) => {
        if (material.rate_type === "average" && material.avg_rate_from && material.avg_rate_to) {
            setDateRange({
                from: formatDate(material.avg_rate_from), // Format to DD/MM/YYYY
                to: formatDate(material.avg_rate_to),
            });
            setSelectedMaterial(material);
            setDateType(material.rate_level || "");
        }
        setShowDateModal(true);
    };

    const handleCancel = () => {
        // setStatus(initialStatus); // Reset status to the initial value
        // setRemark(''); // Optionally reset the remark as well
        navigate(`/view-BOQ?token=${token}`); // 🔥 Redirect to the /view-BOQ page
    };

    const handleApplyFilters = () => {



        const search = searchKeyword || "";
        console.log("search", search)

        setLoading(true); // Set loading to true before making the request

        axios
            .get(
                `${baseURL}rate_details/${id}.json?search=${search}&token=${token}`
                // https://marathon.lockated.com/boq_details.json?q[work_category_id]=&q[work_sub_category_id]=&q[status]=approved&q[inventory_id]=&q[inventory_type_id]=&search=FINES&token=${token}
            )
            .then((response) => {
                setRateDetails(response.data);
                setStatus(response.data.selected_status || "");
                console.log("data list... ", response.data.pagination.total_entries)
                setTotalPages(response.data?.pagination.total_pages); // Set total pages
                setTotalEntries(response.data?.pagination.total_entries);
                if (response.data.materials) {
                    setLoading(false);
                    setTableData(
                        response.data.materials.map((mat) => {
                            let rate = "";
                            let avgRate = "";
                            let poRate = "";

                            if (mat.rate_type === "manual") {
                                rate = mat.rate || "";
                            } else if (mat.rate_type === "average") {
                                avgRate = mat.rate;
                                console.log("avg rate:", avgRate)
                            } else if (mat.rate_type === "last") {
                                poRate = mat.rate;
                            }

                            return {
                                ...mat,
                                rate,
                                avgRate,
                                poRate,
                                rateChecked: mat.rate_type === "manual",
                                avgRateChecked: mat.rate_type === "average",
                                poRateChecked: mat.rate_type === "last",
                            };
                        })
                    );

                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setLoading(false); // Stop loading when request completes
            });

    };

    const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
    return (
        <>
            <div className="website-content overflow-auto">
                <div className="module-data-section p-4">
                    <a href="">
                        <a href="">Setup &gt; Engineering Setup &gt; Rate</a>
                    </a>
                    <h5 class="mt-4">Rate Details</h5>
                    {status && status.toLowerCase() === "draft" && (
                        <div className="d-flex justify-content-end m-2">

                            <Link
                                to={`/edit-rate/${id}?token=${token}`}
                                className="d-flex align-items-center" style={{ borderColor: '#8b0203' }}>

                                <button class="purple-btn1" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#8b0203" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25Z" fill="#8b0203" />
                                        <path d="M20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#8b0203" />
                                    </svg>
                                </button>

                            </Link>

                        </div>
                    )}
                    {rateDetails?.show_revision === true && (
                        <div className="d-flex justify-content-end m-2 mb-4">

                            <Link
                                to={`/rate-revision/${id}?token=${token}`}
                                className="d-flex align-items-center" style={{ borderColor: '#8b0203' }}>


                                <button className="purple-btn2">
                                    Rate Revision
                                </button>

                            </Link>

                        </div>
                    )}


                    <div className="mb-5">

                        <div
                            className="card card-default"
                            id="mor-material-details"
                        >

                            {rateDetails?.approval_logs?.length > 0 && (
                                <div className="row mt-4 justify-content-end">
                                    <div className="col-md-2 nav-item">
                                        <button
                                            className="purple-btn2"
                                            onClick={openModal}
                                            style={{
                                                backgroundColor:
                                                    rateDetails?.status === "approved" ? "green" : "",
                                                border: "none",
                                            }}
                                        >
                                            <span>Approval Logs</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="card-body">
                                {/* Show Rate Revision card if display_name exists */}
                                {rateDetails?.display_name && (
                                    <div
                                        className="d-flex justify-content-between align-items-center mx-1 p-3 mb-3 rounded-3"
                                        style={{
                                            background: "linear-gradient(90deg, #fff3cd 0%, #ffeeba 100%)",
                                            border: "2px solid #ffc107",
                                            boxShadow: "0 2px 8px rgba(255,193,7,0.15)",
                                            color: "#856404",
                                        }}
                                    >
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 4 }}>
                                                <i className="bi bi-exclamation-triangle-fill me-2" style={{ color: "#856404" }} />
                                                Rate Revision
                                            </p>
                                            <p style={{ marginBottom: 0 }}>
                                                {rateDetails?.display_name}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {/* Tabs */}
                                <nav className="mb-5">
                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                        <button
                                            className={`nav-link ${activeTab === "details" ? "active" : ""}`}
                                            id="nav-details-tab"
                                            type="button"
                                            onClick={() => setActiveTab("details")}
                                            role="tab"
                                            aria-selected={activeTab === "details"}
                                        >
                                            Details
                                        </button>
                                        {rateDetails?.revised_versions?.length > 0 && (
                                            <button
                                                className={`nav-link ${activeTab === "revisions" ? "active" : ""}`}
                                                id="nav-revisions-tab"
                                                type="button"
                                                onClick={() => setActiveTab("revisions")}
                                                role="tab"
                                                aria-selected={activeTab === "revisions"}
                                            >
                                                Revised Versions
                                            </button>
                                        )}
                                    </div>
                                </nav>
                                {/* Tab Content */}
                                <div className="tab-content" id="nav-tabContent">
                                    {activeTab === "details" && (
                                        <div className="tab-pane fade show active" id="details" role="tabpanel">
                                            {/* Rate Details and Materials Table */}
                                            <div className="details_page">
                                                {/* ...company/project/site/wing info... */}
                                                {/* ...search/filter... */}
                                                {/* ...materials table (your existing tableData table)... */}

                                                <div className="details_page">
                                                    <div className="row px-3">
                                                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                            <div className="col-6">
                                                                <label>Company</label>
                                                            </div>
                                                            <div className="col-6">
                                                                <label className="text">
                                                                    <span className="me-3">
                                                                        <span className="text-dark">:</span>
                                                                    </span>
                                                                    {rateDetails?.company_name || "-"}
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                            <div className="col-6">
                                                                <label>Project</label>
                                                            </div>
                                                            <div className="col-6">
                                                                <label className="text">
                                                                    <span className="me-3">
                                                                        <span className="text-dark">:</span>
                                                                    </span>
                                                                    {rateDetails?.project_name || "-"}
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                            <div className="col-6">
                                                                <label>Sub-Project</label>
                                                            </div>
                                                            <div className="col-6">
                                                                <label className="text">
                                                                    <span className="me-3">
                                                                        <span className="text-dark">:</span>
                                                                    </span>
                                                                    {rateDetails?.site_name || "-"}
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                                            <div className="col-6">
                                                                <label>Wing</label>
                                                            </div>
                                                            <div className="col-6">
                                                                <label className="text">
                                                                    <span className="me-3">
                                                                        <span className="text-dark">:</span>
                                                                    </span>
                                                                    {rateDetails?.wing_name || "-"}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="d-flex justify-content-between align-items-center me-2 mt-5">
                                                    {/* Search Input */}
                                                    <div className="col-md-4">
                                                        <form>
                                                            <div className="input-group">
                                                                <input
                                                                    type="search"
                                                                    id="searchInput"
                                                                    value={searchKeyword}
                                                                    onChange={(e) => setSearchKeyword(e.target.value)} // <- Add this line
                                                                    className="form-control tbl-search"
                                                                    placeholder="Type your keywords here"
                                                                />
                                                                <div className="input-group-append">
                                                                    <button type="button" className="btn btn-md btn-default" onClick={handleApplyFilters} >
                                                                        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z" fill="#8B0203" />
                                                                            <path d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z" fill="#8B0203" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                                <div className="mt-3 mb-2 " style={{minHeight:"400px"}}>
                                                    {/* <h5 className="mb-3">Materials</h5> */}
                                                    <div className="tbl-container  mt-1"  >
                                                        <table className="w-100">
                                                            <thead>
                                                                <tr>
                                                                    <th className="text-start">Sr.No.</th>
                                                                    <th className="text-start">Material Type</th>
                                                                    <th className="text-start">Material Sub-Type</th>
                                                                    <th className="text-start">Material</th>
                                                                    <th className="text-start">Generic Specification</th>
                                                                    <th className="text-start">Colour</th>
                                                                    <th className="text-start">Brand</th>
                                                                    <th className="text-start">UOM</th>
                                                                    <th className="text-start">Effective Date</th>
                                                                    <th className="text-start">Rate (INR)
                                                                        {/* <span className="ms-2 pt-2">
                                                    <input type="checkbox" />
                                                </span> */}
                                                                    </th>
                                                                    <th className="text-start">AVG Rate
                                                                        {/* <span className="ms-2 pt-2">
                                                    <input type="checkbox" />
                                                </span> */}
                                                                        {/* <span className="ms-2 pt-2" onClick={() => setShowDateModal(true)} style={{ cursor: "pointer" }}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-calendar"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1zm2-3v1h8V1H3z" />
                                                    </svg>
                                                </span> */}
                                                                    </th>
                                                                    <th className="text-start">PO Rate
                                                                        {/* <span className="ms-2 pt-2">
                                                    <input type="checkbox" />
                                                </span> */}
                                                                    </th>

                                                                    <th className="text-start">Remark</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>


                                                                {/* {rateDetails?.materials?.length > 0 ? (
                                            rateDetails?.materials?.map((row, index) => (
                                                <tr key={index} >
                                                    <td className="text-start"> {index + 1}</td>
                                                   
                                                    <td className="text-start">{row.material_type}</td>
                                                    <td className="text-start">{row.material_name}</td>
                                                    <td className="text-start">{row.material_sub_type}</td>
                                                    <td className="text-start">{row.generic_info}</td>
                                                    <td className="text-start">{row.color}</td>
                                                    <td className="text-start">{row.brand}</td>
                                                    <td className="text-start">
                                                        {row.effective_date}
                                                    </td>
                                                    <td className="text-start">{row.rate}</td>
                                                    <td className="text-start">{row.avg_po_rate}</td>
                                                    <td className="text-start">{row.last_po_rate}</td>
                                                   
                                                    <td>{row.uom}</td>


                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="13" className="text-center">
                                                    No data added yet.
                                                </td>
                                            </tr>
                                        )} */}


                                                                {tableData.length > 0 ? (
                                                                    tableData.map((row, index) => (
                                                                        <tr key={index}>
                                                                            <td className="text-start">
                                                                                {/* {index + 1} */}
                                                                                 {(currentPage - 1) * itemsPerPage + index + 1}
                                                                                </td>
                                                                            <td className="text-start">{row.material_type}</td>
                                                                            <td className="text-start">{row.material_sub_type}</td>
                                                                            <td className="text-start">{row.material_name}</td>

                                                                            <td className="text-start">{row.generic_info}</td>
                                                                            <td className="text-start">{row.color}</td>
                                                                            <td className="text-start">{row.brand}</td>
                                                                            <td className="text-start">{row.uom}</td>
                                                                            <td className="text-start">
                                                                                {/* {row.effective_date} */}
                                                                                {row.effective_date
                                                                                    ? new Date(row.effective_date).toLocaleDateString("en-GB").replaceAll("/", "-")
                                                                                    : "-"}
                                                                            </td>
                                                                            <td className="text-start">
                                                                                {/* {row.rate || "0"}
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={row.rateChecked || false}
                                                                                    disabled
                                                                                    style={{ marginLeft: 8 }}
                                                                                /> */}

                                                                                {row.prev_rate && row.prev_rate !== row.rate ? (
                                                                                    <span
                                                                                        style={{
                                                                                            display: "inline-flex",
                                                                                            alignItems: "center",
                                                                                            gap: "8px",
                                                                                        }}
                                                                                    >
                                                                                        <span
                                                                                            style={{
                                                                                                textDecoration: "line-through",
                                                                                                color: "gray",
                                                                                            }}
                                                                                        >
                                                                                            {row.prev_rate}
                                                                                        </span>
                                                                                        <svg
                                                                                            viewBox="64 64 896 896"
                                                                                            width="1em"
                                                                                            height="1em"
                                                                                            fill="currentColor"
                                                                                            aria-hidden="true"
                                                                                            style={{ margin: "0 4px" }}
                                                                                        >
                                                                                            <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                                                                                        </svg>
                                                                                        <span
                                                                                            style={{
                                                                                                backgroundColor: "#b45253",
                                                                                                padding: "4px 10px",
                                                                                                borderRadius: "5px",
                                                                                                color: "white",
                                                                                                fontWeight: 500,
                                                                                                lineHeight: "1",
                                                                                            }}
                                                                                        >
                                                                                            {row.rate || "0"}
                                                                                        </span>
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={row.rateChecked || false}
                                                                                            disabled
                                                                                            style={{ marginLeft: 8 }}
                                                                                        />
                                                                                    </span>
                                                                                ) : (
                                                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                                                                        {row.rate || "0"}
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={row.rateChecked || false}
                                                                                            disabled
                                                                                            style={{ marginLeft: 8 }}
                                                                                        />
                                                                                    </span>
                                                                                )}
                                                                            </td>

                                                                            <td className="text-start">
                                                                                {/* {row.avgRate || "0"}
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={row.avgRateChecked || false}
                                                                                    disabled
                                                                                    style={{ marginLeft: 8 }}
                                                                                />

                                                                                {row.rate_type === "average" ? (
                                                                                    // <button
                                                                                    //   className="btn btn-link p-0"
                                                                                    //   onClick={() => openDateModal(row)}
                                                                                    // >
                                                                                    //   View Date Range
                                                                                    // </button>

                                                                                    <span
                                                                                        className="ms-2 pt-2"
                                                                                        onClick={() => openDateModal(row)}
                                                                                        style={{ cursor: "pointer" }}
                                                                                        title="View Date Range"
                                                                                    >
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            width="16"
                                                                                            height="16"
                                                                                            fill="currentColor"
                                                                                            className="bi bi-calendar"
                                                                                            viewBox="0 0 16 16"
                                                                                        >
                                                                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1zm2-3v1h8V1H3z" />
                                                                                        </svg>
                                                                                    </span>
                                                                                ) : (
                                                                                    ""
                                                                                )} */}
                                                                                {row.prev_rate_type === "average" && row.prev_rate !== row.avgRate ? (
                                                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                                                                        <span style={{ textDecoration: "line-through", color: "gray" }}>
                                                                                            {row.prev_rate}
                                                                                        </span>
                                                                                        <svg
                                                                                            viewBox="64 64 896 896"
                                                                                            width="1em"
                                                                                            height="1em"
                                                                                            fill="currentColor"
                                                                                            aria-hidden="true"
                                                                                            style={{ margin: "0 4px" }}
                                                                                        >
                                                                                            <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                                                                                        </svg>
                                                                                        <span
                                                                                            style={{
                                                                                                backgroundColor: "#b45253",
                                                                                                padding: "4px 10px",
                                                                                                borderRadius: "5px",
                                                                                                color: "white",
                                                                                                fontWeight: 500,
                                                                                                lineHeight: "1",
                                                                                            }}
                                                                                        >
                                                                                            {row.avgRate || "0"}
                                                                                        </span>
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={row.avgRateChecked || false}
                                                                                            disabled
                                                                                            style={{ marginLeft: 8 }}
                                                                                        />
                                                                                        {row.rate_type === "average" && (
                                                                                            <span
                                                                                                className="ms-2 pt-2"
                                                                                                onClick={() => openDateModal(row)}
                                                                                                style={{ cursor: "pointer" }}
                                                                                                title="View Date Range"
                                                                                            >
                                                                                                <svg
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                    width="16"
                                                                                                    height="16"
                                                                                                    fill="currentColor"
                                                                                                    className="bi bi-calendar"
                                                                                                    viewBox="0 0 16 16"
                                                                                                >
                                                                                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1zm2-3v1h8V1H3z" />
                                                                                                </svg>
                                                                                            </span>
                                                                                        )}
                                                                                    </span>
                                                                                ) : (
                                                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                                                                        {row.avgRate || "0"}
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={row.avgRateChecked || false}
                                                                                            disabled
                                                                                            style={{ marginLeft: 8 }}
                                                                                        />
                                                                                        {row.rate_type === "average" && (
                                                                                            <span
                                                                                                className="ms-2 "
                                                                                                onClick={() => openDateModal(row)}
                                                                                                style={{ cursor: "pointer" }}
                                                                                                title="View Date Range"
                                                                                            >
                                                                                                <svg
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                    width="16"
                                                                                                    height="16"
                                                                                                    fill="currentColor"
                                                                                                    className="bi bi-calendar"
                                                                                                    viewBox="0 0 16 16"
                                                                                                >
                                                                                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1zm2-3v1h8V1H3z" />
                                                                                                </svg>
                                                                                            </span>
                                                                                        )}
                                                                                    </span>
                                                                                )}



                                                                            </td>

                                                                            <td className="text-start">
                                                                                {/* {row.poRate || "0"}
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={row.poRateChecked || false}
                                                                                    disabled
                                                                                    style={{ marginLeft: 8 }}
                                                                                /> */}
                                                                                {row.prev_rate_type === "last" && row.prev_rate !== row.poRate ? (
                                                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                                                                        <span style={{ textDecoration: "line-through", color: "gray" }}>
                                                                                            {row.prev_rate}
                                                                                        </span>
                                                                                        <svg
                                                                                            viewBox="64 64 896 896"
                                                                                            width="1em"
                                                                                            height="1em"
                                                                                            fill="currentColor"
                                                                                            aria-hidden="true"
                                                                                            style={{ margin: "0 4px" }}
                                                                                        >
                                                                                            <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                                                                                        </svg>
                                                                                        <span
                                                                                            style={{
                                                                                                backgroundColor: "#b45253",
                                                                                                padding: "4px 10px",
                                                                                                borderRadius: "5px",
                                                                                                color: "white",
                                                                                                fontWeight: 500,
                                                                                                lineHeight: "1",
                                                                                            }}
                                                                                        >
                                                                                            {row.poRate || "0"}
                                                                                        </span>
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={row.poRateChecked || false}
                                                                                            disabled
                                                                                            style={{ marginLeft: 8 }}
                                                                                        />
                                                                                    </span>
                                                                                ) : (
                                                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                                                                        {row.poRate || "0"}
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={row.poRateChecked || false}
                                                                                            disabled
                                                                                            style={{ marginLeft: 8 }}
                                                                                        />
                                                                                    </span>
                                                                                )}

                                                                            </td>
                                                                            <td className="text-start">
                                                                                {row.remarks && (
                                                                                    <span className="boq-id-link"
                                                                                        onClick={() => {
                                                                                            setSelectedRemark(row.remarks || "No remark available");
                                                                                            setShowRemarkModal(true);
                                                                                        }}
                                                                                    >Remark</span>
                                                                                )}
                                                                            </td>

                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="12" className="text-center">
                                                                            No data found.
                                                                        </td>
                                                                    </tr>
                                                                )}

                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center px-1 mt-2  mb-3">
                                                        <ul className="pagination justify-content-center d-flex">
                                                            <li
                                                                className={`page-item ${currentPage === 1 ? "disabled" : ""
                                                                    }`}
                                                            >
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => handlePageChange(1)}
                                                                    disabled={currentPage === 1}
                                                                >
                                                                    First
                                                                </button>
                                                            </li>
                                                            <li
                                                                className={`page-item ${currentPage === 1 ? "disabled" : ""
                                                                    }`}
                                                            >
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                                    disabled={currentPage === 1}
                                                                >
                                                                    Prev
                                                                </button>
                                                            </li>

                                                            {Array.from({ length: totalPages }, (_, index) => (
                                                                <li
                                                                    key={index + 1}
                                                                    className={`page-item ${currentPage === index + 1 ? "active" : ""
                                                                        }`}
                                                                >
                                                                    <button
                                                                        className="page-link"
                                                                        onClick={() => handlePageChange(index + 1)}
                                                                    >
                                                                        {index + 1}
                                                                    </button>
                                                                </li>
                                                            ))}

                                                            <li
                                                                className={`page-item ${currentPage === totalPages ? "disabled" : ""
                                                                    }`}
                                                            >
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                                    disabled={currentPage === totalPages}
                                                                >
                                                                    Next
                                                                </button>
                                                            </li>
                                                            <li
                                                                className={`page-item ${currentPage === totalPages ? "disabled" : ""
                                                                    }`}
                                                            >
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => handlePageChange(totalPages)}
                                                                    disabled={currentPage === totalPages}
                                                                >
                                                                    Last
                                                                </button>
                                                            </li>
                                                        </ul>
                                                        <div>
                                                            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                                                            {Math.min(currentPage * itemsPerPage, totalEntries)} of{" "}

                                                            {totalEntries} entries
                                                            {console.log(".........", itemsPerPage)}
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    )}

                                    {activeTab === "revisions" && (
                                        <div className="tab-pane fade show active" id="revisions" role="tabpanel">
                                            {/* Rate Revised Versions Table */}
                                            {rateDetails?.revised_versions?.length > 0 ? (
                                                <div className="row mt-4 w-100">
                                                    <div className="col-12">
                                                        <h5>Rate Revised Versions</h5>
                                                        <div className="mx-0">
                                                            <div className="tbl-container mt-1" style={{ maxHeight: "450px" }}>
                                                                <table className="w-100">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Sr.No.</th>
                                                                            {/* <th>ID</th> */}
                                                                            <th>Version Number</th>
                                                                            <th>Status</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {rateDetails?.revised_versions?.map((log, index) => (
                                                                            <tr key={log.id}>
                                                                                <td className="text-start">{index + 1}</td>
                                                                                {/* <td className="text-start">
                                                                                    <Link to={`/details-rate/${log.id}?token=${token}`} className="boq-id-link">
                                                                                        {log.id}
                                                                                    </Link>
                                                                                </td> */}
                                                                                <td className="text-start">
                                                                                    <Link to={`/details-rate/${log.id}?token=${token}`} className="boq-id-link">
                                                                                        <span>{log.display_name}</span>
                                                                                    </Link>
                                                                                </td>
                                                                                <td className="text-start">{log.list_status || ""}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">No revised versions found.</div>
                                            )}
                                        </div>
                                    )}
                                </div>


                            </div>
                        </div>


                        <div className="row w-100 ">
                            <div className="col-md-12 ">
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
                        {/* <div className="row w-100">
                        <div className="col-md-12  mt-2">
                            <div className="form-group">
                                <label>Comments</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    placeholder="Enter ..."
                                    defaultValue={""}
                                // value={comment}
                                // onChange={handleCommentChange}
                                />
                            </div>
                        </div>
                    </div> */}
                        <div className="row mt-4 justify-content-end align-items-center mx-2 mb-5">
                            <div className="col-md-3">
                                <div className="form-group d-flex gap-3 align-items-center mx-3">
                                    <label style={{ fontSize: "0.95rem", color: "black" }}>
                                        Status
                                    </label>

                                    <SingleSelector
                                        options={statusOptions}
                                        // options={filteredOptions}
                                        onChange={handleStatusChange}
                                        // options.find(option => option.value === status)
                                        // value={filteredOptions.find(option => option.value === status)}
                                        value={statusOptions.find(option => option.value === status.toLowerCase())}
                                        // value={selectedSite}
                                        placeholder={`Select Status`} // Dynamic placeholder
                                        // isDisabled={boqDetails.disabled}
                                        classNamePrefix="react-select"
                                    />
                                    {console.log("status", status)}
                                </div>
                            </div>
                        </div>
                        <div className="row mt-2 justify-content-end mb-5 pb-5">
                            <div className="col-md-2 mt-2">
                                <button className="purple-btn2 w-100" onClick={handleSubmit}>Submit</button>
                            </div>
                            <div className="col-md-2">
                                <button className="purple-btn1 w-100" onClick={() => navigate(`/view-rate?token=${token}`)}>Cancle</button>
                            </div>
                        </div>

                        <div className="row mt-2 w-100">
                            <div className="col-12 " >
                                <h5>Audit Log</h5>
                                <div className="mx-0" >
                                    <div className="tbl-container mt-1" style={{ maxHeight: "450px" }} >
                                        <table className="w-100"  >
                                            <thead>
                                                <tr>
                                                    <th>Sr.No.</th>
                                                    <th>Created By</th>
                                                    <th>Created At</th>
                                                    <th>Status</th>
                                                    <th>Remark</th>
                                                    {/* <th>Comment</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(rateDetails?.audit_logs || [])
                                                    .slice(0, 10)
                                                    .map((log, index) => (
                                                        <tr key={log.id}>
                                                            <td className="text-start">{index + 1}</td>
                                                            <td className="text-start">{log.user}</td>
                                                            <td className="text-start">
                                                                {log.date}
                                                            </td>
                                                            <td className="text-start">
                                                                {log.status
                                                                    ? log.status.charAt(0).toUpperCase() + log.status.slice(1)
                                                                    : ""}
                                                            </td>
                                                            <td className="text-start">{log.remarks || ""}</td>
                                                            {/* <td className="text-start">{log.comments || ""}</td> */}
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                        {/* Show "Show More" link if more than 10 records */}
                                        {rateDetails?.status_logs?.length > 10 && (
                                            <div className="mt-2 text-start">
                                                <span
                                                    className="boq-id-link"
                                                    style={{ fontWeight: "bold", cursor: "pointer" }}
                                                //   onClick={() => setShowAuditModal(true)}
                                                >
                                                    Show More
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* {rateDetails?.revised_versions?.length > 0 && (
                            <div className="row mt-4 w-100">
                                <div className="col-12 " >
                                    <h5> Rate Revised Versions</h5>
                                    <div className="mx-0" >
                                        <div className="tbl-container mt-1" style={{ maxHeight: "450px" }} >
                                            <table className="w-100"  >
                                                <thead>
                                                    <tr>
                                                        <th>Sr.No.</th>
                                                        <th>ID</th>
                                                        <th>Version Number</th>
                                                       
                                                        <th>Status</th>
                                                        
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rateDetails?.revised_versions?.map((log, index) => (
                                                        <tr key={log.id}>
                                                            <td className="text-start">{index + 1}</td>
                                                            <td className="text-start">
                                                                <Link to={`/details-rate/${log.id}?token=${token}`} className="boq-id-link">
                                                                    {log.id}
                                                                </Link>
                                                            </td>
                                                            <td className="text-start">
                                                                {log.display_name}
                                                            </td>
                                                            
                                                            <td className="text-start">{log.list_status || ""}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )} */}
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
                    <p>Submitting Status...</p>
                </div>

            )}
            {loading && (
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
                    <p>Loading...</p>
                </div>
            )}

            {/* date modal */}
            {/*  */}

            <Modal centered size="md" show={showDateModal} onHide={() => setShowDateModal(false)}>
                <Modal.Header closeButton>
                    <h5>Selected Date Range</h5>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="row">
                            <div className="col-md-3 d-flex align-items-center  custom-radio">
                                <input
                                    type="radio"
                                    id="companyRadio"
                                    value="company"
                                    checked={dateType === "company"}
                                    onChange={() => setDateType("company")}
                                    className="me-2"
                                    disabled
                                />
                                <label
                                    htmlFor="companyRadio"
                                    className="mb-0"
                                >
                                    Company
                                </label>
                            </div>
                            <div className="col-md-4 d-flex align-items-center custom-radio">
                                <input
                                    type="radio"
                                    className="me-2"
                                    id="organisationRadio"
                                    value="organization"
                                    checked={dateType === "organization"}
                                    onChange={() => setDateType("organization")}
                                    disabled
                                />
                                <label
                                    htmlFor="organisationRadio"
                                    className="mb-0"
                                >
                                    Organization
                                </label>
                            </div>
                            <div className="col-md-6 mt-3 ">
                                <div className="form-group">
                                    <label>From</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={dateRange.from.split("/").reverse().join("-")}
                                        disabled={selectedMaterial?.rate_type === "average" &&
                                            selectedMaterial?.avg_rate_from &&
                                            selectedMaterial?.avg_rate_to}
                                        onChange={(e) =>
                                            setDateRange((prev) => ({
                                                ...prev,
                                                from: formatDate(e.target.value),
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 mt-3 ">
                                <div className="form-group">
                                    <label>To</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={dateRange.to.split("/").reverse().join("-")}
                                        disabled={selectedMaterial?.rate_type === "average" &&
                                            selectedMaterial?.avg_rate_from &&
                                            selectedMaterial?.avg_rate_to}
                                        onChange={(e) =>
                                            setDateRange((prev) => ({
                                                ...prev,
                                                to: formatDate(e.target.value),
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="purple-btn1" onClick={() => setShowDateModal(false)}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>


            {/* Modal start */}
            <Modal size="xl" show={showModal} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <h5>Approval Log</h5>
                </Modal.Header>
                <Modal.Body>

                    <div className="row mt-2 px-2">
                        <div className="col-12">
                            <div className="tbl-container me-2 mt-3">
                                {/* Check if approval_logs is empty or undefined */}
                                {!rateDetails?.approval_logs ||
                                    rateDetails?.approval_logs.length === 0 ? (
                                    // Display a message if no logs are available
                                    <div className="text-center py-4">
                                        <p className="text-muted">
                                            No approval logs available.
                                        </p>
                                    </div>
                                ) : (
                                    // Render the table if logs are available
                                    <table className="w-100" style={{ width: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "66px !important" }}>
                                                    Sr.No.
                                                </th>
                                                <th>Approval Level</th>
                                                <th>Approved By</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Remark</th>
                                                <th>Users</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rateDetails?.approval_logs.map((log, id) => (
                                                <tr key={id}>
                                                    <td className="text-start">{id + 1}</td>
                                                    <td className="text-start">{log.approval_level}</td>
                                                    <td className="text-start">{log.approved_by}</td>
                                                    <td className="text-start">{log.date}</td>
                                                    <td className="text-start">
                                                        <span
                                                            className="px-2 py-1 rounded text-white"
                                                            style={{
                                                                backgroundColor:
                                                                    log.status === "Pending"
                                                                        ? "red"
                                                                        : "green",
                                                            }}
                                                        >
                                                            {log.status}
                                                        </span>
                                                    </td>

                                                    <td className="text-start">
                                                        <p>{log.remark || "-"}</p>
                                                    </td>
                                                    <td className="text-start">{log.users}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* <div>
                       
                        <img src="#" className="img-thumbnail" alt="Document 1" />
                        <img src="#" className="img-thumbnail" alt="Document 2" />
                      </div> */}

                    {/* Documents Table */}
                    {/* <div className="tbl-container mx-3 mt-1">
                        <table className="w-100">
                          <thead>
                            <tr>
                              <th>Documents</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <img src="#" className="img-fluid" alt="Document Preview" />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div> */}
                </Modal.Body>
            </Modal>

            {/* revision modal */}
            {/* <Modal
                centered
                size="xl"
                show={showRevisionModal}
                onHide={() => setShowRevisionModal(false)}
                backdrop="true"
                keyboard={true}
                className="modal-centered-custom"
            >
                <Modal.Header closeButton>
                    <h5>Revision Requested</h5>
                </Modal.Header>
                <Modal.Body style={{ background: "#f5f5f5" }}>
                    <div className="col-md-12">
                        <div className="form-group">
                           
                            <div
                                className="d-flex justify-content-between align-items-center mx-3 p-3 rounded-3"
                                style={{
                                    background: "linear-gradient(90deg, #fff3cd 0%, #ffeeba 100%)",
                                    border: "2px solid #ffc107",
                                    boxShadow: "0 2px 8px rgba(255,193,7,0.15)",
                                    color: "#856404",
                                }}
                            >
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 4 }}>
                                        <i className="bi bi-exclamation-triangle-fill me-2" style={{ color: "#856404" }} />
                                     
                                        Rate Revision

                                    </p>
                                    <p style={{ marginBottom: 0 }}>
                                        {rateDetails?.display_name}
                                    </p>
                                </div>

                            </div>

                        </div>
                    </div>
                   
                </Modal.Body>
                <Modal.Footer className="justify-content-end">
                    <button
                        className="purple-btn1"
                        onClick={() => setShowRevisionModal(false)}
                    >
                        Close
                    </button>
                </Modal.Footer>
            </Modal> */}



            <Modal size="l" centered show={showRemarkModal} onHide={() => setShowRemarkModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Remark</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>{selectedRemark}</div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="purple-btn1 " onClick={() => setShowRemarkModal(false)}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default RateDetails;