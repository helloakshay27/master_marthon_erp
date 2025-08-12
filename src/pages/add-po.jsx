import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import SingleSelector from "../components/base/Select/SingleSelector";

const AddPo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

  // State variables for Select PO functionality
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
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

  // State for API response data from ropo-mapping-create page
  const [apiResponseData, setApiResponseData] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const poTypes = [
    { value: "material", label: "Material" },
    { value: "asset", label: "Asset" },
    { value: "service", label: "Service" },
  ];

  // useEffect to handle received data from ropo-mapping-create page
  useEffect(() => {
    if (location.state && location.state.apiResponseData) {
      setApiResponseData(location.state.apiResponseData);
      console.log(
        "Received API response data:",
        location.state.apiResponseData
      );
    }
  }, [location.state]);

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

  // Handle project change
  const handleProjectChange = (value) => {
    setSelectedProject(value);
    setSelectedSite(null);
    if (value?.sites) {
      setSites(
        value.sites.map((site) => ({
          value: site.id,
          label: site.name,
        }))
      );
    } else {
      setSites([]);
    }
  };

  // Handle site change
  const handleSiteChange = (value) => {
    setSelectedSite(value);
  };

  // Handle material checkbox change
  const handleMaterialCheckboxChange = (materialId, checked) => {
    if (checked) {
      setSelectedMaterials((prev) => [...prev, materialId]);
    } else {
      setSelectedMaterials((prev) => prev.filter((id) => id !== materialId));
    }
  };

  // Handle select all materials
  const handleSelectAllMaterials = (checked) => {
    if (checked) {
      const allMaterialIds = apiResponseData.map(
        (item) => item.mor_inventory_id
      );
      setSelectedMaterials(allMaterialIds);
    } else {
      setSelectedMaterials([]);
    }
  };

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

  return (
    <div>
      <main className="h-100 w-100">
        <div className="main-content">
          <div className="website-content container-fluid">
            <div className="module-data-section">
              <a href="">Home &gt; Store &gt; Store Operations &gt; Add PO</a>
              <h5 className="mt-3">Select Purchase Order</h5>

              <div className="card">
                <div className="card-body">
                  <div className="p-3">
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
                              ) || null
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
                      <div className="col-md-3">
                        <button
                          className="purple-btn2 w-100 mt-2"
                          onClick={handleSearch}
                        >
                          Search
                        </button>
                      </div>
                      <div className="col-md-3">
                        <button
                          className="purple-btn1 w-100"
                          onClick={handleReset}
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* API Response Data Table */}
                    {apiResponseData.length > 0 && (
                      <div className="row mt-4">
                        <div className="col-md-12">
                          <h6 className="mb-3">Material Order Request Data</h6>
                          <div className="tbl-container mx-3">
                            <table className="w-100 table ">
                              <thead>
                                <tr className="">
                                  <th className="text-start">
                                    <input
                                      type="checkbox"
                                      checked={
                                        selectedMaterials.length ===
                                        apiResponseData.length
                                      }
                                      onChange={(e) =>
                                        handleSelectAllMaterials(
                                          e.target.checked
                                        )
                                      }
                                    />
                                  </th>
                                  <th className="text-start">Material</th>
                                  <th className="text-start">PO Number</th>
                                  <th className="text-start">PO Date</th>
                                  <th clasclassName="text-start">Supplier </th>
                                </tr>
                              </thead>
                              <tbody>
                                {apiResponseData.map((item, index) => (
                                  <tr key={item.mor_inventory_id}>
                                    <td className="text-start">
                                      <input
                                        type="checkbox"
                                        checked={selectedMaterials.includes(
                                          item.mor_inventory_id
                                        )}
                                        onChange={(e) =>
                                          handleMaterialCheckboxChange(
                                            item.mor_inventory_id,
                                            e.target.checked
                                          )
                                        }
                                      />
                                    </td>
                                    <td className="text-start">
                                      {item.material_name}
                                    </td>
                                    <td className="text-start">
                                      {item.po_number || "-"}
                                    </td>
                                    <td className="text-start">
                                      {item.po_date
                                        ? new Date(item.po_date)
                                            .toLocaleDateString("en-GB")
                                            .split("/")
                                            .join("-")
                                        : "-"}
                                    </td>
                                    <td className="text-start">
                                      {item.supplier_organization_name || "-"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {/* {selectedMaterials.length > 0 && (
                            <div className="mt-2 text-muted">
                              <small>{selectedMaterials.length} material(s) selected</small>
                            </div>
                          )} */}
                        </div>
                      </div>
                    )}
                    <div className="d-flex justify-content-center mt-3">
                      <button 
                        className="purple-btn1" 
                        onClick={() => {
                          if (selectedMaterials.length === 0) {
                            alert('Please select at least one material before submitting');
                            return;
                          }
                          
                          const selectedData = apiResponseData.filter(item => 
                            selectedMaterials.includes(item.mor_inventory_id)
                          );
                          
                          navigate(`/ropo-mapping-create?token=${token}`, {
                            state: {
                              selectedMaterials: selectedData,
                              fromAddPo: true,
                              existingMorData: location.state?.existingMorData || [] // Pass back existing MOR data
                            }
                          });
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddPo;
