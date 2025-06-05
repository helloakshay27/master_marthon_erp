import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect } from "react";
import { Modal, Button, ModalBody, ModalFooter } from "react-bootstrap";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DownloadIcon, FilterIcon, StarIcon, SettingIcon } from "../components";
import { DataGrid } from "@mui/x-data-grid";
import { Stack, Typography, Pagination } from "@mui/material";

const MiscellaneousBillList = () => {
    const navigate = useNavigate(); // Initialize navigation
    const [selectedValue, setSelectedValue] = useState(""); // Holds the selected value
    const [creditNotes, setCreditNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [meta, setMeta] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10; // Items per page
    const [searchKeyword, setSearchKeyword] = useState('');
    const [activeTab, setActiveTab] = useState("total"); // State to track the active tab
    const [pageSize, setPageSize] = useState(10);
    const [showOnlyPinned, setShowOnlyPinned] = useState(false);
    const [pinnedRows, setPinnedRows] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [settingShow, setSettingShow] = useState(false);
    const [show, setShow] = useState(false);
    const [billEntries, setBillEntries] = useState([]);

    // Static data for SingleSelector (this will be replaced by API data later)

    // Handle value change in SingleSelector
    const handleChange = (value) => {
        setSelectedValue(value);
    };

    const [bulkActionDetails, setbulkActionDetails] = useState(true);
    const [filterModal, setfilterModal] = useState(false);
    const [layoutModal, setlayoutModal] = useState(false);

    // Bootstrap collaps
    const bulkActionDropdown = () => {
        setbulkActionDetails(!bulkActionDetails);
    };
    //   Modal

    const openFilterModal = () => setfilterModal(true);
    const closeFilterModal = () => setfilterModal(false);

    const openLayoutModal = () => setlayoutModal(true);
    const closeLayoutModal = () => setlayoutModal(false);

    const [companies, setCompanies] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedSite, setSelectedSite] = useState(null);
    // const [selectedWing, setSelectedWing] = useState(null);
    const [siteOptions, setSiteOptions] = useState([]);
    // const [wingsOptions, setWingsOptions] = useState([]);
    const [activeSearch, setActiveSearch] = useState('');
    const [filterCompanyId, setFilterCompanyId] = useState("");
    const [filterProjectId, setFilterProjectId] = useState("");
    const [filterSiteId, setFilterSiteId] = useState("");

    // Fetch company data on component mount
    useEffect(() => {
        axios
            .get(
                `${baseURL}pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
            )
            .then((response) => {
                setCompanies(response.data.companies);
            })
            .catch((error) => {
                console.error("Error fetching company data:", error);
            });
    }, []);


    const fetchCreditNotes = async (page) => {

        try {
            setLoading(true); // Start loading
            let url = `${baseURL}miscellaneous_bills?page=${page}&per_page=10&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;
            // if (activeSearch) {
            //     url += `&q[credit_note_no_or_credit_note_date_or_credit_note_amount_or_status_or_company_company_name_or_project_name_or_pms_site_name_or_purchase_order_supplier_full_name_cont]=${activeSearch}`;
            // }
            if (filterCompanyId) url += `&q[company_id_eq]=${filterCompanyId}`;
            if (filterProjectId) url += `&q[project_id_eq]=${filterProjectId}`;
            if (filterSiteId) url += `&q[site_id_eq]=${filterSiteId}`;
            // const response = await axios.get(
            //     `${baseURL}credit_notes?page=${page}&per_page=10&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
            // );
            const response = await axios.get(url);
            console.log("res:",response.data)
            const transformedData = response.data.bills.map(
                (entry, index) => {
                    // console.log("created_at raw:", entry.created_at);
                    let formattedDate = "-";
                    if (entry.created_at) {
                        try {
                            formattedDate = new Date(entry.created_at).toISOString().slice(0, 10);
                        } catch (e) {
                            formattedDate = "-";
                        }
                    }
                    let status = entry.status;
                    if (status && typeof status === "string") {
                        status = status.charAt(0).toUpperCase() + status.slice(1);
                    }
                    return {
                        id: entry.id,
                        srNo: (page - 1) * pageSize + index + 1,
                        ...entry,
                        created_at: formattedDate,
                        // pms_supplier: entry.supplier?.organization_name || "-", // <-- add this line
                        status,
                    }
                })
            console.log("transform data:", transformedData)
            setCreditNotes(transformedData);
            setMeta(response.data.meta)
            setTotalPages(response.data.meta.total_pages); // Set total pages
            setTotalEntries(response.data.meta.total_count);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };
    // Fetch credit notes data
    const [totalEntries, setTotalEntries] = useState(0);
    useEffect(() => {


        fetchCreditNotes(currentPage);
    }, [currentPage]);
    console.log("miss list:",creditNotes)



    // Handle company selection
    const handleCompanyChange = (selectedOption) => {
        setSelectedCompany(selectedOption); // Set selected company
        setSelectedProject(null); // Reset project selection
        setSelectedSite(null); // Reset site selection

        if (selectedOption) {
            // Find the selected company from the list
            const selectedCompanyData = companies.find(
                (company) => company.id === selectedOption.value
            );
            setProjects(
                selectedCompanyData?.projects.map((prj) => ({
                    value: prj.id,
                    label: prj.name,
                }))
            );
        }
    };

    //   console.log("selected company:",selectedCompany)
    //   console.log("selected  prj...",projects)

    // Handle project selection
    const handleProjectChange = (selectedOption) => {
        setSelectedProject(selectedOption);
        setSelectedSite(null); // Reset site selection

        if (selectedOption) {
            // Find the selected project from the list of projects of the selected company
            const selectedCompanyData = companies.find(
                (company) => company.id === selectedCompany.value
            );
            const selectedProjectData = selectedCompanyData?.projects.find(
                (project) => project.id === selectedOption.value
            );

            // Set site options based on selected project
            setSiteOptions(
                selectedProjectData?.pms_sites.map((site) => ({
                    value: site.id,
                    label: site.name,
                })) || []
            );
        }
    };

    //   console.log("selected prj:",selectedProject)
    //   console.log("selected sub prj...",siteOptions)

    // Handle site selection
    const handleSiteChange = (selectedOption) => {
        setSelectedSite(selectedOption);
    };

    // Map companies to options for the dropdown
    const companyOptions = companies.map((company) => ({
        value: company.id,
        label: company.company_name,
    }));
    // filter
    const fetchFilteredData = () => {
        const companyId = selectedCompany?.value || "";
        const projectId = selectedProject?.value || "";
        const siteId = selectedSite?.value || "";
        const search = searchKeyword || "";
        setFilterCompanyId(companyId);
        setFilterProjectId(projectId);
        setFilterSiteId(siteId);
        console.log("ids filter:", companyId, projectId, siteId)
        const url = `${baseURL}miscellaneous_bills?page=1&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[company_id_eq]=${companyId}&q[project_id_eq]=${projectId}&q[site_id_eq]=${siteId}`;

        // console.log("url:",url)
        axios
            .get(url)
            .then((response) => {
                const transformedData = response.data.bills.map(
                    (entry, index) => {
                        // console.log("created_at raw:", entry.created_at);
                        let formattedDate = "-";
                        if (entry.created_at) {
                            try {
                                formattedDate = new Date(entry.created_at).toISOString().slice(0, 10);
                            } catch (e) {
                                formattedDate = "-";
                            }
                        }
                        let status = entry.status;
                        if (status && typeof status === "string") {
                            status = status.charAt(0).toUpperCase() + status.slice(1);
                        }
                        return {
                            id: entry.id,
                            srNo: (currentPage - 1) * pageSize + index + 1,
                            ...entry,
                            created_at: formattedDate,
                            status,
                        }
                    })
                setCreditNotes(transformedData);
                setTotalPages(response.data.meta.total_pages); // Set total pages
                setTotalEntries(response.data.meta.total_count);
                setMeta(response.data.meta)
            })
            .catch((error) => {
                console.error("Error fetching filtered data:", error);
            });
    };
    const handleReset = () => {
        // Clear selected filters
        setSelectedCompany(null);
        setSelectedProject(null);
        setSelectedSite(null);
        setFilterCompanyId("");
        setFilterProjectId("");
        setFilterSiteId("");
        setActiveSearch("");
        setSearchKeyword("");
        setCurrentPage(1); // Go to first page

        // Fetch unfiltered data
        axios
            .get(`${baseURL}miscellaneous_bills?page=1&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
            .then((response) => {
                const transformedData = response.data.bills.map(
                    (entry, index) => {
                        // console.log("created_at raw:", entry.created_at);
                        let formattedDate = "-";
                        if (entry.created_at) {
                            try {
                                formattedDate = new Date(entry.created_at).toISOString().slice(0, 10);
                            } catch (e) {
                                formattedDate = "-";
                            }
                        }
                        let status = entry.status;
                        if (status && typeof status === "string") {
                            status = status.charAt(0).toUpperCase() + status.slice(1);
                        }
                        return {
                            id: entry.id,
                            srNo: (currentPage - 1) * pageSize + index + 1,
                            ...entry,
                            created_at: formattedDate,
                            status,
                        }
                    })
                setCreditNotes(transformedData);

                // setCreditNotes(response.data.credit_notes);
                setTotalPages(response.data.meta.total_pages); // Set total pages
                setTotalEntries(response.data.meta.total_count);
                setMeta(response.data.meta)
            })
            .catch((error) => {
                console.error("Error resetting data:", error);
            });
    };

    //  bulk action 
    //bulkaction options 
    const options = [
        {
            label: 'Select Status',
            value: '',
        },
        {
            label: 'Draft',
            value: 'draft',
        },
        {
            label: 'Verified',
            value: 'verified',
        },
        {
            label: 'Submitted',
            value: 'submitted',
        },
        {
            label: 'Proceed',
            value: 'proceed',
        },
        {
            label: 'Approved',
            value: 'approved',
        },

    ];

    const [fromStatus, setFromStatus] = useState("");
    const [toStatus, setToStatus] = useState("");
    const [remark, setRemark] = useState("");
    // const [boqList, setBoqList] = useState([]);
    // const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleStatusChange = (selectedOption) => {
        // const { name, value } = e.target;
        // if (name === "fromStatus") {
        //   setFromStatus(selectedOption.value);
        // } else if (name === "toStatus") {
        //   setToStatus(selectedOption.value);
        // }

        setFromStatus(selectedOption.value);
    };

    // Handle status change for 'To Status'
    const handleToStatusChange = (selectedOption) => {
        setToStatus(selectedOption.value);
    };


    const handleRemarkChange = (e) => {
        setRemark(e.target.value);
    };

    const [selectedBoqDetails, setSelectedBoqDetails] = useState([]);

    console.log("data for bulk action")

    const handleSubmit = () => {
        console.log("data for bulk action");

        if (!fromStatus || !toStatus) {
            alert("Please select both 'From Status' and 'To Status'.");
            return;
        }

        // Prepare data to send
        const data = {
            credit_ids: selectedBoqDetails,
            to_status: toStatus,
            comments: remark,
        };
        console.log("data for bulk action", data);

        // Send data to API using axios
        axios
            .patch(
                `${baseURL}miscellaneous_bills/update_bulk_status?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
                data
            )
            .then((response) => {
                console.log('Success:', response.data);
                alert('Status updated successfully ....');
                // Fetch data again after successful update
                fetchCreditNotes(currentPage);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    // Fetch the data when 'fromStatus' changes
    useEffect(() => {
        if (fromStatus) { // Only fetch data if a status is selected
            setLoading(true); // Show loading state while fetching
            axios
                .get(`${baseURL}miscellaneous_bills?page=1&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[status_eq]=${fromStatus}`)
                .then((response) => {
                    const transformedData = response.data.bills.map(
                        (entry, index) => {
                            // console.log("created_at raw:", entry.created_at);
                            let formattedDate = "-";
                            if (entry.created_at) {
                                try {
                                    formattedDate = new Date(entry.created_at).toISOString().slice(0, 10);
                                } catch (e) {
                                    formattedDate = "-";
                                }
                            }
                            let status = entry.status;
                            if (status && typeof status === "string") {
                                status = status.charAt(0).toUpperCase() + status.slice(1);
                            }
                            return {
                                id: entry.id,
                                srNo: (currentPage - 1) * pageSize + index + 1,
                                ...entry,
                                created_at: formattedDate,
                                status,
                            }
                        })
                    setCreditNotes(transformedData);
                    //   setCreditNotes(response.data.credit_notes);
                    setTotalPages(response.data.meta.total_pages); // Set total pages
                    setTotalEntries(response.data.meta.total_count);
                    setMeta(response.data.meta)
                })
                .catch((error) => {
                    console.error("Error resetting data:", error);
                })
                .finally(() => {
                    setLoading(false); // Stop loading when request is complete
                });
        }
    }, [fromStatus]);  // This will run every time 'fromStatus' changes


    //card filter
    const fetchFilteredData2 = (status) => {
        const url = `${baseURL}miscellaneous_bills?page=1&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414${status ? `&q[status_eq]=${status}` : ""
            }`;

        axios
            .get(url)
            .then((response) => {
                const transformedData = response.data.bills.map(
                    (entry, index) => {
                        // console.log("created_at raw:", entry.created_at);
                        let formattedDate = "-";
                        if (entry.created_at) {
                            try {
                                formattedDate = new Date(entry.created_at).toISOString().slice(0, 10);
                            } catch (e) {
                                formattedDate = "-";
                            }
                        }
                        let status = entry.status;
                        if (status && typeof status === "string") {
                            status = status.charAt(0).toUpperCase() + status.slice(1);
                        }
                        return {
                            id: entry.id,
                            srNo: (currentPage - 1) * pageSize + index + 1,
                            ...entry,
                            created_at: formattedDate,
                            status,
                        }
                    })
                setCreditNotes(transformedData);
                // setCreditNotes(response.data.credit_notes);
                setTotalPages(response.data.meta.total_pages); // Set total pages
                setTotalEntries(response.data.meta.total_count);
                // setMeta(response.data.meta);
            })
            .catch((error) => {
                console.error("Error fetching filtered data:", error);
            });
    };

    // const fetchSearchResults = async (page = 1) => {
    //     try {
    //         setLoading(true);
    //         setActiveSearch(searchKeyword);
    //         const response = await axios.get(
    //             `${baseURL}miscellaneous_bills?page=1&per_page=10&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[credit_note_no_or_credit_note_date_or_credit_note_amount_or_status_or_company_company_name_or_project_name_or_pms_site_name_or_purchase_order_supplier_full_name_cont]=${searchKeyword}`
    //         );
    //         const transformedData = response.data.credit_notes.map(
    //             (entry, index) => {
    //                 // console.log("created_at raw:", entry.created_at);
    //                 let formattedDate = "-";
    //                 if (entry.created_at) {
    //                     try {
    //                         formattedDate = new Date(entry.created_at).toISOString().slice(0, 10);
    //                     } catch (e) {
    //                         formattedDate = "-";
    //                     }
    //                 }
    //                 let status = entry.status;
    //                 if (status && typeof status === "string") {
    //                     status = status.charAt(0).toUpperCase() + status.slice(1);
    //                 }
    //                 return {
    //                     id: entry.id,
    //                     srNo: (currentPage - 1) * pageSize + index + 1,
    //                     ...entry,
    //                     created_at: formattedDate,
    //                     status
    //                 }
    //             })
    //         setCreditNotes(transformedData);
    //         //   setCreditNotes(response.data.credit_notes);
    //         setMeta(response.data.meta);
    //         setTotalPages(response.data.meta.total_pages);
    //         setTotalEntries(response.data.meta.total_count);
    //     } catch (err) {
    //         setError("Failed to fetch search results");
    //         console.error("Error fetching search results:", err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error}</div>;

    //   column sort and setting 
    const [columnVisibility, setColumnVisibility] = useState({
        srNo: true,
        // mode_of_submission: true,
        company_name: true,
        project_name: true,
        site_name: true,
        bill_no: true,
        // credit_note_date: true,

        // credit_note_type: true,
        created_at: true,

        // po_number: true,
        bill_date: true,
        // po_value: true,
        pms_supplier: true,
        gstin: true,
        pan_no: true,
        amount: true,
        deduction_tax: true,
        addition_tax: true,
        total_amount: true,
        status: true,
        due_date: true,
        overdue: true,
        due_at: true,
    });

    const allColumns = [

        {
            field: "srNo",
            headerName: "Sr. No.",
            width: 100,
        },
        // {
        //   field: "mode_of_submission",
        //   headerName: "Mode of Submission",
        //   width: 150,
        // },
        { field: "company_name", headerName: "Company", width: 200 },
        { field: "project_name", headerName: "Project", width: 180 },
        { field: "site_name", headerName: "Sub Project", width: 150 },
        {
            field: "bill_no", headerName: "Bill No.", width: 170,
            renderCell: (params) =>
                params.value && params.row.id ? (
                    <Link to={`/miscellaneous-bill-details/${params.row.id}`}

                    >
                        <span className="boq-id-link">{params.value}</span>
                    </Link>
                ) : (
                    "-"
                ),
        },
        // { field: "credit_note_date", headerName: "Date", width: 150 },
        // { field: "credit_note_type", headerName: "Miscellaneous Bill Type", width: 180 },
        {
            field: "created_at",
            headerName: "Created On",
            width: 150,
        },
        // { field: "po_number", headerName: "Bill No.", width: 150 },
        { field: "bill_date", headerName: "Bill Date", width: 150 },
        // { field: "po_value", headerName: "Bill Value", width: 150 },
         { field: "pms_supplier", headerName: "Supplier Name", width: 200 },

        { field: "gstin", headerName: "GSTIN No.", width: 150 },
        { field: "pan_no", headerName: "PAN No.", width: 150 },
        { field: "amount", headerName: "Bill Ammount", width: 180 },
        { field: "deduction_tax", headerName: "Deduction Tax", width: 150 },

        { field: "addition_tax", headerName: "Addition Tax", width: 150 },
        { field: "total_amount", headerName: "Total Amount", width: 150 },
        { field: "status", headerName: "Status", width: 150 },
        { field: "due_date", headerName: "Due Date", width: 150 },
        { field: "overdue", headerName: "Overdue", width: 150 },
        { field: "due_at", headerName: "Due At", width: 150 },
    ];

    const columns = allColumns.filter((col) => columnVisibility[col.field]);

    const handleSettingClose = () => setSettingShow(false);
    const handleClose = () => setShow(false);
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
            ? creditNotes.filter((row) => pinnedRows.includes(row.id))
            : creditNotes;

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

    // Handle page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Calculate displayed rows for the current page
    const startEntry = (currentPage - 1) * pageSize + 1;
    const endEntry = Math.min(currentPage * pageSize, totalEntries);

    console.log("selected bill id array :", selectedBoqDetails)

    console.log("mis. bill :",creditNotes)
    return (
        <>
            <div className="website-content overflow-auto">
                <div className="module-data-section p-4">
                    <a href="">Home &gt; Billing &gt; MOR &gt; Credit Note List</a>
                    <h5 className="mt-4 fw-bold">Miscellaneous Bill List</h5>
                    <div className="material-boxes mt-3">
                        <div className="container-fluid">

                            <div className="row separteinto7 justify-content-center">
                                <div className="col-md-2 text-center">
                                    <div
                                        className={`content-box tab-button ${activeTab === "total" ? "active" : ""}`}
                                        data-tab="total"
                                        onClick={() => {
                                            setActiveTab("total")
                                            fetchFilteredData2("")
                                        }} // Fetch all data (no status filter)
                                    >
                                        <h4 className="content-box-title fw-semibold">Total</h4>
                                        <p className="content-box-sub">{meta?.total_count}</p>
                                        {/* {console.log("meta data ", billData)} */}
                                    </div>
                                </div>
                                <div className="col-md-2 text-center">
                                    <div className={`content-box tab-button ${activeTab === "draft" ? "active" : ""}`} data-tab="draft"
                                        onClick={() => {
                                            setActiveTab("draft")
                                            fetchFilteredData2("draft")
                                        }} // Fetch data with status "draft"
                                    >
                                        <h4 className="content-box-title fw-semibold">
                                            Draft
                                        </h4>
                                        <p className="content-box-sub">{meta?.draft_count}</p>
                                    </div>
                                </div>
                                <div className="col-md-2 text-center">
                                    <div className={`content-box tab-button ${activeTab === "verified" ? "active" : ""}`} data-tab="draft"
                                        onClick={() => {
                                            setActiveTab("verified"); 
                                            fetchFilteredData2("verified")
                                        }}>
                                        <h4 className="content-box-title fw-semibold">
                                            Verified
                                        </h4>
                                        <p className="content-box-sub">{meta?.verified_count}</p>
                                    </div>
                                </div>
                                <div className="col-md-2 text-center">
                                    <div
                                        className={`content-box tab-button ${activeTab === "submited" ? "active" : ""}`}
                                        data-tab="pending-approval"
                                        onClick={() => {
                                            setActiveTab("submited");
                                            fetchFilteredData2("submited")
                                        }}
                                    >
                                        <h4 className="content-box-title fw-semibold">Submit</h4>
                                        <p className="content-box-sub">{meta?.submited_count}</p>
                                    </div>
                                </div>
                                <div className="col-md-2 text-center">
                                    <div
                                        className={`content-box tab-button ${activeTab === "approved" ? "active" : ""}`}
                                        data-tab="self-overdue"
                                        onClick={() => {
                                            setActiveTab("approved");
                                            fetchFilteredData2("approved")
                                        }}
                                    >
                                        <h4 className="content-box-title fw-semibold">Approved</h4>
                                        <p className="content-box-sub">{meta?.approved_count}</p>
                                    </div>
                                </div>
                                <div className="col-md-2 text-center">
                                    <div
                                        className={`content-box tab-button ${activeTab === "proceed" ? "active" : ""}`}
                                        data-tab="self-overdue"
                                        onClick={() => {
                                            setActiveTab("proceed"); 
                                            fetchFilteredData2("proceed")
                                        }}
                                    >
                                        <h4 className="content-box-title fw-semibold">Proceed</h4>
                                        <p className="content-box-sub">{meta?.proceed_count}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tab-content1 active" id="total-content">
                        {/* Total Content Here */}
                        <div className="card mt-3 pb-3 mb-5">
                            <CollapsibleCard title="Quick Filter" isInitiallyCollapsed={true}>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Company</label>

                                            <SingleSelector
                                                options={companyOptions}
                                                onChange={handleCompanyChange}
                                                value={selectedCompany}
                                                placeholder={`Select Company`}
                                            />
                                            {/* {validationErrors.company && (
                        <span className="text-danger">{validationErrors.company}</span>
                      )} */}
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Project</label>

                                            <SingleSelector
                                                options={projects}
                                                onChange={handleProjectChange}
                                                value={selectedProject}
                                                placeholder={`Select Project`}
                                            />
                                            {/* {validationErrors.project && (
                        <span className="text-danger">{validationErrors.project}</span>
                      )} */}
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Sub-Project</label>
                                            {/* Pass static data as options */}
                                            <SingleSelector
                                                options={siteOptions}
                                                onChange={handleSiteChange}
                                                value={selectedSite}
                                                placeholder={`Select Sub-project`} // Dynamic placeholder
                                            />
                                            {/* {validationErrors.site && (
                        <span className="text-danger">{validationErrors.site}</span>
                      )} */}
                                        </div>
                                    </div>
                                    <div className="col-md-1 mt-4 d-flex justify-content-center">
                                        <button
                                            className="purple-btn2"
                                            onClick={fetchFilteredData}

                                        >
                                            Go
                                        </button>
                                    </div>
                                    <div className="col-md-1 mt-4 d-flex justify-content-center">
                                        <button
                                            className="purple-btn2"
                                            onClick={handleReset}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </CollapsibleCard>

                            <CollapsibleCard title="Bulk Action" isInitiallyCollapsed={true}>
                                <div className="card-body mt-0 pt-0">
                                    <div className="row align-items-center">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>From Status</label>
                                                <SingleSelector
                                                    options={options}
                                                    // value={options.value}
                                                    value={options.find(option => option.value === fromStatus)}
                                                    onChange={handleStatusChange}
                                                    // onChange={handleStatusChange}
                                                    // options.find(option => option.value === status)
                                                    // value={filteredOptions.find(option => option.value === status)}
                                                    // value={options.find(option => option.value === status)}
                                                    // value={selectedSite}
                                                    placeholder={`Select Status`} // Dynamic placeholder
                                                    classNamePrefix="react-select"
                                                />
                                            </div>
                                            <div className="form-group mt-3">
                                                <label>To Status</label>
                                                <SingleSelector
                                                    options={options}
                                                    // value={options.value}
                                                    // onChange={handleToStatusChange}
                                                    value={options.find(option => option.value === toStatus)}
                                                    onChange={handleStatusChange}
                                                    // options.find(option => option.value === status)
                                                    // value={filteredOptions.find(option => option.value === status)}
                                                    // value={options.find(option => option.value === status)}
                                                    // value={selectedSite}
                                                    placeholder={`Select Status`} // Dynamic placeholder
                                                    classNamePrefix="react-select"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Remark</label>
                                                <textarea
                                                    className="form-control"
                                                    rows={4}
                                                    placeholder="Enter ..."
                                                    defaultValue={""}
                                                    value={remark}
                                                    onChange={handleRemarkChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="offset-md-1 col-md-2">
                                            <button
                                                className="purple-btn2 m-0"
                                                style={{ color: "white" }}
                                                onClick={handleSubmit}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CollapsibleCard>



                            <div className="d-flex justify-content-between align-items-center me-2 mt-4">
                                {/* Search Input */}
                                <div className="col-md-4">
                                    <form>
                                        <div className="input-group ms-3">
                                            <input
                                                type="search"
                                                id="searchInput"
                                                value={searchKeyword}
                                                onChange={(e) => setSearchKeyword(e.target.value)} // <- Add this line
                                                className="form-control tbl-search"
                                                placeholder="Type your keywords here"
                                            />
                                            <div className="input-group-append">
                                                <button type="button" className="btn btn-md btn-default"
                                                    // onClick={() => fetchSearchResults()}
                                                    onClick={() => {
                                                        //   setSearchKeyword(searchInput); // Set the main search keyword
                                                        fetchSearchResults();          // Trigger search
                                                    }}
                                                >
                                                    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z" fill="#8B0203" />
                                                        <path d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z" fill="#8B0203" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                {/* Buttons & Filter Section */}
                                <div className="col-md-6">
                                    <div className="d-flex justify-content-end align-items-center gap-3">
                                        {/* Filter Icon */}
                                        {/* <button className="btn btn-md btn-default">
                      <svg
                        width={28}
                        height={28}
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.66604 5.64722C6.39997 5.64722 6.15555 5.7938 6.03024 6.02851C5.90494 6.26322 5.91914 6.54788 6.06718 6.76895L13.7378 18.2238V29.0346C13.7378 29.2945 13.8778 29.5343 14.1041 29.6622C14.3305 29.79 14.6081 29.786 14.8307 29.6518L17.9136 27.7927C18.13 27.6622 18.2622 27.4281 18.2622 27.1755V18.225L25.9316 6.76888C26.0796 6.5478 26.0938 6.26316 25.9685 6.02847C25.8432 5.79378 25.5987 5.64722 25.3327 5.64722H6.66604ZM15.0574 17.6037L8.01605 7.08866H23.9829L16.9426 17.6051C16.8631 17.7237 16.8207 17.8633 16.8207 18.006V26.7685L15.1792 27.7584V18.0048C15.1792 17.862 15.1368 17.7224 15.0574 17.6037Z"
                          fill="#8B0203"
                        />
                      </svg>
                    </button> */}
                                        <button
                                            type="button"
                                            className="btn btn-md"
                                            onClick={handleSettingModalShow}
                                        >
                                            <SettingIcon />
                                        </button>
                                        {/* Create BOQ Button */}
                                        <button className="purple-btn2"
                                            onClick={() => navigate("/miscellaneous-bill-create")}
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
                                            <span> Add</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* {!loading && !error && ( */}

                            {/* )} */}

                            <div
                                className="
                            
                            mt-3 mx-3"
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
                                    // pageSize={pageSize}
                                    autoHeight={true}
                                    // getRowId={(row) => row.id}
                                    getRowId={(row) => {
                                        //   console.log("Row ID:", row.id);
                                        return row.id;
                                    }}
                                    loading={false}
                                    disableSelectionOnClick
                                    checkboxSelection // <-- enables checkboxes and select all
                                    selectionModel={selectedBoqDetails}
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
                                        "& .MuiDataGrid-columnHeader .MuiCheckbox-root .MuiSvgIcon-root": {
                                            color: "#fff",
                                        },
                                        // Make checkboxes smaller
                                        "& .MuiCheckbox-root .MuiSvgIcon-root": {
                                            fontSize: "1.1rem", // adjust as needed (default is 1.5rem)
                                        },
                                    }}
                                />
                                {/* <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    padding={2}
                                >
                                    <Pagination
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={(event, value) => setCurrentPage(value)}
                                        siblingCount={1}
                                        boundaryCount={1}
                                        color="primary"
                                        showFirstButton
                                        showLastButton
                                        disabled={totalPages <= 1}
                                    />

                                    <Typography variant="body2">
                                        Showing {startEntry} to {endEntry} of {totalEntries} entries
                                    </Typography>
                                </Stack> */}

                            </div>


                            <div className="d-flex justify-content-between align-items-center px-3 mt-2">
                                <ul className="pagination justify-content-center d-flex">
                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(1)}
                                            disabled={currentPage === 1}
                                        >
                                            First
                                        </button>
                                    </li>
                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
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
                                            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
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
                                        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
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
                                        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
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
                                    {Math.min(currentPage * itemsPerPage, totalEntries)} of {totalEntries}{" "}
                                    entries
                                </div>
                            </div>



                        </div>
                    </div>
                </div>

            </div>

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
                                        <svg
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

            {/* modal start */}
            <Modal
                centered
                size="lg"
                show={filterModal}
                onHide={closeFilterModal}
                backdrop="static"
                keyboard={true}
                className="modal-centered-custom"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add</Modal.Title>
                </Modal.Header>
                <div
                    className="modal-body "
                    style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>Company</label>
                                <SingleSelector
                                    options={companyOptions}
                                    selectedValue={selectedValue}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>Project</label>
                                <SingleSelector
                                    options={companyOptions}
                                    selectedValue={selectedValue}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>Sub Project</label>
                                <SingleSelector
                                    options={companyOptions}
                                    selectedValue={selectedValue}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="form-group">
                                <label>Debit Note No.</label>
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
                                <label>Date From 7 to</label>
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
                                <label>Created on From &amp; To</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="form-group">
                                <label>Dabit Note Type</label>
                                <SingleSelector
                                    options={companyOptions}
                                    selectedValue={selectedValue}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="form-group">
                                <label>Created on From &amp; To</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="form-group">
                                <label>PO No.</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="form-group">
                                <label>PO Date</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="form-group">
                                <label>PO Value</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="form-group">
                                <label>Supplier Name</label>
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
                                <label>GSTIN No.</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="form-group">
                                <label>PAN No.</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="form-group">
                                <label>Debit Note Amount</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="form-group">
                                <label>Deduction Tax</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="form-group">
                                <label>Payable Amount</label>
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
                                <label>Addition Tax </label>
                                <div className="">
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder=""
                                        fdprocessedid="qv9ju9"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="form-group">
                                <label>Total Amount</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="form-group">
                                <label>Status</label>
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
                                <label>Due Date From &amp; To</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="form-group">
                                <label>Overdue</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="form-group">
                                <label>Due At</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer modal-footer-k justify-content-center">
                    <a
                        className="purple-btn2"
                        href="/pms/admin/task_managements/kanban_list?type="
                    >
                        Go
                    </a>
                </div>

            </Modal>

            <Modal
                centered
                size="sm"
                show={layoutModal}
                onHide={closeLayoutModal}
                backdrop="static"
                keyboard={true}
                className="modal-centered-custom"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Layout</Modal.Title>
                </Modal.Header>
                <ModalBody>
                    <div className="row justify-content-between align-items-center">
                        <div className="col-md-6">
                            <button type="submit" className="btn btn-md">
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
                            <label htmlFor=""> Sr No.</label>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check form-switch mt-1">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="flexSwitchCheckDefault"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2 justify-content-between align-items-center">
                        <div className="col-md-6">
                            <button type="submit" className="btn btn-md">
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
                            <label htmlFor=""> Sr No.</label>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check form-switch mt-1">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="flexSwitchCheckDefault"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2 justify-content-between align-items-center">
                        <div className="col-md-6">
                            <button type="submit" className="btn btn-md">
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
                            <label htmlFor=""> Sr No.</label>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check form-switch mt-1">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="flexSwitchCheckDefault"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2 justify-content-between align-items-center">
                        <div className="col-md-6">
                            <button type="submit" className="btn btn-md">
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
                            <label htmlFor=""> Sr No.</label>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check form-switch mt-1">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="flexSwitchCheckDefault"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2 justify-content-between align-items-center">
                        <div className="col-md-6">
                            <button type="submit" className="btn btn-md">
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
                            <label htmlFor=""> Sr No.</label>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check form-switch mt-1">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="flexSwitchCheckDefault"
                                />
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};

export default MiscellaneousBillList;

