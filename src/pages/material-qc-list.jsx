import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import { DownloadIcon, FilterIcon, StarIcon, SettingIcon } from "../components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { baseURL } from "../confi/apiDomain";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation } from "react-router-dom";

// Add this utility function near the top (after imports or before component):
const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const MaterialQCList = () => {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    const [selectedValue, setSelectedValue] = useState(""); // Holds the selected value
    const [activeTab, setActiveTab] = useState("total"); // State to track the active tab

    const [pageSize, setPageSize] = useState(10);
    const [showOnlyPinned, setShowOnlyPinned] = useState(false);
    const [pinnedRows, setPinnedRows] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [settingShow, setSettingShow] = useState(false);
    const [show, setShow] = useState(false);
    const [activeSearch, setActiveSearch] = useState("");
    const [filterCompanyId, setFilterCompanyId] = useState("");
    const [filterProjectId, setFilterProjectId] = useState("");
    const [filterSiteId, setFilterSiteId] = useState("");


    // Handle value change in SingleSelector
    const handleChange = (value) => {
        setSelectedValue(value);
    };

    const [bulkActionDetails, setbulkActionDetails] = useState(true);
    const [filterModal, setfilterModal] = useState(false);
    const [layoutModal, setlayoutModal] = useState(false);

    const openFilterModal = () => setfilterModal(true);
    const closeFilterModal = () => setfilterModal(false);

    const openLayoutModal = () => setlayoutModal(true);
    const closeLayoutModal = () => setlayoutModal(false);

    const bulkActionDropdown = () => {
        setbulkActionDetails(!bulkActionDetails);
    };


    //list api
    const [billEntries, setBillEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [meta, setMeta] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10; // Items per page
    const [searchKeyword, setSearchKeyword] = useState("");

    const fetchBillEntries = async (page) => {
        try {
            setLoading(true);
            // const response = await axios.get(
            //   `${baseURL}bill_entries?page=${page}&per_page=10&token=${token}`
            // );

            let url = `${baseURL}bill_entries?page=${page}&per_page=10&token=${token}`;
            if (activeSearch) {
                url += `&q[bill_no_or_bill_date_or_mode_of_submission_or_bill_amount_or_status_or_vendor_remark_or_purchase_order_supplier_gstin_or_purchase_order_supplier_full_name_or_purchase_order_po_number_or_purchase_order_supplier_pan_number_or_purchase_order_company_company_name_or_purchase_order_po_mor_inventories_mor_inventory_material_order_request_project_id_or_purchase_order_po_mor_inventories_mor_inventory_material_order_request_company_id_cont]=${activeSearch}`;
            }
            if (filterCompanyId)
                url += `&q[purchase_order_po_mor_inventories_mor_inventory_material_order_request_company_id_in]=${filterCompanyId}`;
            if (filterProjectId)
                url += `&q[purchase_order_po_mor_inventories_mor_inventory_material_order_request_project_id_in]=${filterProjectId}`;
            if (filterSiteId)
                url += `&q[purchase_order_po_mor_inventories_mor_inventory_material_order_request_site_id_in]=${filterSiteId}`;
            const response = await axios.get(url);
            const transformedData = response.data.bill_entries.map((entry, index) => {
                // console.log("created_at raw:", entry.created_at);
                let formattedDate = "-";
                if (entry.created_at) {
                    try {
                        formattedDate = new Date(entry.created_at)
                            .toISOString()
                            .slice(0, 10);
                    } catch (e) {
                        formattedDate = "-";
                    }
                }
                let formattedDue = "-";
                if (entry.due_date) {
                    try {
                        formattedDue = new Date(entry.due_date).toISOString().slice(0, 10);
                    } catch (e) {
                        formattedDue = "-";
                    }
                }
                let status = entry.status;
                if (status && typeof status === "string") {
                    status = status.replace(/_/g, " ");
                    status = status.charAt(0).toUpperCase() + status.slice(1);
                }
                return {
                    id: entry.id,
                    srNo: (page - 1) * pageSize + index + 1,
                    ...entry,
                    created_at: formatDate(entry.created_at),
                    // pms_supplier: entry.supplier?.organization_name || "-",
                    due_date: formatDate(entry.due_date),
                    status,
                };
            });
            console.log("transform data:", transformedData);
            setBillEntries(transformedData);
            setMeta(response.data.meta);
            setTotalPages(response.data.meta.total_pages); // Set total pages
            setTotalEntries(response.data.meta.total_count);
        } catch (err) {
            setError("Failed to fetch bill entries");
            console.error("Error fetching bill entries:", err);
        } finally {
            setLoading(false);
        }
    };
    // Fetch credit notes data
    const [totalEntries, setTotalEntries] = useState(0);

    useEffect(() => {
        fetchBillEntries(currentPage);
    }, [currentPage]);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    //company quick filter

    const [companies, setCompanies] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedSite, setSelectedSite] = useState(null);
    // const [selectedWing, setSelectedWing] = useState(null);
    const [siteOptions, setSiteOptions] = useState([]);
    // const [wingsOptions, setWingsOptions] = useState([]);

    // Fetch company data on component mount
    useEffect(() => {
        axios
            .get(`${baseURL}pms/company_setups.json?token=${token}`)
            .then((response) => {
                setCompanies(response.data.companies);
            })
            .catch((error) => {
                console.error("Error fetching company data:", error);
            });
    }, []);

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

    // Handle site selection
    const handleSiteChange = (selectedOption) => {
        setSelectedSite(selectedOption);
    };

    // Map companies to options for the dropdown
    const companyOptions = companies?.map((company) => ({
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
        console.log("ids filter:", companyId, projectId, siteId);
        const url = `${baseURL}bill_entries?page=1&token=${token}&q[purchase_order_po_mor_inventories_mor_inventory_material_order_request_company_id_in]=${companyId}&q[purchase_order_po_mor_inventories_mor_inventory_material_order_request_project_id_in]=${projectId}&q[purchase_order_po_mor_inventories_mor_inventory_material_order_request_site_id_cont]=${siteId}`;

        console.log("url:", url);
        axios
            .get(url)
            .then((response) => {
                const transformedData = response.data.bill_entries.map(
                    (entry, index) => {
                        // console.log("created_at raw:", entry.created_at);
                        let formattedDate = "-";
                        if (entry.created_at) {
                            try {
                                formattedDate = new Date(entry.created_at)
                                    .toISOString()
                                    .slice(0, 10);
                            } catch (e) {
                                formattedDate = "-";
                            }
                        }
                        let formattedDue = "-";
                        if (entry.due_date) {
                            try {
                                formattedDue = new Date(entry.due_date)
                                    .toISOString()
                                    .slice(0, 10);
                            } catch (e) {
                                formattedDue = "-";
                            }
                        }
                        let status = entry.status;
                        if (status && typeof status === "string") {
                            status = status.replace(/_/g, " ");
                            status = status.charAt(0).toUpperCase() + status.slice(1);
                        }
                        return {
                            id: entry.id,
                            srNo: (currentPage - 1) * pageSize + index + 1,
                            ...entry,
                            created_at: formatDate(entry.created_at),
                            due_date: formatDate(entry.due_date),
                            status,
                        };
                    }
                );
                setBillEntries(transformedData);
                setTotalPages(response.data.meta.total_pages); // Set total pages
                setTotalEntries(response.data.meta.total_count);
                setMeta(response.data.meta);
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
            .get(`${baseURL}bill_entries?page=1&token=${token}`)
            .then((response) => {
                const transformedData = response.data.bill_entries.map(
                    (entry, index) => {
                        // console.log("created_at raw:", entry.created_at);
                        let formattedDate = "-";
                        if (entry.created_at) {
                            try {
                                formattedDate = new Date(entry.created_at)
                                    .toISOString()
                                    .slice(0, 10);
                            } catch (e) {
                                formattedDate = "-";
                            }
                        }
                        let formattedDue = "-";
                        if (entry.due_date) {
                            try {
                                formattedDue = new Date(entry.due_date)
                                    .toISOString()
                                    .slice(0, 10);
                            } catch (e) {
                                formattedDue = "-";
                            }
                        }
                        let status = entry.status;
                        if (status && typeof status === "string") {
                            status = status.replace(/_/g, " ");
                            status = status.charAt(0).toUpperCase() + status.slice(1);
                        }
                        return {
                            id: entry.id,
                            srNo: (currentPage - 1) * pageSize + index + 1,
                            ...entry,
                            created_at: formatDate(entry.created_at),
                            due_date: formatDate(entry.due_date),
                            status,
                        };
                    }
                );
                setBillEntries(transformedData);
                setTotalPages(response.data.meta.total_pages); // Set total pages
                setTotalEntries(response.data.meta.total_count);
                setMeta(response.data.meta);
            })
            .catch((error) => {
                console.error("Error resetting data:", error);
            });
    };

    //  bulk action

    const [statusOptions, setStatusOptions] = useState([
        {
            label: "Select Status",
            value: "",
        },
    ]);
    useEffect(() => {
        const fetchStatusOptions = async () => {
            try {
                const response = await axios.get(
                    `${baseURL}statuses_list?model=BillEntry&token=${token}`
                );

                // Ensure we're handling the response data safely
                const statusData = Array.isArray(response.data) ? response.data : [];

                // Map the API response to the format needed for SingleSelector
                const options = statusData.map((status) => ({
                    value: status.value, // Use the value directly from API
                    label: status.name, // Use the name directly from API
                }));

                // Add the default "Select Status" option at the beginning
                setStatusOptions([
                    {
                        label: "Select Status",
                        value: "",
                    },
                    ...options,
                ]);
            } catch (error) {
                console.error("Error fetching status options:", error);
                setStatusOptions([
                    {
                        label: "Select Status",
                        value: "",
                    },
                ]);
            }
        };

        fetchStatusOptions();
    }, [token]);

    const [fromStatus, setFromStatus] = useState("");
    const [toStatus, setToStatus] = useState("");
    const [remark, setRemark] = useState("");

    // Handle input changes
    const handleStatusChange = (selectedOption) => {
        setFromStatus(selectedOption.value);
    };

    // Handle status change for 'To Status'
    const handleToStatusChange = (selectedOption) => {
        setToStatus(selectedOption.value);
    };

    const handleRemarkChange = (e) => {
        setRemark(e.target.value);
    };

    const [selectedBoqDetails, setSelectedBoqDetails] = useState("");

    const handleSubmit = () => {
        // e.preventDefault();

        if (!fromStatus || !toStatus) {
            alert("Please select both 'From Status' and 'To Status'.");
            return;
        }

        // Prepare data to send
        const data = {
            bill_entrie_ids: selectedBoqDetails,
            // from_status: fromStatus,
            to_status: toStatus,
            comments: remark,
        };
        console.log("data for bulk action", data);

        // Send data to API using axios
        axios
            .patch(
                `${baseURL}bill_entries/update_bulk_status.json?token=${token}`,
                data
            )
            .then((response) => {
                console.log("Success:", response.data);
                alert("Status updated successfully ....");
                fetchBillEntries(currentPage);
                // Handle success (e.g., show a success message, update UI, etc.)
            })
            .catch((error) => {
                console.error("Error:", error);
                // Handle error (e.g., show an error message)
            });
    };

    // Fetch the data when 'fromStatus' changes
    useEffect(() => {
        if (fromStatus) {
            // Only fetch data if a status is selected
            setLoading(true); // Show loading state while fetching
            axios
                .get(
                    `${baseURL}bill_entries?page=1&per_page=10&token=${token}&q[status_eq]=${fromStatus}`
                )
                .then((response) => {
                    const transformedData = response?.data?.bill_entries.map(
                        (entry, index) => {
                            // console.log("created_at raw:", entry.created_at);
                            let formattedDate = "-";
                            if (entry.created_at) {
                                try {
                                    formattedDate = new Date(entry.created_at)
                                        .toISOString()
                                        .slice(0, 10);
                                } catch (e) {
                                    formattedDate = "-";
                                }
                            }
                            let formattedDue = "-";
                            if (entry.due_date) {
                                try {
                                    formattedDue = new Date(entry.due_date)
                                        .toISOString()
                                        .slice(0, 10);
                                } catch (e) {
                                    formattedDue = "-";
                                }
                            }
                            let status = entry.status;
                            if (status && typeof status === "string") {
                                status = status.replace(/_/g, " ");
                                status = status.charAt(0).toUpperCase() + status.slice(1);
                            }
                            return {
                                id: entry.id,
                                srNo: (currentPage - 1) * pageSize + index + 1,
                                ...entry,
                                created_at: formatDate(entry.created_at),
                                due_date: formatDate(entry.due_date),
                                status,
                            };
                        }
                    );
                    // setBillData(response.data.bill_bookings); // Set fetched data
                    setBillEntries(transformedData);
                    setMeta(response.data.meta);
                    setTotalPages(response.data.meta.total_pages); // Reset total pages
                    setTotalEntries(response.data.meta.total_count); // Reset total entries
                })
                .catch((error) => {
                    console.error("Error resetting data:", error);
                })
                .finally(() => {
                    setLoading(false); // Stop loading when request is complete
                });
        }
    }, [fromStatus]); // This will run every time 'fromStatus' changes

    // State to track selected bill detail IDs
    const handleCheckboxChange = (boqDetailId) => {
        setSelectedBoqDetails((prevSelected) => {
            const selectedArray = prevSelected
                ? prevSelected.split(",").map(Number)
                : [];
            if (selectedArray.includes(boqDetailId)) {
                // If already selected, remove it from the string
                const updatedArray = selectedArray.filter((id) => id !== boqDetailId);
                return updatedArray.join(",");
            } else {
                // If not selected, add it to the string
                const updatedArray = [...selectedArray, boqDetailId];
                return updatedArray.join(",");
            }
        });
    };

    console.log("selected bill id array :", selectedBoqDetails);

    //card filter
    const fetchFilteredData2 = (status) => {
        const url = `${baseURL}bill_entries?page=1&token=${token}${status ? `&q[status_eq]=${status}` : ""
            }`;

        axios
            .get(url)
            .then((response) => {
                const transformedData = response?.data.bill_entries.map(
                    (entry, index) => {
                        // console.log("created_at raw:", entry.created_at);
                        let formattedDate = "-";
                        if (entry.created_at) {
                            try {
                                formattedDate = new Date(entry.created_at)
                                    .toISOString()
                                    .slice(0, 10);
                            } catch (e) {
                                formattedDate = "-";
                            }
                        }
                        let formattedDue = "-";
                        if (entry.due_date) {
                            try {
                                formattedDue = new Date(entry.due_date)
                                    .toISOString()
                                    .slice(0, 10);
                            } catch (e) {
                                formattedDue = "-";
                            }
                        }
                        let status = entry.status;
                        if (status && typeof status === "string") {
                            status = status.replace(/_/g, " ");
                            status = status.charAt(0).toUpperCase() + status.slice(1);
                        }
                        return {
                            id: entry.id,
                            srNo: (currentPage - 1) * pageSize + index + 1,
                            ...entry,
                            created_at: formatDate(entry.created_at),
                            due_date: formatDate(entry.due_date),
                            status,
                        };
                    }
                );
                setBillEntries(transformedData);
                setTotalPages(response.data.meta.total_pages); // Set total pages
                setTotalEntries(response.data.meta.total_count);
                // setMeta(response.data.meta);
            })
            .catch((error) => {
                console.error("Error fetching filtered data:", error);
            });
    };

    const fetchSearchResults = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${baseURL}bill_entries?page=1&per_page=10&token=${token}&q[bill_no_or_bill_date_or_mode_of_submission_or_bill_amount_or_status_or_vendor_remark_or_purchase_order_supplier_gstin_or_purchase_order_supplier_full_name_or_purchase_order_po_number_or_purchase_order_supplier_pan_number_or_purchase_order_company_company_name_or_purchase_order_po_mor_inventories_mor_inventory_material_order_request_project_id_or_purchase_order_po_mor_inventories_mor_inventory_material_order_request_company_id_cont]=${searchKeyword}`
            );
            const transformedData = response.data.bill_entries.map((entry, index) => {
                // console.log("created_at raw:", entry.created_at);
                let formattedDate = "-";
                if (entry.created_at) {
                    try {
                        formattedDate = new Date(entry.created_at)
                            .toISOString()
                            .slice(0, 10);
                    } catch (e) {
                        formattedDate = "-";
                    }
                }
                let formattedDue = "-";
                if (entry.due_date) {
                    try {
                        formattedDue = new Date(entry.due_date).toISOString().slice(0, 10);
                    } catch (e) {
                        formattedDue = "-";
                    }
                }
                let status = entry.status;
                if (status && typeof status === "string") {
                    status = status.replace(/_/g, " ");
                    status = status.charAt(0).toUpperCase() + status.slice(1);
                }
                return {
                    id: entry.id,
                    srNo: (currentPage - 1) * pageSize + index + 1,
                    ...entry,
                    created_at: formatDate(entry.created_at),
                    due_date: formatDate(entry.due_date),
                    status,
                };
            });
            setBillEntries(transformedData);
            setMeta(response.data.meta);
            setTotalPages(response.data.meta.total_pages);
            setTotalEntries(response.data.meta.total_count);
        } catch (err) {
            setError("Failed to fetch search results");
            console.error("Error fetching search results:", err);
        } finally {
            setLoading(false);
        }
    };

    //   column sort and setting
    const [columnVisibility, setColumnVisibility] = useState({
        srNo: true,
        company_name: true,
         project_name: true,
        Gate_Pass_No: true,
        Qc_Number:true,
        PO_TO_CO_No: true,
        Supplier_Vendor: true,
        To_Store: true,
        Material_Asset_Type: true,
        Delivery_Challan: true,
        Date: true,
        Approved_Date: true,
        status: true,
        created_by:true,
    });

    const allColumns = [
        { field: "srNo", headerName: "Sr. No.", width: 100 },
        { field: "company_name", headerName: "Company Name", width: 150 },
         { field: "project_name", headerName: "Project Name", width: 200 },
        { field: "gate_entry_no", headerName: "Gate Entry No.", width: 150 },
          { field: "Qc_Number", headerName: "QC No", width: 150 },
        { field: "PO_TO_CO_No", headerName: "PO/WO No.", width: 200 },
        { field: "supplier_name", headerName: "Supplier/Vendor", width: 200 },
        { field: "To_Store", headerName: "To Store", width: 150 },
        { field: "Material_Asset_Type", headerName: "Material/Asset Type", width: 200 },
        { field: "Delivery_Challan", headerName: "Delivery Challan", width: 150 },
        { field: "created_by", headerName: "Created By", width: 150 },
        { field: "Date", headerName: "Created On", width: 120 },
        { field: "Approved_Date", headerName: "Approved Date", width: 120 },
        { field: "status", headerName: "Status", width: 120 },
        
    ];

    // Columns to show when Pending content box is active
    const pendingColumns = [
        { field: "srNo", headerName: "Sr.No.", width: 90 },
        { field: "company_name", headerName: "Company Name", width: 200 },
        { field: "project_name", headerName: "Project Name", width: 200 },
        { field: "gate_entry_no", headerName: "Gate Entry No", width: 150 },
        { field: "gate_entry_type", headerName: "Gate Entry Type", width: 160 },
        { field: "po_number", headerName: "PO Number", width: 160 },
        { field: "supplier_name", headerName: "Supplier Name", width: 180 },
        { field: "vehicle_number", headerName: "Vehicle Number", width: 150 },
        { field: "created_by", headerName: "Created By", width: 150 },
        { field: "status", headerName: "Status", width: 110 },
        { field: "in_date_time", headerName: "In Date & Time", width: 180 },
        { 
          field: "Action", 
          headerName: "Action", 
          width: 140,
          sortable: false,
          renderCell: () => (
            <span
              style={{ color: "#8b0203", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate(`/material-qc-create?token=${token}`)}
            >
              Create
            </span>
          )
        },
    ];


    const columns = activeTab === "open"
        ? pendingColumns
        : allColumns.filter((col) => columnVisibility[col.field]);

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
        if (activeTab === "open") {
            // Pending tab: one dummy row matching pendingColumns
            return [
                {
                    id: "pending-dummy-1",
                    srNo: 1,
                    company_name: "Demo Company Pvt Ltd",
                    project_name: "Project Alpha",
                    gate_entry_no: "GE-0001",
                    gate_entry_type: "Material",
                    po_number: "PO-123456",
                    supplier_name: "Supplier XYZ",
                    vehicle_number: "MH12AB1234",
                    created_by: "John Doe",
                    status: "Pending",
                    in_date_time: formatDate(new Date().toISOString()),
                },
            ];
        }

        // QC List tab (total): one dummy row matching allColumns
        return [
            {
                id: "qc-dummy-1",
                srNo: 1,
                company_name: "Demo Company Pvt Ltd",
                project_name: "Project Alpha",
                gate_entry_no: "GE-0001",
                Qc_Number: "QC-0001",
                PO_TO_CO_No: "PO-123456",
                supplier_name: "Supplier XYZ",
                To_Store: "Main Store",
                Material_Asset_Type: "Material",
                Delivery_Challan: "DC-7890",
                created_by: "John Doe",
                Date: formatDate(new Date().toISOString()),
                Approved_Date: "-",
                status: "Draft",
            },
        ];
    };

    // Calculate displayed rows for the current page
    const startEntry = (currentPage - 1) * pageSize + 1;
    const endEntry = Math.min(currentPage * pageSize, totalEntries);

    console.log("selected bill id array :", selectedBoqDetails);

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
                    <a href="">Home &gt; Store &gt; Material QC &gt; Inward Material QC List</a>
                    <h5 className="mt-4 fw-bold">Inward Material QC List</h5>
                    <div className="material-boxes mt-3">
                        <div className="container-fluid">
                            <div className="row separteinto6 justify-content-center">
                                <div className="col-md-2 text-center">
                                    <div
                                        // className="content-box tab-button active"
                                        data-tab="total"
                                        className={`content-box tab-button ${activeTab === "total" ? "active" : ""
                                            }`}
                                        onClick={() => {
                                            setActiveTab("total");
                                            fetchFilteredData2("");
                                        }} // Fetch all data (no status filter)
                                    >
                                        <h4 className="content-box-title fw-semibold">QC List</h4>
                                        <p className="content-box-sub">{"1"}</p>
                                    </div>
                                </div>
                                <div className="col-md-2 text-center">
                                    <div
                                        // className="content-box tab-button"
                                        data-tab="open"
                                        className={`content-box tab-button ${activeTab === "open" ? "active" : ""
                                            }`}
                                        onClick={() => {
                                            setActiveTab("open");
                                            fetchFilteredData2("open");
                                        }}
                                    >
                                        <h4 className="content-box-title fw-semibold">
                                            Pending
                                        </h4>
                                        <p className="content-box-sub">{"1"}</p>
                                    </div>
                                </div>
                                <div className="col-md-2 text-center">
                                    <div
                                        // className="content-box tab-button"
                                        data-tab="pending-approval"
                                        className={`content-box tab-button ${activeTab === "recieved_for_verification" ? "active" : ""
                                            }`}
                                        onClick={() => {
                                            setActiveTab("recieved_for_verification");
                                            fetchFilteredData2("recieved_for_verification");
                                        }}
                                    >
                                        <h4 className="content-box-title fw-semibold" title="Received for Verification">
                                            Done
                                        </h4>
                                        <p className="content-box-sub">
                                            {"0"}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-2 text-center">
                                    <div
                                        // className="content-box tab-button"
                                        data-tab="self-overdue"
                                        className={`content-box tab-button ${activeTab === "verified" ? "active" : ""
                                            }`}
                                        onClick={() => {
                                            setActiveTab("verified");
                                            fetchFilteredData2("verified");
                                        }}
                                    >
                                        <h4 className="content-box-title fw-semibold">Rejected</h4>
                                        <p className="content-box-sub">{"0"}</p>
                                    </div>
                                </div>
                                <div className="col-md-2 text-center">
                                    <div
                                        // className="content-box tab-button"
                                        data-tab="self-overdue"
                                        className={`content-box tab-button ${activeTab === "verified" ? "active" : ""
                                            }`}
                                        onClick={() => {
                                            setActiveTab("verified");
                                            fetchFilteredData2("verified");
                                        }}
                                    >
                                        <h4 className="content-box-title fw-semibold">Accepted</h4>
                                        <p className="content-box-sub">{"0"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tab-content1 active mb-5" id="total-content">
                        {/* Total Content Here */}
                        <div className="card mt-3 pb-4">
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
                                        <button className="purple-btn2" onClick={fetchFilteredData}>
                                            Go
                                        </button>
                                    </div>
                                    <div className="col-md-1 mt-4 d-flex justify-content-center">
                                        <button className="purple-btn2" onClick={handleReset}>
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
                                                    options={statusOptions}
                                                    // value={options.value}
                                                    value={statusOptions.find(
                                                        (option) => option.value === fromStatus
                                                    )}
                                                    onChange={handleStatusChange}
                                                    placeholder={`Select Status`} // Dynamic placeholder
                                                    classNamePrefix="react-select"
                                                />
                                            </div>
                                            <div className="form-group mt-3">
                                                <label>To Status</label>
                                                <SingleSelector
                                                    options={statusOptions}
                                                    // value={options.value}
                                                    onChange={handleToStatusChange}
                                                    value={statusOptions.find(
                                                        (option) => option.value === toStatus
                                                    )}
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
                                                    // defaultValue={""}
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
                                <div className="col-md-6">
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
                                                <button
                                                    type="button"
                                                    className="btn btn-md btn-default"
                                                    onClick={() => fetchSearchResults()} // Call the search function
                                                >
                                                    <svg
                                                        width={16}
                                                        height={16}
                                                        viewBox="0 0 16 16"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z"
                                                            fill="#8B0203"
                                                        />
                                                        <path
                                                            d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z"
                                                            fill="#8B0203"
                                                        />
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
                                        <button className="btn btn-md btn-default" onClick={handleModalShow}>
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
                                        </button>

                                        {/* Create BOQ Button */}
                                        <button
                                            type="button"
                                            className="btn btn-md "
                                            onClick={handleSettingModalShow}
                                        >
                                            <SettingIcon />
                                        </button>
                                        {/* <button className="purple-btn2 me-2"
                                          onClick={() => navigate("/material-qc-create")}
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
                                            <span> Create</span>
                                        </button> */}
                                    </div>
                                </div>
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
                                    checkboxSelection={!!fromStatus} //
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
                            {/* <div className="d-flex justify-content-between align-items-center px-3 mt-2">
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
                                </div>
                            </div> */}
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
                                className="d-flex flex-row flex-wrap justify-content-between align-items-center mt-2 gap-2"
                                key={column.field}
                            >
                                <div className="d-flex align-items-center gap-2" style={{ minWidth: 0, flex: 1 }}>
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
                                    <label className="flex-grow-1 text-truncate" style={{ minWidth: 0 }}>{column.headerName}</label>
                                </div>
                                <div className="d-flex align-items-center justify-content-end" style={{ minWidth: 60 }}>
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
                    {/* <button className="purple-btn2" onClick={handleShowAll}>
                        Show All
                    </button>
                    <button className="purple-btn1" onClick={handleHideAll}>
                        Hide All
                    </button> */}
                </Modal.Footer>
            </Modal>



            <Modal
                show={show}
                onHide={handleClose}
                dialogClassName="modal-right"
                className="setting-modal mb-5"
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
                                    onClick={handleClose}
                                >
                                    <svg
                                        width="10"
                                        height="16"
                                        viewBox="0 0 10 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M9 1L1 9L9 17"
                                            stroke="#8B0203"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                <h3 className="modal-title m-0" style={{ fontWeight: 500 }}>
                                    Filter
                                </h3>
                            </div>
                            <span
                                className="resetCSS"
                                style={{ fontSize: "14px", textDecoration: "underline" }}
                                to="#"
                            // onClick={handleFilterReset}
                            >
                                Reset
                            </span>
                        </div>
                    </div>
                </Modal.Header>
                <div className="modal-body" style={{ overflowY: scroll }}>
                    <div className="row justify-content-between align-items-center mt-2">
                        <div className="col-6 mt-2">
                            <label className="block text-sm font-medium">Material Type</label>

                            <SingleSelector
                                options={[]} // Provide the fetched options to the select component

                            />
                        </div>

                        <div className="col-6 mt-2">
                            <label className="block text-sm font-medium">
                                Gate Entry No.
                            </label>
                            <SingleSelector
                                options={[]}

                            />
                        </div>

                        <div className="col-md-6 mt-2">
                            <div className="form-group">
                                <label className="po-fontBold">PO/WO No.</label>
                                <SingleSelector
                                    options={[]}

                                />
                            </div>
                        </div>

                        <div className="col-6 mt-2">
                            <label className="block text-sm font-medium">Supplier/Vendor</label>
                            <SingleSelector
                                options={
                                    []
                                }

                            />
                        </div>

                        <div className="col-md-6 mt-2">
                            <div className="form-group">
                                <label className="po-fontBold">To Store</label>
                                <SingleSelector
                                    options={[]}

                                />
                            </div>
                        </div>
                        <div className="col-md-6 mt-2">
                            <div className="form-group">
                                <label className="po-fontBold">MaterialType</label>
                                <SingleSelector
                                    options={[]}

                                />
                            </div>
                        </div>

                        <div className="col-6 mt-2 ">
                            <label className="block text-sm font-medium">
                                Delivery Challan
                            </label>
                            <SingleSelector
                                options={[]}

                            />
                        </div>
                        <div className="col-6 mt-2">
                            <label className="block text-sm font-medium">
                                Created On
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                name="delivery_challan_date"
                            />
                        </div>
                        <div className="col-6 mt-2 ">
                            <label className="block text-sm font-medium">
                                Approved Date
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                name="approved_date"
                            />
                        </div>
                        <div className="col-6 mt-2">
                            <label className="block text-sm font-medium">
                                Status
                            </label>
                            <SingleSelector
                                options={[]}

                            />
                        </div>
                         <div className="col-6 mt-2">
                            <label className="block text-sm font-medium">
                                Created By
                            </label>
                            <SingleSelector
                                options={[]}

                            />
                        </div>



                        {/* <div className="col-6 mt-2">
                          <label className="block text-sm font-medium">MOR Numbers</label>
                          <MultiSelector
                            options={morOptions}
                            isMulti
                            value={getSelectedOptions("morNumbers", morOptions)}
                            onChange={(selected) => handleChange("morNumbers", selected)}
                            placeholder="Select MOR Numbers"
                          />
                        </div> */}

                        {/* <div className="col-6 mt-2">
                          <label className="block text-sm font-medium">GRN Numbers</label>
                          <MultiSelector
                            options={grnOptions}
                            isMulti
                            value={getSelectedOptions("grnNumbers", grnOptions)}
                            onChange={(selected) => handleChange("grnNumbers", selected)}
                            placeholder="Select GRN Numbers"
                          />
                        </div> */}
                    </div>
                </div>

                <div className="modal-footer justify-content-center">
                    <button
                        className="btn"
                        style={{ backgroundColor: "#8b0203", color: "#fff" }}
                    // onClick={handleFilterGo}
                    >
                        Go
                    </button>
                </div>
            </Modal>

        </>
    );
};

export default MaterialQCList;
