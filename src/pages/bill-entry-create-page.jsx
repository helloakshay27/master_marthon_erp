import React from "react";
import { Table, DownloadIcon } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import SingleSelector from "../components/base/Select/SingleSelector";
import { useNavigate } from "react-router-dom";
import MultiSelector from "../components/base/Select/MultiSelector";

const BillEntryListSubPage = () => {
  const [selectPOModal, setselectPOModal] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const openSelectPOModal = () => {
    setselectPOModal(true);
  };

  const closeSelectPOModal = () => {
    setselectPOModal(false);
  };

  const [pageSize, setPageSize] = useState(5);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedPOs, setSelectedPOs] = useState([]);
  const [poTypes] = useState([
    { value: "", label: "Select PO Type" },
    { value: "Domestic", label: "Domestic" },
    { value: "ROPO", label: "ROPO" },
    { value: "Import", label: "Import" },
  ]);

  // add row & delete row

  const [filterParams, setFilterParams] = useState({
    startDate: "",
    endDate: "",
    poType: "",
    poNumber: "",
    selectedPOIds: [],
    projectId: "",
    siteId: "",
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    next_page: 2,
    prev_page: null,
    total_pages: 1,
    total_count: 0,
    per_page: 5,
  });

  const [poOptions, setPoOptions] = useState([]);
  const [selectedPONumbers, setSelectedPONumbers] = useState([]);

  // Add this date formatting function near the top of the component
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Update the handlePOSelect function
  const handlePOSelect = (po) => {
    if (!po) return;
    setSelectedPO(po);
    setFilterParams((prev) => ({
      ...prev,
      selectedPOIds: [po.id],
    }));

    // Update form fields with selected PO details
    if (po) {
      // Update PO Date
      const poDateInput = document.querySelector('input[name="po_date"]');
      if (poDateInput) {
        poDateInput.value = po.po_date || "";
      }

      // Update PO Value
      const poValueInput = document.querySelector('input[name="po_value"]');
      if (poValueInput) {
        poValueInput.value = po.total_value || "";
      }

      // Update GSTIN Number
      const gstinInput = document.querySelector('input[name="gstin_number"]');
      if (gstinInput) {
        gstinInput.value = po.gstin || "";
      }

      // Update PAN Number
      const panInput = document.querySelector('input[name="pan_number"]');
      if (panInput) {
        panInput.value = po.pan || "";
      }

      // Update Due Date with formatted date
      setFormData((prev) => ({
        ...prev,
        due_date: formatDate(po.due_date),
      }));
    }

    closeSelectPOModal();
  };

  const handleCheckboxChange = (poId) => {
    if (!poId) return;
    setSelectedPOs((prev) => {
      if (!prev) return [poId];
      if (prev.includes(poId)) {
        return prev.filter((id) => id !== poId);
      } else {
        return [...prev, poId];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (!event || !event.target) return;
    if (event.target.checked) {
      setSelectedPOs(purchaseOrders?.map((po) => po?.id) || []);
    } else {
      setSelectedPOs([]);
    }
  };

  // Fetch initial PO data when component mounts
  useEffect(() => {
    fetchPurchaseOrders(null, null, null, {
      page: 1,
      pageSize: pageSize,
    });
  }, []);

  // Add this useEffect to fetch PO numbers when component mounts
  useEffect(() => {
    const fetchPONumbers = async () => {
      try {
        const response = await axios.get(
          `${baseURL}purchase_orders/grn_details.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        const poNumbers = response.data.purchase_orders.map((po) => ({
          value: po.id,
          label: po.po_number,
        }));
        setPoOptions(poNumbers);
      } catch (error) {
        console.error("Error fetching PO numbers:", error);
      }
    };
    fetchPONumbers();
  }, []);

  const fetchPurchaseOrders = async (
    companyId = null,
    projectId = null,
    siteId = null,
    filters = {
      startDate: "",
      endDate: "",
      poType: "",
      poNumber: "",
      selectedPOIds: [],
      supplierId: "",
      page: 1,
      pageSize: 5,
    }
  ) => {
    try {
      setLoading(true);
      let url = `${baseURL}purchase_orders/grn_details.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;

      // Add filters only if they are provided
      if (companyId) url += `&q[company_id_eq]=${companyId}`;
      if (projectId) url += `&q[po_mor_inventories_project_id_eq]=${projectId}`;
      if (siteId) url += `&q[po_mor_inventories_pms_site_id_eq]=${siteId}`;
      if (filters?.supplierId)
        url += `&q[supplier_id_eq]=${filters.supplierId}`;
      if (filters?.startDate) url += `&q[po_date_gteq]=${filters.startDate}`;
      if (filters?.endDate) url += `&q[po_date_lteq]=${filters.endDate}`;
      if (filters?.selectedPOIds?.length > 0) {
        url += `&q[id_in]=${filters.selectedPOIds.join(",")}`;
      }
      if (filters?.poType && filters.poType !== "") {
        url += `&q[po_type_eq]=${filters.poType}`;
      }

      // Always add pagination parameters
      url += `&page=${filters.page || 1}`;
      url += `&per_page=${filters.pageSize || 5}`;

      const response = await axios.get(url);
      if (response?.data?.purchase_orders) {
        // Calculate the starting serial number for the current page
        const startSerialNumber =
          ((filters.page || 1) - 1) * (filters.pageSize || 5) + 1;

        // Map the purchase orders with correct serial numbers
        const purchaseOrdersWithSerial = response.data.purchase_orders.map(
          (po, index) => ({
            ...po,
            serialNumber: startSerialNumber + index,
          })
        );

        setPurchaseOrders(purchaseOrdersWithSerial);
      } else {
        setPurchaseOrders([]);
      }

      if (response?.data?.pagination) {
        setPagination({
          current_page: parseInt(response.data.pagination.current_page) || 1,
          next_page: parseInt(response.data.pagination.next_page) || null,
          prev_page: parseInt(response.data.pagination.prev_page) || null,
          total_pages: parseInt(response.data.pagination.total_pages) || 1,
          total_count: parseInt(response.data.pagination.total_count) || 0,
          per_page: parseInt(response.data.pagination.per_page) || 5,
        });
      }
    } catch (err) {
      setError("Failed to fetch purchase orders");
      console.error("Error fetching purchase orders:", err);
      setPurchaseOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({
      ...prev,
      current_page: 1,
    }));

    const updatedFilterParams = {
      ...filterParams,
      selectedPOIds: selectedPONumbers?.map((po) => po?.value) || [],
      poType: filterParams.poType || "",
    };

    fetchPurchaseOrders(
      selectedCompany?.value || null,
      selectedProject?.value || null,
      selectedSite?.value || null,
      {
        ...updatedFilterParams,
        page: 1,
        pageSize: pageSize,
      }
    );
  };

  const handleReset = () => {
    setFilterParams({
      startDate: "",
      endDate: "",
      poType: "",
      poNumber: "",
      selectedPOIds: [],
      projectId: "",
      siteId: "",
    });
    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedSite(null);
    setSelectedPONumbers([]);
    setProjects([]);
    setSites([]);
    setPagination((prev) => ({
      ...prev,
      current_page: 1,
    }));
    fetchPurchaseOrders(null, null, null, {
      page: 1,
      pageSize: pageSize,
    });
  };

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, pagination.current_page - 2);
    const endPage = Math.min(
      pagination.total_pages,
      pagination.current_page + 2
    );

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));

    fetchPurchaseOrders(
      selectedCompany?.value,
      selectedProject?.value,
      selectedSite?.value,
      {
        ...filterParams,
        page: page,
        pageSize: pageSize,
      }
    );
  };

  // Function to handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // tax table functionality

  // tax table functionality

  const handleProjectChange = (selectedOption) => {
    if (!selectedOption) {
      setSelectedProject(null);
      setSelectedSite(null);
      setSites([]);
      return;
    }

    setSelectedProject(selectedOption);
    setSelectedSite(null);

    if (selectedCompany?.value) {
      const selectedCompanyData = companies.find(
        (company) => company?.id === selectedCompany.value
      );
      const selectedProjectData = selectedCompanyData?.projects?.find(
        (project) => project?.id === selectedOption.value
      );

      setSites(
        selectedProjectData?.pms_sites?.map((site) => ({
          value: site?.id || "",
          label: site?.name || "",
        })) || []
      );
    }
  };

  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption || null);
  };

  const handleCompanyChange = (selectedOption) => {
    if (!selectedOption) {
      setSelectedCompany(null);
      setSelectedProject(null);
      setSelectedSite(null);
      setProjects([]);
      setSites([]);
      return;
    }

    setSelectedCompany(selectedOption);
    setSelectedProject(null);
    setSelectedSite(null);
    setProjects(
      selectedOption?.projects?.map((prj) => ({
        value: prj?.id || "",
        label: prj?.name || "",
      })) || []
    );
    setSites([]);
  };

  const fetchProjects = async (companyId) => {
    try {
      const response = await axios.get(
        `${baseURL}projects.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[company_id_eq]=${companyId}`
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
        `${baseURL}sites.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[project_id_eq]=${projectId}`
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
        `${baseURL}pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      );
      const formattedCompanies = response.data.companies.map((company) => ({
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

  const getShowingEntriesText = () => {
    if (!pagination.total_count) return "No entries found";

    const start = (pagination.current_page - 1) * pagination.per_page + 1;
    const end = Math.min(
      start + pagination.per_page - 1,
      pagination.total_count
    );

    return `Showing ${start} to ${end} of ${pagination.total_count} entries`;
  };

  const [attachModal, setattachModal] = useState(false);
  const [viewDocumentModal, setviewDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const openattachModal = () => setattachModal(true);
  const closeattachModal = () => setattachModal(false);
  const [newDocument, setNewDocument] = useState({
    document_type: "",
    attachments: [],
  });

  const initialDocumentTypes = [
    { id: 1, name: "Tax Invoice", count: 0 },
    {
      id: 2,
      name: "Site acknowledged challan / Challan cum Invoice",
      count: 0,
    },
    { id: 3, name: "Weighment slips", count: 0 },
    { id: 4, name: "Lorry receipt", count: 0 },
    { id: 5, name: "E Way bill", count: 0 },
    { id: 6, name: "E Invoice", count: 0 },
    { id: 7, name: "Warranty", count: 0 },
    { id: 8, name: "MTC", count: 0 },
  ];

  const [documents, setDocuments] = useState(
    initialDocumentTypes.map((doc) => ({
      document_type: doc.name,
      attachments: [],
      isDefault: true, // Add flag to identify default documents
    }))
  );

  // Add this at the top of your component

  const handleAttachDocument = () => {
    if (newDocument.document_type && newDocument.attachments.length > 0) {
      setDocuments((prevDocs) => {
        // Check if document type already exists
        const existingDoc = prevDocs.find(
          (doc) =>
            doc.document_type.toLowerCase() ===
            newDocument.document_type.toLowerCase()
        );

        if (existingDoc) {
          // Update existing document
          return prevDocs.map((doc) => {
            if (
              doc.document_type.toLowerCase() ===
              newDocument.document_type.toLowerCase()
            ) {
              return {
                ...doc,
                attachments: [...doc.attachments, ...newDocument.attachments],
              };
            }
            return doc;
          });
        } else {
          // Add new document type
          return [
            ...prevDocs,
            {
              document_type: newDocument.document_type,
              attachments: [...newDocument.attachments],
              isDefault: false,
            },
          ];
        }
      });

      setNewDocument({
        document_type: "",
        attachments: [],
      });
      closeattachModal();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewDocument((prev) => ({
        ...prev,
        attachments: [
          {
            filename: file.name,
            content_type: file.type,
            content: event.target.result,
          },
        ],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDocumentCountClick = (documentType) => {
    const doc = documents.find((d) => d.document_type === documentType);
    if (doc) {
      setSelectedDocument(doc);
      setviewDocumentModal(true);
    }
  };

  const [billDate, setBillDate] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [vendorRemark, setVendorRemark] = useState("");
  const [status, setStatus] = useState("draft");

  const [formData, setFormData] = useState({
    bill_no: "",
    bill_date: "",
    due_date: "",
    bill_amount: "",
    vendor_remark: "",
    bill_received_date: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBillEntrySubmit = async () => {
    setLoading(true);
    if (!selectedPO) {
      alert("Please select a Purchase Order.");
      return;
    }
    // const documentsWithAttachments = documents.filter(
    //   (doc) => doc.attachments.length > 0
    // );
    // Map through all initialDocumentTypes
    const allDocuments = initialDocumentTypes.map((docType) => {
      // Find corresponding document from documents state
      const existingDoc = documents.find(
        (doc) => doc.document_type === docType.name
      );

      return {
        document_type: docType.name,
        id: null,
        attachments:
          existingDoc?.attachments?.map((attachment) => ({
            filename: attachment.filename,
            content_type: attachment.content_type,
            content: attachment.content,
          })) || [], // If no attachments, pass empty array
      };
    });

    const payload = {
      bill_entry: {
        purchase_order_id: selectedPO.id,
        bill_no: formData.bill_no,
        bill_date: formData.bill_date,
        due_date: formData.due_date,
        bill_received_date: formData.bill_received_date,
        bill_amount: parseFloat(formData.bill_amount),
        status: "open",
        mode_of_submission: "Offline",
        vendor_remark: formData.vendor_remark,
        // documents: documentsWithAttachments.map((doc) => ({
        //   document_type: doc.document_type,
        //   attachments: doc.attachments.map((attachment) => ({
        //     filename: attachment.filename,
        //     content_type: attachment.content_type,
        //     content: attachment.content,
        //   })),
        // })),
        documents: allDocuments,
      },
    };

    try {
      const response = await axios.post(
        `${baseURL}bill_entries?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        payload
      );
      // alert("Bill entry submitted successfully!");
      // Navigate("/bill-entry-list")
      if (response.data) {
        alert("Bill entry created successfully!");
        setLoading(false);
        navigate("/bill-entry-list"); // Redirect to bill-booking-list
        // Reset form or redirect as needed
      }
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting bill entry:", error);
      alert("Failed to submit bill entry. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  // Update effect to handle null selectedPONumbers
  useEffect(() => {
    if (!selectedPONumbers) return;
    setFilterParams((prev) => ({
      ...prev,
      selectedPOIds: selectedPONumbers.map((po) => po?.value || ""),
    }));
  }, [selectedPONumbers]);

  // Update PO Type selector change handler
  const handlePOTypeChange = (selected) => {
    if (!selected) return;
    setFilterParams((prev) => ({
      ...prev,
      poType: selected.value || "",
    }));
  };

  return (
    <div className="website-content">
      <div className="module-data-section ms-2 mt-1">
        <a href="">
          Home &gt; Security &gt; Bill Entry List &gt; Bill Submission (For
          Billing User)
        </a>
        <h5 className="mt-3"> Bill Submission (For Billing User)</h5>
        <div className="row align-items-center container-fluid">
          <div className="col-md-12">
            <div className="card p-3 mt-2">
              <div className="row">
                <div className="col-md-2">
                  <div className="form-group">
                    <label>PO Number</label>
                    <input
                      className="form-control"
                      type="text"
                      value={selectedPO?.po_number || ""}
                      placeholder=""
                      fdprocessedid="qv9ju9"
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-1 pt-4">
                  <p
                    className="mt-2 text-decoration-underline"
                    onClick={openSelectPOModal}
                  >
                    Select
                  </p>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Vendor Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder=""
                      fdprocessedid="qv9ju9"
                      value={selectedPO?.supplier_name || ""}
                      disabled
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label>PO Value</label>
                    <input
                      className="form-control"
                      type="number"
                      value={selectedPO?.total_value || ""}
                      disabled
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>GSTIN</label>
                    <input
                      className="form-control"
                      type="text"
                      // value={formData.gstin}
                      value={selectedPO?.gstin || ""}
                      disabled
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>PAN</label>
                    <input
                      className="form-control"
                      type="text"
                      // value={formData.pan}
                      value={selectedPO?.pan || ""}
                      disabled
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-md-3 mt-2 ">
                  <div className="form-group">
                    <label>Bill Date</label>
                    <input
                      className="form-control"
                      type="date"
                      name="bill_date"
                      value={formData.bill_date}
                      onChange={handleInputChange}
                      placeholder=""
                    />
                  </div>
                </div>

                <div className="col-md-3 mt-2 ">
                  <div className="form-group">
                    <label>Bill Number</label>
                    <input
                      className="form-control"
                      type="text"
                      name="bill_no"
                      value={formData.bill_no}
                      onChange={handleInputChange}
                      placeholder=""
                      // disabled
                    />
                  </div>
                </div>

                <div className="col-md-3  mt-2">
                  <div className="form-group">
                    <label>Bill Amount</label>
                    <input
                      className="form-control"
                      type="text"
                      name="bill_amount"
                      value={formData.bill_amount}
                      onChange={handleInputChange}
                      placeholder=""
                    />
                  </div>
                </div>

                <div className="col-md-3  mt-2">
                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      className="form-control"
                      type="text"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleInputChange}
                      placeholder="DD/MM/YY"
                      readOnly
                      disabled
                    />
                  </div>
                </div>

                <div className="col-md-3 mt-2 ">
                  <div className="form-group">
                    <label>Bill Recieved Date</label>
                    <input
                      className="form-control"
                      type="date"
                      name="bill_received_date"
                      value={formData.bill_received_date}
                      onChange={handleInputChange}
                      placeholder=""
                    />
                  </div>
                </div>

                {/* <div className="row"> */}
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Vendor Remark</label>
                    <textarea
                      className="form-control"
                      rows={1}
                      name="vendor_remark"
                      value={formData.vendor_remark}
                      onChange={handleInputChange}
                      placeholder="Enter ..."
                      disabled
                    />
                  </div>
                </div>
                {/* </div> */}
                {/* <div className="row"> */}
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Remark</label>
                    <textarea
                      className="form-control"
                      rows={1}
                      placeholder="Enter ..."
                      defaultValue={""}
                    />
                  </div>
                  {/* </div> */}
                </div>
                {/* <div className="row"> */}
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Comments</label>
                    <textarea
                      className="form-control"
                      rows={1}
                      placeholder="Enter ..."
                      defaultValue={""}
                    />
                  </div>
                  {/* </div> */}
                </div>
              </div>
              {/* </div> */}
              <div className="d-flex justify-content-between mt-5">
                <h5 className=" ">Supporting Documents</h5>
                <div className="card-tools d-flex">
                  <div>
                    <button
                      className="purple-btn2 me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#RevisionModal"
                      onClick={openattachModal}
                    >
                      + Attach Document
                    </button>
                  </div>
                </div>
              </div>
              <div className="tbl-container mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th className="text-start">Sr. No.</th>
                      <th className="text-start">Document Name</th>
                      <th className="text-start">No. of Documents</th>
                      <th className="text-start">Attach Additional Copy</th>
                    </tr>
                  </thead>
                  {/* // Replace your existing table body with this */}
                  <tbody>
                    {documents.map((doc, index) => (
                      <tr key={index}>
                        <td className="text-start">{index + 1}</td>
                        <td className="text-start">{doc.document_type}</td>
                        <td
                          className="text-start"
                          style={{
                            color: "#8b0203",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleDocumentCountClick(doc.document_type)
                          }
                        >
                          {doc.attachments.length}
                        </td>
                        <td className="text-start">
                          <button
                            className="text-decoration-underline border-0 bg-transparent"
                            style={{
                              color: "#8b0203",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setNewDocument((prev) => ({
                                ...prev,
                                document_type: doc.document_type,
                              }));
                              openattachModal();
                            }}
                          >
                            + Attach
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="row mt-2 justify-content-center">
                <div className="col-md-2 mt-2">
                  <button
                    className="purple-btn2 w-100"
                    onClick={handleBillEntrySubmit}
                  >
                    Submit
                  </button>
                </div>
                <div className="col-md-2">
                  <button className="purple-btn1 w-100">Cancel</button>
                </div>
              </div>
              <h5 className=" mt-3">Audit Log</h5>
              <div className="pb-4 mb-4">
                <Table columns={auditLogColumns} data={auditLogData} />
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
          <p>loading...</p>
        </div>
      )}

      <Modal
        centered
        size="lg"
        show={viewDocumentModal}
        onHide={() => {
          setviewDocumentModal(false);
          setSelectedDocument(null);
        }}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Document Attachment</h5>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="d-flex justify-content-between mt-3 me-2">
              <h5>Latest Documents</h5>
              <div className="card-tools d-flex">
                <button
                  className="purple-btn2 rounded-3"
                  onClick={() => {
                    setviewDocumentModal(false);
                    setNewDocument((prev) => ({
                      ...prev,
                      document_type: selectedDocument?.document_type,
                    }));
                    openattachModal();
                  }}
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
                  <span>Attach</span>
                </button>
              </div>
            </div>
            <div className="tbl-container px-0">
              <table className="w-100">
                <thead>
                  <tr>
                    <th>Sr.No.</th>
                    <th>Document Name</th>
                    <th>Attachment Name</th>
                    <th>Upload Date</th>
                    {/* <th>Uploaded By</th> */}
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {selectedDocument?.attachments.map((attachment, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{selectedDocument.document_type}</td>
                      <td>{attachment.filename}</td>
                      <td>{new Date().toLocaleDateString()}</td>
                      {/* <td>vendor user</td> */}
                      {/* <td>
                        <button
                          className="border-0 bg-transparent"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = `data:${attachment.content_type};base64,${attachment.content}`;
                            link.download = attachment.filename;
                            link.click();
                          }}
                        >
                          <DownloadIcon />
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 me-2">
              <h5>Document Attachment History</h5>
            </div>
            <div className="tbl-container px-0">
              <table className="w-100">
                <thead>
                  <tr>
                    <th>Sr.No.</th>
                    <th>Document Name</th>
                    <th>Attachment Name</th>
                    <th>Upload Date</th>
                    {/* <th>Uploaded By</th> */}
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {selectedDocument?.attachments.map((attachment, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{selectedDocument.document_type}</td>
                      <td>{attachment.filename}</td>
                      <td>{new Date().toLocaleDateString()}</td>
                      {/* <td>vendor user</td> */}
                      {/* <td>
                        <button
                          className="border-0 bg-transparent"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = `data:${attachment.content_type};base64,${attachment.content}`;
                            link.download = attachment.filename;
                            link.click();
                          }}
                        >
                          <DownloadIcon />
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-3">
              <button
                className="purple-btn1 w-100"
                onClick={() => {
                  setviewDocumentModal(false);
                  setSelectedDocument(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* <Modal
        centered
        size="l"
        show={attachModal}
        onHide={closeattachModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Attach Document</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label>Name of the Document</label>
                {newDocument.document_type &&
                documents.find(
                  (doc) =>
                    doc.isDefault &&
                    doc.document_type === newDocument.document_type
                ) ? (
                  // For default document types - show as disabled input
                  <input
                    type="text"
                    className="form-control"
                    value={newDocument.document_type}
                    disabled
                  />
                ) : (
                  // For new document types - allow input
                  <input
                    type="text"
                    className="form-control"
                    value={newDocument.document_type}
                    onChange={(e) =>
                      setNewDocument((prev) => ({
                        ...prev,
                        document_type: e.target.value,
                      }))
                    }
                    placeholder="Enter document name"
                  />
                )}
              </div>
            </div>
            <div className="col-md-12 mt-2">
              <div className="form-group">
                <label>Upload File</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-4">
              <button
                className="purple-btn2 w-100"
                onClick={handleAttachDocument}
                disabled={
                  !newDocument.document_type ||
                  newDocument.attachments.length === 0
                }
              >
                Attach
              </button>
            </div>
            <div className="col-md-4">
              <button className="purple-btn1 w-100" onClick={closeattachModal}>
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}

      <Modal
        centered
        size="l"
        show={attachModal}
        onHide={closeattachModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Attach Document</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label>Name of the Document</label>
                {newDocument.document_type &&
                documents.find(
                  (doc) =>
                    doc.isDefault &&
                    doc.document_type === newDocument.document_type
                ) ? (
                  // For default document types - show as disabled input
                  <input
                    type="text"
                    className="form-control"
                    value={newDocument.document_type}
                    disabled
                  />
                ) : (
                  // For new document types - allow input
                  <input
                    type="text"
                    className="form-control"
                    value={newDocument.document_type}
                    onChange={(e) =>
                      setNewDocument((prev) => ({
                        ...prev,
                        document_type: e.target.value,
                      }))
                    }
                    placeholder="Enter document name"
                  />
                )}
              </div>
            </div>
            <div className="col-md-12 mt-2">
              <div className="form-group">
                <label>Upload File</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>
            </div>
            {/* Add this new section for file name editing */}
            {newDocument.attachments.length > 0 && (
              <div className="col-md-12 mt-2">
                <div className="form-group">
                  <label>File Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newDocument.attachments[0].filename}
                    onChange={(e) => {
                      setNewDocument((prev) => ({
                        ...prev,
                        attachments: [
                          {
                            ...prev.attachments[0],
                            filename: e.target.value,
                          },
                        ],
                      }));
                    }}
                    placeholder="Enter file name"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-4">
              <button
                className="purple-btn2 w-100"
                onClick={handleAttachDocument}
                disabled={
                  !newDocument.document_type ||
                  newDocument.attachments.length === 0
                }
              >
                Attach
              </button>
            </div>
            <div className="col-md-4">
              <button className="purple-btn1 w-100" onClick={closeattachModal}>
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        centered
        size="xl"
        show={selectPOModal}
        onHide={closeSelectPOModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <h5>Select PO</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Company</label>
                <SingleSelector
                  options={companies}
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                  placeholder="Select Company"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Project</label>
                <SingleSelector
                  options={projects}
                  value={selectedProject}
                  onChange={handleProjectChange}
                  placeholder="Select Project"
                  isDisabled={!selectedCompany}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Sub-Project</label>
                <SingleSelector
                  options={sites}
                  value={selectedSite}
                  onChange={handleSiteChange}
                  placeholder="Select Sub-Project"
                  isDisabled={!selectedProject}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>From Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filterParams.startDate}
                  onChange={(e) =>
                    setFilterParams((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>To Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filterParams.endDate}
                  onChange={(e) =>
                    setFilterParams((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>PO Type</label>
                <SingleSelector
                  options={poTypes}
                  value={
                    poTypes.find(
                      (type) => type?.value === filterParams?.poType
                    ) || poTypes[0]
                  }
                  onChange={handlePOTypeChange}
                  placeholder="Select PO Type"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>PO Number</label>
                <MultiSelector
                  options={poOptions}
                  value={selectedPONumbers}
                  onChange={(selected) => setSelectedPONumbers(selected)}
                  placeholder="Select PO Numbers"
                  isMulti={true}
                />
              </div>
            </div>
          </div>
          <div className="row mt-3 justify-content-center">
            <div className="col-md-3">
              <button className="purple-btn2 w-100" onClick={handleSearch}>
                Search
              </button>
            </div>
            <div className="col-md-3">
              <button className="purple-btn1 w-100" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="tbl-container mx-3 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      {/* <th className="text-start">
                        <input
                          type="checkbox"
                          checked={selectedPOs.length === purchaseOrders.length}
                          onChange={handleSelectAll}
                        />
                      </th> */}
                      <th className="text-start">Sr.No</th>
                      <th className="text-start">PO Number</th>
                      <th className="text-start">PO Date</th>
                      <th className="text-start">PO Value</th>
                      <th className="text-start">PO Type</th>
                      <th className="text-start">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : purchaseOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No purchase orders found
                        </td>
                      </tr>
                    ) : (
                      purchaseOrders.map((po) => (
                        <tr key={po.id}>
                          {/* <td className="text-start">
                            <input
                              type="checkbox"
                              checked={selectedPOs.includes(po.id)}
                              onChange={() => handleCheckboxChange(po.id)}
                            />
                          </td> */}
                          <td className="text-start">{po.serialNumber}</td>
                          <td className="text-start">{po.po_number}</td>
                          <td className="text-start">{po.po_date}</td>
                          <td className="text-start">{po.total_value}</td>
                          <td className="text-start">{po.po_type}</td>
                          <td className="text-start">
                            <button
                              className="purple-btn2"
                              onClick={() => handlePOSelect(po)}
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {purchaseOrders.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="showing-entries"></div>
                  <nav>
                    <ul className="pagination">
                      <li
                        className={`page-item ${
                          pagination.current_page === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(1)}
                          disabled={pagination.current_page === 1}
                        >
                          First
                        </button>
                      </li>
                      <li
                        className={`page-item ${
                          pagination.current_page === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            handlePageChange(pagination.current_page - 1)
                          }
                          disabled={pagination.current_page === 1}
                        >
                          Prev
                        </button>
                      </li>
                      {getPageNumbers().map((page) => (
                        <li
                          key={page}
                          className={`page-item ${
                            page === pagination.current_page ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                      <li
                        className={`page-item ${
                          pagination.current_page === pagination.total_pages
                            ? "disabled"
                            : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            handlePageChange(pagination.current_page + 1)
                          }
                          disabled={
                            pagination.current_page === pagination.total_pages
                          }
                        >
                          Next
                        </button>
                      </li>
                      <li
                        className={`page-item ${
                          pagination.current_page === pagination.total_pages
                            ? "disabled"
                            : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            handlePageChange(pagination.total_pages)
                          }
                          disabled={
                            pagination.current_page === pagination.total_pages
                          }
                        >
                          Last
                        </button>
                      </li>
                    </ul>
                  </nav>
                  {getShowingEntriesText()}
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BillEntryListSubPage;
