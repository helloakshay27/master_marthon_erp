import React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../confi/apiDomain"; // adjust path if needed
import SingleSelector from "../components/base/Select/SingleSelector";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const RopoMappingCreate = () => {

  


  const [selectPOModal, setselectPOModal] = useState(false);
    const closeSelectPOModal = () => {
    setselectPOModal(false);
  };

    const navigate = useNavigate();
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
  
    // State variables for Select PO functionality
    const [companies, setCompanies] = useState([]);
    const [projects, setProjects] = useState([]);
    const [sites, setSites] = useState([]);
        const [selectedWing, setSelectedWing] = useState(null);
     
        const [wingsOptions, setWingsOptions] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedSite, setSelectedSite] = useState(null);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [selectedPO, setSelectedPO] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(5);
    const [pagination, setPagination] = useState({
      current_page: 1,
      next_page: null,
      prev_page: null,
      total_pages: 1,
      total_count: 0,
      per_page: 5,
    });
  
    const [filterParams, setFilterParams] = useState({
      startDate: "",
      endDate: "",
      poType: "",
      poNumber: "",
      selectedPOIds: [],
      supplierId: "",
    });
  
    const poTypes = [
      { value: "material", label: "Material" },
      { value: "asset", label: "Asset" },
      { value: "service", label: "Service" },
    ];
  
    // Fetch purchase orders with filters
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
        let url = `${baseURL}purchase_orders/grn_details.json?token=${token}`;
  
        // Add filters only if they are provided
        if (companyId) url += `&q[company_id_eq]=${companyId}`;
        if (projectId) url += `&q[po_mor_inventories_project_id_eq]=${projectId}`;
        if (siteId) url += `&q[po_mor_inventories_pms_site_id_eq]=${siteId}`;
        if (filters?.supplierId)
          url += `&q[supplier_id_eq]=${filters.supplierId}`;
        if (filters?.startDate) url += `&q[po_date_gteq]=${filters.startDate}`;
        if (filters?.endDate) url += `&q[po_date_lteq]=${filters.endDate}`;
  
        if (filters?.poNumber && filters.poNumber !== "") {
          url += `&q[po_number_cont]=${filters.poNumber}`;
        }
        if (filters?.poType && filters.poType !== "") {
          url += `&q[po_type_cont]=${filters.poType}`;
        }
  
        // Always add pagination parameters
        url += `&page=${filters.page || 1}`;
        url += `&per_page=${filters.pageSize || 5}`;
  
        const response = await axios.get(url);
        setPurchaseOrders(response.data.purchase_orders || []);
  
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
        console.error("Error fetching purchase orders:", err);
      } finally {
        setLoading(false);
      }
    };
  
    // Handle search
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
  
    // Handle reset
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
  
    // Handle PO selection
    const handlePOSelect = (po) => {
      setSelectedPO(po);
      // Navigate back or handle the selected PO
      console.log("Selected PO:", po);
      // You can navigate to another page or update parent component state
    };
  
    // Handle pagination
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
  
    // Get page numbers for pagination
    const getPageNumbers = () => {
      const pages = [];
      const totalPages = pagination.total_pages;
      const currentPage = pagination.current_page;
  
      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i);
          }
        } else if (currentPage >= totalPages - 2) {
          for (let i = totalPages - 4; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          for (let i = currentPage - 2; i <= currentPage + 2; i++) {
            pages.push(i);
          }
        }
      }
  
      return pages;
    };
  
    // Handle company change
   
  
    // Handle project change
   
  
    // Handle site change
  
  
    // Fetch companies
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          `${baseURL}pms/company_setups.json?token=${token}`
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
  
    // Get showing entries text
    const getShowingEntriesText = () => {
      if (!pagination.total_count) return "No entries found";
  
      const start = (pagination.current_page - 1) * pagination.per_page + 1;
      const end = Math.min(
        start + pagination.per_page - 1,
        pagination.total_count
      );
  
      return `Showing ${start} to ${end} of ${pagination.total_count} entries`;
    };
  
    // Initial data fetch
    useEffect(() => {
      fetchCompanies();
      fetchPurchaseOrders();
    }, []);
  
    // Fetch projects when company changes
    useEffect(() => {
      if (selectedCompany?.value) {
        fetchPurchaseOrders(selectedCompany.value);
      }
    }, [selectedCompany]);
  
    // Fetch sites when project changes
    useEffect(() => {
      if (selectedProject?.value) {
        fetchPurchaseOrders(selectedCompany?.value, selectedProject.value);
      }
    }, [selectedProject]);
  
    // Fetch purchase orders when site changes
    useEffect(() => {
      if (selectedSite?.value) {
        fetchPurchaseOrders(
          selectedCompany?.value,
          selectedProject?.value,
          selectedSite.value
        );
      }
    }, [selectedSite]);
  // Quick Filter states


  useEffect(() => {
    axios
      .get(
        `${baseURL}pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((response) => {
        const companies = response.data.companies || [];

        // Flatten all projects from all companies
        const allProjects = companies.flatMap((company) =>
          company.projects.map((project) => ({
            ...project,
            company_name: company.company_name, // keep for reference if needed
          }))
        );

        setProjects(allProjects);
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedSite(null);

    if (selectedOption) {
      const projectData = projects.find((p) => p.id === selectedOption.value);
      setSiteOptions(projectData?.pms_sites || []);
    } else {
      setSiteOptions([]);
    }
  };

  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
  };

  const [collapsedRows, setCollapsedRows] = useState({});

  const handleCollapseToggle = (rowKey) => {
    setCollapsedRows((prev) => ({
      ...prev,
      [rowKey]: !prev[rowKey],
    }));
  };

  return (
    <div>
      <>
        <main className="h-100 w-100">
          {/* top navigation above */}
          <div className="main-content">
            <div className="website-content container-fluid ">
              <div className="module-data-section ">
                <a href="">
                  Home &gt; Store &gt; Store Operations &gt; ROPO Mapping{" "}
                </a>
                <h5 className="mt-3">ROPO Mapping</h5>
                <div className="row my-4 align-items-center">
                  <div className="col-md-12 px-2">
                    <div
                      className="tab-content mor-content"
                      id="pills-tabContent"
                    >
                      <div
                        className="tab-pane fade show active"
                        id="create-mor"
                        role="tabpanel"
                        aria-labelledby="create-mor"
                      >
                        <section className="mor p-2 ">
                          <div className="container-fluid card">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label>Project</label>
                                    <SingleSelector
                                      options={projects.map((p) => ({
                                        value: p.id,
                                        label: p.name,
                                      }))}
                                      onChange={handleProjectChange}
                                      value={selectedProject}
                                      placeholder="Select Project"
                                      //  isDisabled={!selectedCompany}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label>Sub-project</label>
                                    <SingleSelector
                                      options={sites.map((s) => ({
                                        value: s.id,
                                        label: s.name,
                                      }))}
                                      onChange={handleSiteChange}
                                      value={selectedSite}
                                      placeholder="Select Sub-project"
                                      //  isDisabled={!selectedProject}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label>ROPO No.</label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="ROPO5229"
                                    />
                                  </div>
                                </div>
                                <div className="row mt-2">
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label>Date</label>
                                      <input
                                        className="form-control"
                                        type="date"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label>Created On</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="05-02-2024"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between mt-2 align-items-end">
                                <h5 className=" ">MOR &amp; PO Mapping</h5>
                                <div className="card-tools">
                                  <button className="purple-btn2">
                                    Delete
                                  </button>
                                </div>
                              </div>
                              <div className="tbl-container me-2 mt-3">
                                <table className="w-100">
                                  <thead>
                                    <tr>
                                      <th>
                                        <input type="checkbox" />
                                      </th>
                                      <th style={{ width: "30%" }}>
                                        MOR/Material/PO
                                      </th>
                                      <th>Pending Qty</th>
                                      <th>Ordered Qty</th>
                                      <th>PO UOM</th>
                                      <th>Converted Ordered Qty</th>
                                      <th>Rate / PO UOM</th>
                                      <th>Material Cost</th>
                                      <th>Total Received Qty</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {/* MOR row */}
                                    <tr>
                                      <td>
                                        <input type="checkbox" />
                                      </td>
                                      <td>
                                        <i
                                          className={`fa-solid collapse-icon me-2 ${
                                            collapsedRows["row1"]
                                              ? "fa-arrow-turn-down"
                                              : "fa-arrow-turn-up"
                                          }`}
                                          onClick={() =>
                                            handleCollapseToggle("row1")
                                          }
                                          style={{ cursor: "pointer" }}
                                        />{" "}
                                        MOR
                                      </td>
                                      <td>24.16000MT</td>
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                    </tr>
                                    {/* Material row */}
                                    {collapsedRows["row1"] && (
                                      <tr className="material-type">
                                        <td>
                                          <input type="checkbox" />
                                        </td>
                                        <td className="ps-4">Material</td>
                                        <td />
                                        <td>24.160 MT</td>
                                        <td>MT</td>
                                        <td>24.160</td>
                                        <td>2100.0000</td>
                                        <td>50736.000</td>
                                        <td>50.787</td>
                                      </tr>
                                    )}
                                    {/* PO row */}
                                    {collapsedRows["row1"] && (
                                      <tr>
                                        <td>
                                          <input type="checkbox" />
                                        </td>
                                        <td className="ps-5">PO</td>
                                        <td />
                                        <td>24.160 MT</td>
                                        <td>MT</td>
                                        <td>24.160</td>
                                        <td>2100.0000</td>
                                        <td>50736.000</td>
                                        <td>50.787</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                              <div>
                                <button
                                  className="purple-btn2"
                                  onClick={() => navigate(`/add-mor?token=${token}`)}
                                >
                                  Add MOR
                                </button>
                                <button
                                  className="purple-btn2 ms-2"
                                  onClick={() => navigate(`/add-po?token=${token}`)}
                                >
                                  Add PO
                                </button>
                              </div>
                              {/* /.container-fluid */}
                            </div>
                          </div>
                        </section>
                        <section className="ms-4 me-4 mb-3">
                          <div className="d-flex justify-content-end align-items-center gap-3">
                            <p className="pe-2 pt-1">Status</p>
                            <div className="dropdown">
                              <button
                                className="purple-btn2 dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                Draft
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
                          </div>
                          <div className="row mt-2 justify-content-end">
                            <div className="col-md-2">
                              <button className="purple-btn2 w-100">
                                Print
                              </button>
                            </div>
                            <div className="col-md-2">
                              <button className="purple-btn2 w-100">
                                Submit
                              </button>
                            </div>
                            <div className="col-md-2">
                              <button className="purple-btn1 w-100">
                                Cancel
                              </button>
                            </div>
                          </div>
                          <div className=" ">
                            <h5 className=" ">Audit Log</h5>
                          </div>
                          <div className="tbl-container me-2 mt-3">
                            <table className="w-100">
                              <thead>
                                <tr>
                                  <th>Sr.No.</th>
                                  <th>User</th>
                                  <th>Date</th>
                                  <th>Status</th>
                                  <th>Remark</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <th>1</th>
                                  <td>Pratham Shastri</td>
                                  <td>15-02-2024</td>
                                  <td>Verified</td>
                                  <td>Verified &amp; Processed</td>
                                </tr>
                                <tr>
                                  <th>2</th>
                                  <td>Pratham Shastri</td>
                                  <td>30-01-2024</td>
                                  <td>Approved</td>
                                  <td>Ok Approved</td>
                                </tr>
                                <tr>
                                  <th>3</th>
                                  <td>Dinesh Gupta</td>
                                  <td>15-01-2024</td>
                                  <td>Submit</td>
                                  <td>Send for approval</td>
                                </tr>
                                <tr>
                                  <th>4</th>
                                  <td>Dinesh Gupta</td>
                                  <td>01-01-2024</td>
                                  <td>Draft</td>
                                  <td>
                                    MOR created as material required at site.
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </section>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="mor-approval-create"
                        role="tabpanel"
                        aria-labelledby="mor-approval-create"
                      ></div>
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
              </div>
            </div>
          </div>
        </main>
        {/* Navigation Top */}
        {/* sidebar start below */}
        {/* webpage container end */}
        {/* Modal */}
        {/* rate & taxes select modal start */}

        {/* rate & taxes select modal end */}
        {/* Modal end */}
       
      </>
    </div>
  );
};

export default RopoMappingCreate;
