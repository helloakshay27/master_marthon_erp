import React from "react";
import { DownloadIcon, Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import { Modal } from "react-bootstrap";
import { useState } from "react";

import { useEffect } from "react";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import SingleSelector from "../components/base/Select/SingleSelector";
import MultiSelector from "../components/base/Select/MultiSelector";

const BillEntryCreateVendorPage = () => {
  const [attachModal, setattachModal] = useState(false);
  const [viewDocumentModal, setviewDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [newDocument, setNewDocument] = useState({
    document_type: "",
    attachments: [],
  });

  const openattachModal = () => setattachModal(true);
  const closeattachModal = () => setattachModal(false);

  const [selectPOModal, setselectPOModal] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);
  const [loading, setLoading] = useState(false);
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
  const [poTypes, setPoTypes] = useState([
    { value: "", label: "Select Po Type" },
    { value: "Domestic", label: "Domestic" },
    { value: "ROPO", label: "ROPO" },
    { value: "Import", label: "Import" },
  ]);

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

  const [formData, setFormData] = useState({
    bill_no: "",
    bill_date: "",
    bill_amount: "",
    vendor_remark: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [poOptions, setPoOptions] = useState([]);
  const [selectedPONumbers, setSelectedPONumbers] = useState([]);

  const handlePOSelect = (po) => {
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
        poDateInput.value = po.po_date;
      }

      // Update PO Value
      const poValueInput = document.querySelector('input[name="po_value"]');
      if (poValueInput) {
        poValueInput.value = po.total_value;
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
    }

    closeSelectPOModal();
  };

  const handleCheckboxChange = (poId) => {
    setSelectedPOs((prev) => {
      if (prev.includes(poId)) {
        return prev.filter((id) => id !== poId);
      } else {
        return [...prev, poId];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedPOs(purchaseOrders.map((po) => po.id));
    } else {
      setSelectedPOs([]);
    }
  };
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

  // Fetch initial PO data when component mounts
  useEffect(() => {
    fetchPurchaseOrders(null, null, null, {
      page: 1,
      pageSize: pageSize,
    });
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
      selectedCompany?.value || null,
      selectedProject?.value || null,
      selectedSite?.value || null,
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

  // Function to handle the next step
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Function to handle the previous step
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  // tax table functionality

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

  const handleAttachDocument = () => {
    if (newDocument.document_type && newDocument.attachments.length > 0) {
      // Check if document type already exists
      const existingDocIndex = documents.findIndex(
        (doc) => doc.document_type === newDocument.document_type
      );

      if (existingDocIndex !== -1) {
        // If document type exists, append new attachments
        const updatedDocuments = [...documents];
        updatedDocuments[existingDocIndex].attachments = [
          ...updatedDocuments[existingDocIndex].attachments,
          ...newDocument.attachments,
        ];
        setDocuments(updatedDocuments);
      } else {
        // If document type doesn't exist, add new document
        setDocuments((prev) => [...prev, newDocument]);
      }

      // Reset new document state
      setNewDocument({
        document_type: "",
        attachments: [],
      });
      closeattachModal();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
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

  const handleBillEntrySubmit = async () => {
    try {
      setLoading(true);
      // Validate required fields
      if (!selectedPO?.id) {
        alert("Please select a Purchase Order");
        return;
      }
      // if (!formData.bill_no) {
      //   alert("Please enter Bill Number");
      //   return;
      // }
      if (!formData.bill_date) {
        alert("Please enter Bill Date");
        return;
      }
      if (!formData.bill_amount) {
        alert("Please enter Bill Amount");
        return;
      }
      if (documents.length === 0) {
        alert("Please attach at least one document");
        return;
      }

      // Create payload
      const payload = {
        bill_entry: {
          purchase_order_id: selectedPO.id,
          bill_no: formData.bill_no,
          bill_date: formData.bill_date,
          bill_amount: parseFloat(formData.bill_amount),
          status: "draft",
          mode_of_submission: "Online",
          vendor_remark: formData.vendor_remark,
          documents: documents.map((doc) => ({
            document_type: doc.document_type,
            attachments: doc.attachments.map((attachment) => ({
              filename: attachment.filename,
              content_type: attachment.content_type,
              content: attachment.content,
            })),
          })),
        },
      };

      // Make API call
      const response = await axios.post(
        `${baseURL}bill_entries?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        payload
      );

      if (response.data) {
        alert("Bill entry created successfully");
        setLoading(false);
        // Reset form
        setFormData({
          bill_no: "",
          bill_date: "",
          bill_amount: "",
          vendor_remark: "",
        });
        setSelectedPO(null);
        setDocuments([]);
      }
    } catch (error) {
      console.error("Error creating bill entry:", error);
      alert("Failed to create bill entry. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  const handlePOTypeChange = (selected) => {
    if (!selected) return;
    setFilterParams((prev) => ({
      ...prev,
      poType: selected.value || "",
    }));
  };

  return (
    <>
      <div className="website-content">
        <div className="module-data-section ms-2">
          <a href="">
            Home &gt; Security &gt; Bill Entry List &gt; Bill Submission (For
            Billing User)
          </a>
          <h5 className="mt-3"> Bill Submission (For Vendor login)</h5>
          <div className="row align-items-center container-fluid">
            <div className="col-md-12 ">
              <div className="card p-3 mt-2">
                <div className="row">
                  {/* <div className="col-md-3">
                    <div className="form-group">
                      <label>Vendor Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div> */}
                  {/* <div className="col-md-1">
                    <p className="mt-2 text-decoration-underline">
                      View Details
                    </p>
                  </div> */}

                  {/* <div className="row"> */}
                  {/* <div className="col-md-3">
                    <div className="form-group">
                      <label>PO Number</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                        fdprocessedid="3x7jfv"
                      >
                        <option selected="selected">Alabama</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Delaware</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Washington</option>
                      </select>
                    </div>
                  </div> */}
                  <div className="col-md-2 ">
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
                  <div
                    className="col-md-1 pt-4"
                    data-bs-toggle="modal"
                    data-bs-target="#selectModal"
                  >
                    <p
                      className="mt-2 text-decoration-underline"
                      onClick={openSelectPOModal}
                    >
                      Select
                    </p>
                  </div>
                  {/* <div className="col-md-3 ">
                    <div className="form-group">
                      <label>Bill Number</label>
                      <input
                        className="form-control"
                        type="text"
                        name="bill_no"
                        value={formData.bill_no}
                        onChange={handleInputChange}
                        placeholder=""
                      />
                    </div>
                  </div> */}
                  <div className="col-md-3 ">
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

                  <div className="col-md-3 ">
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

                  {/* <div className="row"> */}
                  <div className="col-md-3 ">
                    <div className="form-group">
                      <label>Vendor Remark</label>
                      <textarea
                        className="form-control"
                        rows={1}
                        name="vendor_remark"
                        value={formData.vendor_remark}
                        onChange={handleInputChange}
                        placeholder="Enter ..."
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
                        disabled
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
                    {/* </div> */}
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-5 ">
                  <h5 className=" ">Supporting Documents</h5>
                  <div className="card-tools d-flex">
                    {/* <button
                      className="purple-btn2 me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#AttachModal"
                      onClick={openremarkModal}
                    >
                      Revision Req.
                    </button> */}
                    <div>
                      <button
                        className="purple-btn2 me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#RevisionModal"
                        onClick={openattachModal}
                      >
                        Attach Document
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
                        <th className="text-start">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No documents added yet
                          </td>
                        </tr>
                      ) : (
                        documents.map((doc, index) => (
                          <tr key={index}>
                            <td className="text-start">{index + 1}</td>
                            <td className="text-start">{doc.document_type}</td>
                            <td
                              className="text-start"
                              // style={{ cursor: "pointer" }}
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
                                onClick={() => {
                                  setNewDocument((prev) => ({
                                    ...prev,
                                    document_type: doc.document_type,
                                  }));
                                  openattachModal();
                                }}
                              >
                                Attach Another Document
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="row mt-2 justify-content-center">
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
                      <p>loading..</p>
                    </div>
                  )}

                  <div className="col-md-2">
                    <button
                      className="purple-btn2 w-100"
                      onClick={handleBillEntrySubmit}
                    >
                      Submit
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button
                      className="purple-btn1 w-100"
                      onClick={() => {
                        setFormData({
                          bill_no: "",
                          bill_date: "",
                          bill_amount: "",
                          vendor_remark: "",
                        });
                        setSelectedPO(null);
                        setDocuments([]);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
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
          <p>Updating...</p>
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
                    <th>Uploaded By</th>
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
                      <td>vendor user</td>
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
          <h5>Attach Other Document</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label>Name of the Document</label>
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
      </Modal>

      <Modal
        centered
        size="xl"
        show={selectPOModal}
        onHide={closeSelectPOModal}
        backdrop="static"
        keyboard={false}
        // className="modal-centered-custom"
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
            {/* <div className="col-md-12 d-flex justify-content-end gap-2">
                                <button
                                  className="btn btn-secondary"
                                  onClick={handleReset}
                                  disabled={loading}
                                >
                                  Reset
                                </button>
                                <button
                                  className="btn btn-primary"
                                  onClick={handleSearch}
                                  disabled={loading}
                                >
                                  Search
                                </button>
                              </div> */}
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
                      <th className="text-start">
                        <input
                          type="checkbox"
                          checked={selectedPOs.length === purchaseOrders.length}
                          onChange={handleSelectAll}
                        />
                      </th>
                      {/* <th></th> */}
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
                      purchaseOrders.map((po, index) => (
                        <tr key={po.id}>
                          <td className="text-start">
                            <input
                              type="checkbox"
                              checked={selectedPOs.includes(po.id)}
                              onChange={() => handleCheckboxChange(po.id)}
                            />
                          </td>
                          {/* <td className="text-start">{index + 1}</td> */}
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
    </>
  );
};

export default BillEntryCreateVendorPage;
