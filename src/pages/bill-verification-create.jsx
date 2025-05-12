import React from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect } from "react";
import SingleSelector from "../components/base/Select/SingleSelector";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import {
  Table
} from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
const BillVerificationCreate = () => {
  const [remarkModal, setremarkModal] = useState(false);
  const [attachModal, setattachModal] = useState(false);

  const openremarkModal = () => setremarkModal(true);
  const closeremarkModal = () => setremarkModal(false);

  const openattachModal = () => setattachModal(true);
  const closeattachModal = () => setattachModal(false);

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);

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
      label: "Verified",
      value: "verified",
    },
    {
      label: "Submited",
      value: "submited",
    },
    {
      label: "Proceed",
      value: "proceed",
    },
    {
      label: "Approved",
      value: "approved",
    },
  ];

  //po 
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
    // const [projects, setProjects] = useState([]);
    // const [selectedProject, setSelectedProject] = useState(null);
    // const [sites, setSites] = useState([]);
    // const [selectedSite, setSelectedSite] = useState(null);
    // const [selectedCompany, setSelectedCompany] = useState(null);
    // const [companies, setCompanies] = useState([]);
    const [selectedPOs, setSelectedPOs] = useState([]);
    const [poTypes, setPoTypes] = useState([
      { value: "", label: "All" },
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

    const getShowingEntriesText = () => {
      if (!pagination.total_count) return "No entries found";
  
      const start = (pagination.current_page - 1) * pagination.per_page + 1;
      const end = Math.min(
        start + pagination.per_page - 1,
        pagination.total_count
      );
  
      return `Showing ${start} to ${end} of ${pagination.total_count} entries`;
    };
  
  
  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section mx-2">
          <a href="">
            Home &gt; Billing &gt; Bill Verification List &gt; Update Bill
            Information
          </a>
          <h5 className="mt-3">Create Bill Information</h5>
          <div className="mor-tabs mt-4">
            <ul
              className="nav nav-pills mb-3 justify-content-center"
              id="pills-tab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  data-bs-toggle="pill"
                  data-bs-target="#create-mor"
                  type="button"
                  role="tab"
                  aria-controls="create-mor"
                  aria-selected="false"
                  fdprocessedid="7mdk1cl"
                >
                  Material
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  data-bs-toggle="pill"
                  data-bs-target="#mor-approval-create"
                  type="button"
                  role="tab"
                  aria-controls="mor-approval-create"
                  aria-selected="true"
                  fdprocessedid="05u9l8"
                >
                  Service
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                  fdprocessedid="zf7dlh"
                >
                  Misc.
                </button>
              </li>
              <li className="nav-item" role="presentation" />
            </ul>
          </div>
          <div className="row align-items-center container-fluid mb-5 mt-5 ">
            <div className="col-md-12 ">
              <div className="card p-3 mx-2">
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
                  <div className="col-md-4 ">
                    <div className="form-group">
                      <label>
                        Sub-Project <span>*</span>
                      </label>

                      <SingleSelector
                        options={sites}
                        onChange={handleSiteChange}
                        value={selectedSite}
                        placeholder={`Select Sub-Project`} // Dynamic placeholder
                        isDisabled={!selectedCompany}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
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
<div className="col-md-3 mt-2">
  <div className="form-group">
    <label>PO Number</label>
    <input
      className="form-control"
      type="number"
      placeholder=""
      fdprocessedid="qv9ju9"
      value={selectedPO?.po_number || ""}
      disabled
    />
  </div>
</div>
<div className="col-md-1 mt-2">
  <p className="mt-2 text-decoration-underline"
   onClick={openSelectPOModal}
  >Select</p>
</div>
<div className="col-md-4 mt-2">
  <div className="form-group">
    <label>Bill Number</label>
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
                      <label>Acceptance Date</label>
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
                      <label>Bill Date</label>
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
                      <label>Created On</label>
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
                      <label>Mode of Submission</label>
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
                      <label>Bill Amount</label>
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
                      <label>Bill Due date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-12 mt-2">
                    <div className="form-group">
                      <label>Vendor Remark</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-5 ">
                  <h5 className=" ">Supporting Documents</h5>
                  <div className="card-tools d-flex">
                    <button
                      className="purple-btn2 me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#AttachModal"
                      onClick={openremarkModal}
                    >
                      Revision Req.
                    </button>
                    <div>
                      <button
                        className="purple-btn2 me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#RevisionModal"
                        onClick={openattachModal}
                      >
                        Attach Other
                      </button>
                    </div>
                  </div>
                </div>
                <div className="tbl-container  mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>
                          <input type="checkbox" />
                        </th>
                        <th className="text-start">Sr. No.</th>
                        <th className="text-start">Document Name</th>
                        <th className="text-start">No. of Documents</th>
                        <th className="text-start">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="text-start">1</td>
                        <td className="text-start">Tax Invoice</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="text-start">2</td>
                        <td className="text-start">
                          Site acknowledged challan / Challan cum Invoice
                        </td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="text-start">3</td>
                        <td className="text-start">Weighment slips</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="text-start">4</td>
                        <td className="text-start"> Lorry receipt</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="text-start">5</td>
                        <td className="text-start">E Way bill</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td> </td>
                        <td className="text-start">6</td>
                        <td className="text-start">E Invoice</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td> </td>
                        <td className="text-start">7</td>
                        <td className="text-start">Warranty</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td />
                        <td className="text-start">8</td>
                        <td className="text-start">MTC</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mx-1">
                <div className="row ">
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
                <div className="row mt-2">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Comments</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="d-flex justify-content-end align-items-center gap-3">
                <p className="">Assigned To User</p>
                <div className="dropdown">
                  <button
                    className="btn purple-btn2 btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    fdprocessedid="d2d1ue"
                  >
                    Shamshik
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        Action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Another action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Something else here
                      </a>
                    </li>
                  </ul>
                </div>
              </div> */}
              <div className="row mt-4 justify-content-end align-items-center mx-2">
                <div className="col-md-3">
                  <div className="form-group d-flex gap-3 align-items-center mx-3">
                    <label
                      style={{ fontSize: "0.95rem", color: "black", whiteSpace: "nowrap", }}
                    >
                      Assigned To User
                    </label>
                    <SingleSelector
                      options={statusOptions}
                      // onChange={handleStatusChange}
                      // value={statusOptions.find((option) => option.value === "draft")} // Set "Draft" as the selected status
                      placeholder="Select User"
                      // isClearable={false}
                      // isDisabled={true} // Disable the selector
                      classNamePrefix="react-select"
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
                      // onChange={handleStatusChange}
                      // value={statusOptions.find((option) => option.value === "draft")} // Set "Draft" as the selected status
                      placeholder="Select Status"
                      // isClearable={false}
                      // isDisabled={true} // Disable the selector
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-2 justify-content-end">
                <div className="col-md-2">
                  <button className="purple-btn2 w-100">Submit</button>
                </div>
                <div className="col-md-2">
                  <button className="purple-btn1 w-100">Cancel</button>
                </div>
              </div>
              <div className="mb-5">
                <h5 className=" mt-3">Audit Log</h5>
                <div className="">
                  <div className="mx-0">
                    <Table columns={auditLogColumns} data={auditLogData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* po modal */}
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
                                <td className="text-start">{index + 1}</td>
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

      {/* attach modal */}
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
                  className="form-control"
                  type=""
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-12 mt-2">
              <div className="form-group">
                <form action="/upload" method="post" encType="multipart/form-data">
                  {/* <label for="fileInput">Choose File:</label> */}
                  <input type="file" id="fileInput" name="attachment" />
                </form>
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-4">
              <button className="purple-btn2 w-100" fdprocessedid="u33pye">
                Attach
              </button>
            </div>
            <div className="col-md-4">
              <button className="purple-btn1 w-100" fdprocessedid="af5l5g">
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* attach modal */}

      {/* remark modal */}
      <Modal
        centered
        size="l"
        show={remarkModal}
        onHide={closeremarkModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Remark</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="col-md-12">
            <div className="form-group">
              <textarea
                className="form-control"
                rows={3}
                placeholder="Enter ..."
                defaultValue={""}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* remark modal */}
    </>
  );
};

export default BillVerificationCreate;
