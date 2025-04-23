import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import SingleSelector from "../components/base/Select/SingleSelector";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";

const PoAdvanceNotePayment = () => {
  const [activeTab, setActiveTab] = useState("pills-home");
  const [showRows, setShowRows] = useState(false); // Controls visibility of dynamic rows
  const [makeCashModal, setmakeCashModal] = useState(false);
  const [makeBankModal, setmakeBankModal] = useState(false);
  const [makeAdjustModal, setmakeAdjustModal] = useState(false);
  const [selectPOModal, setselectPOModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);
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
  const [pageSize, setPageSize] = useState(5);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedPOs, setSelectedPOs] = useState([]);
  const [poTypes, setPoTypes] = useState([
    { value: "", label: "All" },
    { value: "Domestic", label: "Domestic" },
    { value: "ROPO", label: "ROPO" },
    { value: "Import", label: "Import" },
  ]);

  // add row & delete row
  const [tableRows, setTableRows] = useState([
    { id: 1, type: "Tax Type 1", charges: "100", inclusive: false },
  ]);

  const handleAddRow = () => {
    const newRow = { id: Date.now(), type: "", charges: "", inclusive: false };
    setTableRows([...tableRows, newRow]);
  };

  const handleDeleteRow = (id) => {
    setTableRows(tableRows.filter((row) => row.id !== id));
  };

  const handleChange = (id, field, value) => {
    setTableRows(
      tableRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };
  // add row & delete row

  const openCashModal = () => setmakeCashModal(true);
  const closeCashModal = () => setmakeCashModal(false);

  const openBankModal = () => setmakeBankModal(true);
  const closeBankModal = () => setmakeBankModal(false);

  const openAdjustModal = () => setmakeAdjustModal(true);
  const closeAdjustModal = () => setmakeAdjustModal(false);

  const openSelectPOModal = () => {
    setselectPOModal(true);
  };

  const closeSelectPOModal = () => {
    setselectPOModal(false);
  };

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

      // Always add pagination parameters
      url += `&page=${filters.page || 1}`;
      url += `&per_page=${filters.pageSize || 5}`;

      const response = await axios.get(url);
      setPurchaseOrders(response.data.purchase_orders);

      if (response.data.pagination) {
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
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({
      ...prev,
      current_page: 1,
    }));

    fetchPurchaseOrders(
      selectedCompany?.value,
      selectedProject?.value,
      selectedSite?.value,
      {
        ...filterParams,
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
    });
    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedSite(null);
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

  const [rows, setRows] = useState([
    {
      id: 1,
      type: "Tax Type 1",
      charges: "200",
      inclusive: false,
      amount: 50.0,
    },
    {
      id: 2,
      type: "Tax Type 2",
      charges: "200",
      inclusive: true,
      amount: 75.0,
    },
    {
      id: 3,
      type: "Tax Type 3",
      charges: "300",
      inclusive: false,
      amount: 25.0,
    },
  ]);

  // Toggle visibility of rows
  const toggleRows = () => {
    setShowRows((prev) => !prev);
  };

  // Delete a specific row
  const deleteRow = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  // Calculate Sub Total (Addition)
  const calculateSubTotal = () => {
    return rows.reduce((total, row) => total + row.amount, 0).toFixed(2); // Sum of all amounts
  };
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
        "https://marathon.lockated.com/pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
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

  const [documentRows, setDocumentRows] = useState([{ srNo: 1, upload: null }]);
  const documentRowsRef = useRef(documentRows);

  const handleAddDocumentRow = () => {
    const newRow = { srNo: documentRows.length + 1, upload: null };
    documentRowsRef.current.push(newRow);
    setDocumentRows([...documentRowsRef.current]);
  };

  const handleRemoveDocumentRow = (index) => {
    if (documentRows.length > 1) {
      const updatedRows = documentRows.filter((_, i) => i !== index);

      // Reset row numbers properly
      updatedRows.forEach((row, i) => {
        row.srNo = i + 1;
      });

      documentRowsRef.current = updatedRows;
      setDocumentRows([...updatedRows]);
    }
  };

  const handleFileChange = (index, file) => {
    if (!file) return; // Ensure a file is selected

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];

      documentRowsRef.current[index].upload = {
        filename: file.name,
        content: base64String,
        content_type: file.type,
      };

      setDocumentRows([...documentRowsRef.current]);
    };

    reader.readAsDataURL(file);

    // Reset the input field to allow re-selecting the same file
    const inputElement = document.getElementById(`file-input-${index}`);
    if (inputElement) {
      inputElement.value = ""; // Clear input value
    }
  };

  return (
    <>
      <div className="main-concent">
        <div className="website-content overflow-auto">
          <div className="module-data-section container-fluid ms-2">
            <a href="">Home &gt; Billing &amp; Accounts &gt; Advance </a>
            <h5 className="mt-3">Advance </h5>
            <div className="row my-4 align-items-center">
              <div className="col-md-12 px-2">
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
                      <div className="mor-tabs mt-4">
                        <ul
                          className="nav nav-pills mb-3 justify-content-center"
                          id="pills-tab"
                          role="tablist"
                          style={{ boxShadow: "none", backgroundColor: "#fff" }}
                        >
                          <li className="nav-item" role="presentation">
                            <button
                              className={`nav-link ${
                                activeTab === "pills-home" ? "active" : ""
                              }`}
                              id="pills-home-tab"
                              onClick={() => handleTabChange("pills-home")}
                              role="tab"
                              aria-controls="pills-home"
                              aria-selected={activeTab === "pills-home"}
                            >
                              MOR
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className={`nav-link ${
                                activeTab === "pills-profile" ? "active" : ""
                              }`}
                              id="pills-profile-tab"
                              onClick={() => handleTabChange("pills-profile")}
                              role="tab"
                              aria-controls="pills-profile"
                              aria-selected={activeTab === "pills-profile"}
                            >
                              MOR Approval
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className={`nav-link ${
                                activeTab === "pills-contact" ? "active" : ""
                              }`}
                              id="pills-contact-tab"
                              onClick={() => handleTabChange("pills-contact")}
                              role="tab"
                              aria-controls="pills-contact"
                              aria-selected={activeTab === "pills-contact"}
                            >
                              PO
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className={`nav-link ${
                                activeTab === "pills-advance" ? "active" : ""
                              }`}
                              id="pills-advance-tab"
                              onClick={() => handleTabChange("pills-advance")}
                              role="tab"
                              aria-controls="pills-advance"
                              aria-selected={activeTab === "pills-advance"}
                            >
                              Advance
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className={`nav-link ${
                                activeTab === "pills-material" ? "active" : ""
                              }`}
                              id="pills-material-tab"
                              onClick={() => handleTabChange("pills-material")}
                              role="tab"
                              aria-controls="pills-material"
                              aria-selected={activeTab === "pills-material"}
                            >
                              Material Received
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className={`nav-link ${
                                activeTab === "pills-billing" ? "active" : ""
                              }`}
                              id="pills-billing-tab"
                              onClick={() => handleTabChange("pills-billing")}
                              role="tab"
                              aria-controls="pills-billing"
                              aria-selected={activeTab === "pills-billing"}
                            >
                              Billing
                            </button>
                          </li>
                        </ul>
                      </div>
                      {/* <div className="row justify-content-center my-4">
                <div className="col-md-10">
                  <div className="progress-steps">
                    <div className="top">
                      <div className="progress">
                        <span />
                      </div>
                      <div className="steps">
                        <div className="layer1">
                          <div className="step active" data-step={1}>
                            <span />
                          </div>
                          <p>layer1</p>
                        </div>
                        <div className="layer1">
                          <div className="step active" data-step={2}>
                            <span />
                          </div>
                          <p>layer2</p>
                        </div>
                        <div className="layer1">
                          <div className="step active" data-step={3}>
                            <span />
                          </div>
                          <p>layer3</p>
                        </div>
                        <div className="layer1">
                          <div className="step active" data-step={4}>
                            <span />
                          </div>
                          <p>layer4</p>
                        </div>
                      </div>
                    </div>
                    <div className="buttons d-m">
                      <button className="btn btn-prev disabled" disabled="">
                        prev
                      </button>
                      <button className="btn btn-next">Next</button>
                    </div>
                  </div>
                </div>
              </div> */}
                      {/* <div className="row justify-content-center my-4">
                      <div className="col-md-10">
                        <div className="progress-steps">
                          <div className="top">
                            <div className="progress">
                              <span
                                style={{
                                  width: `${
                                    ((currentStep - 1) / (totalSteps - 1)) * 100
                                  }%`,
                                }}
                              ></span>
                            </div>
                            <div className="steps">
                              {[...Array(totalSteps)].map((_, index) => (
                                <div className="layer1" key={index}>
                                  <div
                                    className={`step ${
                                      currentStep > index + 1 ? "active" : ""
                                    }`}
                                    data-step={index + 1}
                                  >
                                    <span></span>
                                  </div>
                                  <p>layer{index + 1}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="buttons d-m">
                            <button
                              className="btn btn"
                              onClick={handlePrev}
                              disabled={currentStep === 1}
                            >
                              Prev
                            </button>
                            <button
                              className="btn btn-next"
                              onClick={handleNext}
                              disabled={currentStep === totalSteps}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </div> */}
                      <div className="row justify-content-center my-4">
                        <div className="col-md-10">
                          <div className="progress-steps">
                            <div className="top">
                              <div className="progress">
                                <span
                                  style={{
                                    width: `${
                                      ((currentStep - 1) / (totalSteps - 1)) *
                                      100
                                    }%`,
                                  }}
                                ></span>
                              </div>
                              <div className="steps">
                                {[...Array(totalSteps)].map((_, index) => (
                                  <div className="layer1" key={index}>
                                    <div
                                      className={`step ${
                                        currentStep > index + 1 ? "active" : ""
                                      }`}
                                      data-step={index + 1}
                                    >
                                      <span></span>
                                    </div>
                                    <p>Layer {index + 1}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="buttons d-m">
                              {/* Prev Button */}
                              <button
                                className={`btn btn-prev ${
                                  currentStep === 1 ? "disabled" : ""
                                }`}
                                onClick={handlePrev}
                                disabled={currentStep === 1}
                              >
                                Prev
                              </button>
                              {/* Next Button */}
                              <button
                                className={`btn btn-next ${
                                  currentStep === totalSteps ? "disabled" : ""
                                }`}
                                onClick={handleNext}
                                disabled={currentStep === totalSteps}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        {/* form-select EXAMPLE */}
                        <div
                          className="card card-default"
                          id="mor-material-details"
                        >
                          <div className="card-body mt-0">
                            <div className=" d-flex justify-content-end">
                              <a href="#" className="text-decoration-underline">
                                Existing Allocated PO &amp; Advance
                              </a>
                            </div>
                            <div className="row">
                              <div className="col-md-4 ">
                                <div className="form-group">
                                  <label>
                                    Company <span>*</span>
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
                                    Project <span>*</span>
                                  </label>
                                  <SingleSelector
                                    options={projects}
                                    value={selectedProject}
                                    onChange={handleProjectChange}
                                    placeholder="Select Project"
                                    isDisabled={!selectedCompany}
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Advance Number</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Default input"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Certificate Number</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Default input"
                                  />
                                </div>
                              </div>
                              <div className="col-md-3 mt-2">
                                <div className="form-group">
                                  <label>PO Number</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={selectedPO?.po_number || ""}
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-md-1 pt-4">
                                <p
                                  className="mt-2 text-decoration-underline cursor-pointer"
                                  onClick={openSelectPOModal}
                                >
                                  Select
                                </p>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>PO Date</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="po_date"
                                    value={selectedPO?.po_date || ""}
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>PO Value</label>
                                  <input
                                    className="form-control"
                                    type="number"
                                    name="po_value"
                                    value={selectedPO?.total_value || ""}
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Performa Number</label>
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
                                  <label>Performa Amount</label>
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
                                  <label>Invoice Date</label>
                                  <div
                                    id="datepicker"
                                    className="input-group date"
                                    data-date-format="mm-dd-yyyy"
                                  >
                                    <input
                                      className="form-control"
                                      type="text"
                                    />
                                    <span className="input-group-addon">
                                      <i
                                        className="fa-solid fa-calendar-days"
                                        style={{ color: "#8B0203" }}
                                      />{" "}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-3 mt-2">
                                <div className="form-group">
                                  <label>Supplier Name</label>
                                  <input
                                    className="form-control"
                                    type="number"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                  />
                                </div>
                              </div>
                              <div
                                className="col-md-1 pt-4"
                                data-bs-toggle="modal"
                                data-bs-target="#selectModal"
                              >
                                <p className="mt-2 text-decoration-underline">
                                  View Details
                                </p>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>GSTIN Number</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="gstin_number"
                                    value={selectedPO?.gstin || ""}
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>PAN Number</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="pan_number"
                                    value={selectedPO?.pan || ""}
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Advance %</label>
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
                                  <label>Advance Amount</label>
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
                                  <label>Net Payable</label>
                                  <input
                                    className="form-control"
                                    type="number"
                                    placeholder=""
                                    fdprocessedid="qv9ju9"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4  mt-2">
                                <div className="form-group">
                                  <label>Mode of Payment</label>
                                  <select
                                    className="form-control form-select"
                                    style={{ width: "100%" }}
                                    fdprocessedid="vk6j2k"
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
                              </div>
                              <div className="col-md-4 mt-2">
                                <div className="form-group">
                                  <label>Favoring / Payee</label>
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
                                  <label>Expected Payment Date</label>
                                  <div
                                    id="datepicker"
                                    className="input-group date"
                                    data-date-format="mm-dd-yyyy"
                                  >
                                    <input
                                      className="form-control"
                                      type="text"
                                    />
                                    <span className="input-group-addon">
                                      <i
                                        className="fa-solid fa-calendar-days"
                                        style={{ color: "#8B0203" }}
                                      />{" "}
                                    </span>
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
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between mt-3 me-2">
                              <h5 className=" ">Tax Details</h5>
                            </div>
                            <div className="tbl-container mx-3 mt-3">
                              <table className="w-100">
                                <thead>
                                  <tr>
                                    <th className="text-start">
                                      Tax / Charge Type
                                    </th>
                                    <th className="text-start">
                                      Tax / Charges per UOM (INR)
                                    </th>
                                    <th className="text-start">
                                      Inclusive / Exclusive
                                    </th>
                                    <th className="text-start">Amount</th>
                                    <th className="text-start">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* Static Rows */}
                                  <tr>
                                    <th className="text-start">
                                      Total Base Cost
                                    </th>
                                    <td className="text-start" />
                                    <td className="text-start" />
                                    <td className="text-start">3000</td>
                                    <td />
                                  </tr>
                                  <tr>
                                    <th className="text-start">
                                      Addition Tax & Charges
                                    </th>
                                    <td className="text-start" />
                                    <td className="text-start" />
                                    <td className="text-start" />
                                    <td onClick={toggleRows}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-plus-circle"
                                        viewBox="0 0 16 16"
                                        style={{
                                          transform: showRows
                                            ? "rotate(45deg)"
                                            : "none",
                                          transition: "transform 0.3s ease",
                                        }}
                                      >
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                                      </svg>
                                    </td>
                                  </tr>
                                  {/* Dynamic Rows */}
                                  {showRows &&
                                    rows.map((row) => (
                                      <tr key={row.id}>
                                        <td className="text-start">
                                          <select className="form-control form-select">
                                            <option selected>{row.type}</option>
                                            <option>Other Type</option>
                                          </select>
                                        </td>
                                        <td className="text-start">
                                          <select className="form-control form-select">
                                            <option selected>
                                              {row.charges}
                                            </option>
                                            <option>Other Charges</option>
                                          </select>
                                        </td>
                                        <td className="text-center">
                                          <input
                                            type="checkbox"
                                            checked={row.inclusive}
                                            readOnly
                                          />
                                        </td>
                                        <td className="text-start">
                                          {row.amount.toFixed(2)}
                                        </td>
                                        <td
                                          className="text-start"
                                          onClick={() => deleteRow(row.id)}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-dash-circle"
                                            viewBox="0 0 16 16"
                                            style={{
                                              transition: "transform 0.3s ease",
                                            }}
                                          >
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"></path>
                                          </svg>
                                        </td>
                                      </tr>
                                    ))}
                                  {/* Dynamic Sub Total Row */}
                                  {showRows && (
                                    <tr>
                                      <th className="text-start">
                                        Sub Total A (Addition)
                                      </th>
                                      <td className="text-start" />
                                      <td className="" />
                                      <td className="text-start">
                                        {calculateSubTotal()}
                                      </td>
                                      <td />
                                    </tr>
                                  )}
                                  {/* Static Rows */}
                                  <tr>
                                    <th className="text-start">Gross Amount</th>
                                    <td className="text-start" />
                                    <td className="" />
                                    <td className="text-start">3540</td>
                                    <td />
                                  </tr>
                                  <tr>
                                    <th className="text-start">
                                      Deduction Tax
                                    </th>
                                    <td className="text-start" />
                                    <td className="" />
                                    <td className="text-start" />
                                    <td />
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="d-flex justify-content-between mt-3 me-2">
                              <h5 className=" ">Advance Amount Bifurcation</h5>
                            </div>
                            <div className="tbl-container mx-3 mt-3">
                              <table className="w-100">
                                <thead>
                                  <tr>
                                    <th className="text-start">Sub-Project</th>
                                    <th className="text-start">MOR Number</th>
                                    <th className="text-start">
                                      Advance Amount
                                    </th>
                                    <th className="text-start">Paid Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="text-start">Cedar</td>
                                    <td className="text-start">MOR123</td>
                                    <td className="text-start">1170</td>
                                    <td className="text-start">1770</td>
                                  </tr>
                                  <tr>
                                    <td className="text-start">Bodhi</td>
                                    <td className="text-start">MOR123</td>
                                    <td className="text-start">1170</td>
                                    <td className="text-start">1770</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="d-flex justify-content-between mt-3 me-2">
                              <h5 className=" ">Payment Details</h5>
                              <div className="card-tools d-flex pe-1">
                                <div className="d-flex">
                                  <div className="px-2 pt-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={16}
                                      height={16}
                                      fill="currentColor"
                                      className="bi bi-check2"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                                    </svg>{" "}
                                  </div>
                                  <div>
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="CIN Verification"
                                      disabled=""
                                      fdprocessedid="qv9ju9"
                                    />
                                  </div>
                                </div>
                                <div className="d-flex">
                                  <div className="px-2 pt-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={16}
                                      height={16}
                                      fill="currentColor"
                                      className="bi bi-check2"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                                    </svg>{" "}
                                  </div>
                                  <div>
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="CIN Details"
                                      disabled=""
                                      fdprocessedid="qv9ju9"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="tbl-container mx-3 mt-3">
                              <table className="w-100">
                                <thead>
                                  <tr>
                                    <th className="text-start">
                                      Mode of Payment
                                    </th>
                                    <th className="text-start">
                                      Instrument Date
                                    </th>
                                    <th className="text-start">
                                      Instrument No.
                                    </th>
                                    <th className="text-start">UTR NO.</th>
                                    <th className="text-start">
                                      Bank / Cash Account
                                    </th>
                                    <th className="text-start">Amount</th>
                                    <th className="text-start">Created by</th>
                                    <th className="text-start">Created On</th>
                                    <th className="text-start">Status</th>
                                    <th className="text-start">
                                      Reconsilation Date
                                    </th>
                                    <th className="text-start">Cheque Print</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="text-start">1</td>
                                    <td className="text-start" />
                                    <td className="text-start" />
                                    <td className="text-start" />
                                    <td className="text-start" />
                                    <td className="text-start" />
                                    <td className="text-start" />
                                    <td className="text-start" />
                                    <td className="text-start" />
                                    <td className="text-start" />
                                    <td className="text-start text-decoration-underline">
                                      Print
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="row mt-2 justify-content-center">
                              <div
                                className="col-md-3"
                                data-bs-toggle="modal"
                                data-bs-target="#makecasheModal"
                                onClick={openCashModal}
                              >
                                <button
                                  className="purple-btn2 w-100"
                                  fdprocessedid="u33pye"
                                >
                                  Make Cash Payment
                                </button>
                              </div>
                              <div
                                className="col-md-3"
                                data-bs-toggle="modal"
                                data-bs-target="#makebankModal"
                                onClick={openBankModal}
                              >
                                <button
                                  className="purple-btn2 w-100"
                                  fdprocessedid="af5l5g"
                                >
                                  Make Bank Payment
                                </button>
                              </div>
                              <div
                                className="col-md-3"
                                data-bs-toggle="modal"
                                data-bs-target="#makeadjustmentModal"
                                onClick={openAdjustModal}
                              >
                                <button
                                  className="purple-btn2 w-100"
                                  fdprocessedid="af5l5g"
                                >
                                  Make Adjustment Entry
                                </button>
                              </div>
                            </div>
                            {/* <div className="row mt-4 justify-content-start align-items-center">
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label>Attchment</label>
                                  <input
                                    className="form-control"
                                    type="file"
                                    placeholder="Default input"
                                  />
                                </div>
                              </div>
                              <div className="col-md-8">
                                <div className="tbl-container me-2 mt-3">
                                  <table className="w-100">
                                    <thead className="w-100">
                                      <tr>
                                        <th className="main2-th">
                                          Document Name
                                        </th>
                                        <th className="main2-th">
                                          Upload Date
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <th>MTO Copy.pdf</th>
                                        <td>03-03-2024</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div> */}

                            <div>
                              <div className="d-flex justify-content-between align-items-end mx-1 mt-5">
                                <h5 className="mt-3">
                                  Document Attachments{" "}
                                  <span
                                    style={{ color: "red", fontSize: "16px" }}
                                  >
                                    *
                                  </span>
                                </h5>
                                <button
                                  className="purple-btn2 mt-3"
                                  onClick={handleAddDocumentRow}
                                >
                                  <span className="material-symbols-outlined align-text-top me-2">
                                    add
                                  </span>
                                  <span>Add</span>
                                </button>
                              </div>

                              <Table
                                columns={[
                                  { label: "Sr No", key: "srNo" },
                                  { label: "Upload File", key: "upload" },
                                  { label: "Action", key: "action" },
                                  { label: "view", key: "view" },
                                ]}
                                data={documentRows.map((row, index) => ({
                                  srNo: index + 1,
                                  upload: (
                                    <td style={{ border: "none" }}>
                                      {/* Hidden file input */}
                                      <input
                                        type="file"
                                        id={`file-input-${index}`}
                                        key={row?.srNo}
                                        style={{ display: "none" }} // Hide input
                                        onChange={(e) =>
                                          handleFileChange(
                                            index,
                                            e.target.files[0]
                                          )
                                        }
                                        accept=".xlsx,.csv,.pdf,.docx,.doc,.xls,.txt,.png,.jpg,.jpeg,.zip,.rar,.jfif,.svg,.mp4,.mp3,.avi,.flv,.wmv"
                                      />

                                      <label
                                        htmlFor={`file-input-${index}`}
                                        style={{
                                          display: "inline-block",
                                          width: "300px",
                                          padding: "10px",
                                          border: "1px solid #ccc",
                                          borderRadius: "4px",
                                          cursor: "pointer",
                                          color: "#555",
                                          backgroundColor: "#f5f5f5",
                                          textAlign: "center",
                                        }}
                                      >
                                        {row.upload?.filename
                                          ? row.upload.filename
                                          : "Choose File"}
                                      </label>
                                    </td>
                                  ),
                                  action: (
                                    <button
                                      className="btn btn-danger"
                                      onClick={() =>
                                        handleRemoveDocumentRow(index)
                                      }
                                      disabled={documentRows.length === 1}
                                    >
                                      Remove
                                    </button>
                                  ),
                                }))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
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
                  <div className="row w-100">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Comments</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          placeholder="Enter ..."
                          defaultValue={""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-4 justify-content-end align-items-center w-100">
                    <div className="col-md-3">
                      <div className="form-group d-flex gap-3 align-items-center">
                        <label style={{ fontSize: "1.1rem" }}>status</label>
                        <select
                          className="form-control form-select"
                          style={{ width: "100%" }}
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
                    </div>
                  </div>
                  <div className="row mt-2 justify-content-end w-100">
                    <div className="col-md-2">
                      <button className="purple-btn2 w-100">Print</button>
                    </div>
                    <div className="col-md-2">
                      <button className="purple-btn2 w-100">Submit</button>
                    </div>
                    <div className="col-md-2">
                      <button className="purple-btn1 w-100">Cancel</button>
                    </div>
                  </div>
                  <div className="row mt-2 w-100">
                    <div className="col-12 px-4">
                      <h5>Audit Log</h5>
                      <div className="mx-0">
                        <Table columns={auditLogColumns} data={auditLogData} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              ...
            </div>
            <div
              className="tab-pane fade"
              id="pills-contact"
              role="tabpanel"
              aria-labelledby="pills-contact-tab"
            >
              ...
            </div>
          </div>
        </div>
      </div>

      {/* cash modal start */}
      <Modal
        centered
        size="l"
        show={makeCashModal}
        onHide={closeCashModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Cash Payment Details</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Certifying Company</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Outstanding Amount</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  Voucher Date <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  Cash Account <span>*</span>
                </label>
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
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Closing Balance Amount</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  Favouring / Payee<span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  Amount<span>*</span>
                </label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Narration</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder=""
                  defaultValue={""}
                />
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-3">
              <button className="purple-btn2 w-100" fdprocessedid="u33pye">
                Submit
              </button>
            </div>
            <div className="col-md-3">
              <button className="purple-btn2 w-100" fdprocessedid="af5l5g">
                Reset
              </button>
            </div>
            <div className="col-md-3">
              <button className="purple-btn1 w-100" fdprocessedid="af5l5g">
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* cash modal end */}

      {/* bank modal start */}
      <Modal
        centered
        size="l"
        show={makeBankModal}
        onHide={closeBankModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Bank Payment Details</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Certifying Company</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Outstanding Amount</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  Voucher Date <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  Instrument Date<span>*</span>
                </label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  Bank Account <span>*</span>
                </label>
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
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  Instrument No. <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Closing Balance Amount</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  Favouring / Payee<span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  Amount<span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="INR"
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Narration</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder=""
                  defaultValue={""}
                />
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-3">
              <button className="purple-btn2 w-100" fdprocessedid="u33pye">
                Submit
              </button>
            </div>
            <div className="col-md-3">
              <button className="purple-btn2 w-100" fdprocessedid="af5l5g">
                Reset
              </button>
            </div>
            <div className="col-md-3">
              <button className="purple-btn1 w-100" fdprocessedid="af5l5g">
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* bank modal end */}

      {/* Adjust modal start */}
      <Modal
        centered
        size="lg"
        show={makeAdjustModal}
        onHide={closeAdjustModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Payment Adjustment</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Company</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder={123}
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Project</label>
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
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Voucher Type</label>
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
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  Voucher Date <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  placeholder={123}
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="tbl-container me-2 mt-3 mx-3">
              <table id="table3" className="w-100">
                <thead>
                  <tr>
                    <th />
                    <th>Dr/Cr</th>
                    <th>Ledger Account</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => (
                    <tr key={row.id}>
                      <td />
                      <td>
                        <div className="form-group">
                          <select
                            className="form-control form-select"
                            style={{ width: "100%" }}
                            value={row.type}
                            onChange={(e) =>
                              handleChange(row.id, "type", e.target.value)
                            }
                          >
                            <option value="Tax Type 1">Tax Type 1</option>
                            <option value="Tax Type 2">Tax Type 2</option>
                          </select>
                        </div>
                      </td>
                      <td />
                      <td>
                        <input
                          type="number"
                          value={row.charges}
                          onChange={(e) =>
                            handleChange(row.id, "charges", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-end">
              <p className="me-5">Total</p>
              <p className="me-3">
                Dr. <span>:0.00</span>
              </p>
              <p className="me-3">
                Cr. <span>:0.00</span>
              </p>
            </div>

            {/* Buttons placed side by side */}

            <div className="row mx-3">
              <p>
                <button
                  className="fw-bold text-decoration-underline border-0"
                  // onclick="myCreateFunction('table3')"
                  style={{ color: "var(--red)" }}
                  onClick={handleAddRow}
                >
                  Add Row
                </button>{" "}
                |
                <button
                  className="fw-bold text-decoration-underline border-0"
                  onClick={() =>
                    handleDeleteRow(tableRows[tableRows.length - 1]?.id)
                  }
                  style={{ color: "var(--red)" }}
                >
                  Delete Row
                </button>
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label>Narration</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder=""
                  defaultValue={""}
                />
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-3">
              <button className="purple-btn2 w-100" fdprocessedid="af5l5g">
                Create
              </button>
            </div>
            <div className="col-md-3">
              <button className="purple-btn1 w-100" fdprocessedid="af5l5g">
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* Adjust modal end */}

      {/* Select PO Modal */}
      <Modal
        centered
        size="xl"
        show={selectPOModal}
        onHide={closeSelectPOModal}
        backdrop="static"
        keyboard={false}
        className="modal-centered-custom"
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
                      (type) => type.value === filterParams.poType
                    ) || poTypes[0]
                  }
                  onChange={(selected) =>
                    setFilterParams((prev) => ({
                      ...prev,
                      poType: selected.value,
                    }))
                  }
                  placeholder="Select PO Type"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>PO Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={filterParams.poNumber}
                  onChange={(e) =>
                    setFilterParams((prev) => ({
                      ...prev,
                      poNumber: e.target.value,
                    }))
                  }
                  placeholder="Enter PO Number"
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
                          <td className="text-start">
                            <input
                              type="checkbox"
                              checked={selectedPOs.includes(po.id)}
                              onChange={() => handleCheckboxChange(po.id)}
                            />
                          </td>
                          <td className="text-start">{po.po_number}</td>
                          <td className="text-start">{po.po_date}</td>
                          <td className="text-start">{po.total_value}</td>
                          <td className="text-start">{po.po_type}</td>
                          <td className="text-start">
                            <button
                              className="btn btn-sm btn-primary"
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

export default PoAdvanceNotePayment;
