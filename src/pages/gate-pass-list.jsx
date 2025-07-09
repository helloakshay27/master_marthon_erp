import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import { Stack, Typography, Pagination } from "@mui/material";
import SingleSelector from "../components/base/Select/SingleSelector";
import {
  DownloadIcon,
  FilterIcon,
  StarIcon,
  SettingIcon,
  MultiSelector,
} from "../components";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const GatePassList = () => {
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const [selectedValue, setSelectedValue] = useState("");
  const [billEntries, setBillEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [totalEntries, setTotalEntries] = useState(0);
  const [showOnlyPinned, setShowOnlyPinned] = useState(false);
  const [pinnedRows, setPinnedRows] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [settingShow, setSettingShow] = useState(false);
  const [show, setShow] = useState(false);

  // Company, Project, Site states
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [siteOptions, setSiteOptions] = useState([]);
  const navigate = useNavigate();

  const [statusCounts, setStatusCounts] = useState({
    total: 0,
    returnable: 0,
    non_returnable: 0,
    draft: 0,
    approved: 0,
    rejected: 0,
  });
  const [returnableFilter, setReturnableFilter] = useState(null);

  // Filter modal state
  const [filterShow, setFilterShow] = useState(false);
  const [selectedFilterCompanies, setSelectedFilterCompanies] = useState([]);
  const [selectedFilterProjects, setSelectedFilterProjects] = useState([]);
  const [selectedFilterSubProjects, setSelectedFilterSubProjects] = useState(
    []
  );
  const [filterProjectOptions, setFilterProjectOptions] = useState([]);
  const [filterSubProjectOptions, setFilterSubProjectOptions] = useState([]);

  // Material filter states (similar to reconciliation)
  const [inventoryTypes, setInventoryTypes] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [inventorySubTypes, setInventorySubTypes] = useState([]);
  const [selectedSubType, setSelectedSubType] = useState(null);
  const [inventoryMaterialTypes, setInventoryMaterialTypes] = useState([]);
  const [selectedInventoryMaterialTypes, setSelectedInventoryMaterialTypes] =
    useState(null);
  const [genericSpecifications, setGenericSpecifications] = useState([]);
  const [selectedGenericSpec, setSelectedGenericSpec] = useState(null);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [uoms, setUoms] = useState([]);
  const [selectedUom, setSelectedUom] = useState(null);

  // Gate pass specific filters
  const [gatePassOptions, setGatePassOptions] = useState([]);
  const [selectedGatePass, setSelectedGatePass] = useState(null);
  const [gatePassNumberOptions, setGatePassNumberOptions] = useState([]);
  const [selectedGatePassNumbers, setSelectedGatePassNumbers] = useState([]);
  const [poNumberOptions, setPoNumberOptions] = useState([]);
  const [selectedPoNumbers, setSelectedPoNumbers] = useState([]);

  const allColumns = [
    {
      field: "srNo",
      headerName: "Sr. No.",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "company_name",
      headerName: "Company",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "project_name",
      headerName: "Project",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "sub_project_name",
      headerName: "Subproject",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "gate_pass_no",
      headerName: "Gate Pass No",
      flex: 1,
      minWidth: 140,
      renderCell: (params) =>
        params.value && params.row.id ? (
          <Link to={`/gate-pass-details/${params.row.id}?token=${token}`}>
            <span className="boq-id-link">{params.value}</span>
          </Link>
        ) : (
          "-"
        ),
    },
    {
      field: "gate_pass_type_name",
      headerName: "Gate Pass Type",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "matarial_type_name",
      headerName: "Material Type",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "material_sub_type_name",
      headerName: " Material Sub Type",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "materials_description",
      headerName: "Material Description",
      flex: 1,
      minWidth: 350,
      renderCell: (params) => (
        <span
          style={{
            maxWidth: 400,
            display: "inline-block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            verticalAlign: "middle",
            cursor: "pointer",
          }}
          title={params.value}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "po_or_mto_no",
      headerName: "PO / MTO No.",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "gate_pass_date",
      headerName: "Gate Pass Date",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "created_by_name",
      headerName: "Issued By",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "approved_by_name",
      headerName: "Approved By",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "expected_return_date",
      headerName: "Due Date",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "overdue",
      headerName: "Overdue",
      flex: 1,
      minWidth: 100,
    },
    // {
    //   field: "due_at",
    //   headerName: "Due At",
    //   flex: 1,
    //   minWidth: 100,
    // },
  ];

  const [columnVisibility, setColumnVisibility] = useState(
    allColumns.reduce((acc, col) => ({ ...acc, [col.field]: true }), {})
  );

  const handleSettingClose = () => setSettingShow(false);
  const handleClose = () => setShow(false);
  const handleSettingModalShow = () => setSettingShow(true);
  const handleModalShow = () => setShow(true);

  // Filter modal handlers
  const handleFilterModalShow = () => setFilterShow(true);
  const handleFilterClose = () => setFilterShow(false);

  // Material filter handlers
  const handleInventoryChange = (selectedOption) => {
    setSelectedInventory(selectedOption);
    setSelectedSubType(null);
    setInventorySubTypes([]);
    setInventoryMaterialTypes([]);
    setSelectedInventoryMaterialTypes(null);
  };

  const handleSubTypeChange = (selectedOption) => {
    setSelectedSubType(selectedOption);
  };

  const handleInventoryMaterialTypeChange = (selectedOption) => {
    setSelectedInventoryMaterialTypes(selectedOption);
    setSelectedGenericSpec(null);
    setSelectedColor(null);
    setSelectedBrand(null);
  };

  const handleGenericSpecChange = (selectedOption) => {
    setSelectedGenericSpec(selectedOption);
  };

  const handleColorChange = (selectedOption) => {
    setSelectedColor(selectedOption);
  };

  const handleBrandChange = (selectedOption) => {
    setSelectedBrand(selectedOption);
  };

  const handleUomChange = (selectedOption) => {
    setSelectedUom(selectedOption);
  };

  // Gate pass filter handlers
  const handleGatePassChange = (selectedOption) => {
    setSelectedGatePass(selectedOption);
  };

  const handleGatePassNumberChange = (selectedOption) => {
    setSelectedGatePassNumbers(selectedOption);
  };

  const handlePoNumberChange = (selectedOption) => {
    // selectedOption will be an array of objects with value and label
    // where both value and label are the PO number strings
    setSelectedPoNumbers(selectedOption);
  };

  // Filter apply and reset handlers
  const handleFilterGo = async () => {
    setLoading(true);
    try {
      let url = `${baseURL}gate_passes.json?token=${token}&page=1&per_page=${pageSize}`;

      // Add company filter
      if (selectedFilterCompanies.length > 0) {
        const companyIds = selectedFilterCompanies
          .map((c) => c.value)
          .join(",");
        url += `&q[company_id_in]=${companyIds}`;
      }

      // Add project filter
      if (selectedFilterProjects.length > 0) {
        const projectIds = selectedFilterProjects.map((p) => p.value).join(",");
        url += `&q[project_id_in]=${projectIds}`;
      }

      // Add sub-project filter
      if (selectedFilterSubProjects.length > 0) {
        const subProjectIds = selectedFilterSubProjects
          .map((s) => s.value)
          .join(",");
        url += `&q[sub_project_id_in]=${subProjectIds}`;
      }

      // Add material filters
      if (selectedInventory && selectedInventory.length > 0) {
        const inventoryTypeIds = selectedInventory
          .map((inv) => inv.value)
          .join(",");
        url += `&q[gate_pass_materials_pms_inventory_type_id_in]=${inventoryTypeIds}`;
      }

      if (selectedSubType && selectedSubType.length > 0) {
        const subTypeIds = selectedSubType.map((sub) => sub.value).join(",");
        url += `&q[gate_pass_materials_pms_inventory_sub_type_id_in]=${subTypeIds}`;
      }

      if (
        selectedInventoryMaterialTypes &&
        selectedInventoryMaterialTypes.length > 0
      ) {
        const materialIds = selectedInventoryMaterialTypes
          .map((m) => m.value)
          .join(",");
        url += `&q[gate_pass_materials_pms_inventory_id_in]=${materialIds}`;
      }

      if (selectedGenericSpec) {
        url += `&q[gate_pass_materials_pms_generic_info_id_in]=${selectedGenericSpec.value}`;
      }

      if (selectedColor) {
        url += `&q[gate_pass_materials_pms_colour_id_in]=${selectedColor.value}`;
      }

      if (selectedBrand) {
        url += `&q[gate_pass_materials_pms_brand_id_in]=${selectedBrand.value}`;
      }

      if (selectedUom) {
        url += `&q[gate_pass_materials_uom_id_in]=${selectedUom.value}`;
      }

      // Add gate pass specific filters
      if (selectedGatePass) {
        url += `&q[gate_pass_type_id_eq]=${selectedGatePass.value}`;
      }

      if (selectedGatePassNumbers.length > 0) {
        const gatePassIds = selectedGatePassNumbers
          .map((g) => g.value)
          .join(",");
        url += `&q[id_in]=${gatePassIds}`;
      }

      if (selectedPoNumbers.length > 0) {
        const poNumbers = selectedPoNumbers.map((p) => p.value).join(",");
        url += `&q[by_po_numbers_in]=${poNumbers}`;
      }

      // Status
      if (selectedStatuses.length > 0) {
        const statusList = selectedStatuses.map((s) => s.value).join(",");
        url += `&q[list_status_in]=${statusList}`;
      }

      // Created By
      if (selectedCreatedBy.length > 0) {
        const createdByIds = selectedCreatedBy.map((u) => u.value).join(",");
        url += `&q[created_by_id_in]=${createdByIds}`;
      }

      // Approved By
      if (selectedApprovedBy.length > 0) {
        const approvedByIds = selectedApprovedBy.map((u) => u.value).join(",");
        url += `&q[approved_by_id_in]=${approvedByIds}`;
      }

      const response = await axios.get(url);

      // Transform the data same as the main useEffect
      const data = (response.data.gate_passes || []).map((entry, index) => ({
        id: entry.id,
        srNo: index + 1,
        ...entry,
        due_date: formatDate(entry.due_date),
        gate_pass_date: formatDate(entry.gate_pass_date),
        expected_return_date: formatDate(entry.expected_return_date),
        created_at: formatDate(entry.created_at),
        updated_at: formatDate(entry.updated_at),
        due_at: formatDate(entry.due_at),
      }));

      setBillEntries(data);
      setMeta(response.data.pagination || {});
      setTotalPages(response.data.pagination?.total_pages || 1);
      setTotalEntries(response.data.pagination?.total_count || data.length);
      setStatusCounts(response.data.status_counts || {});
      setCurrentPage(1);
      setFilterShow(false);
    } catch (error) {
      console.error("Filter API error:", error);
      alert("Failed to fetch filtered data");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterReset = () => {
    setSelectedFilterCompanies([]);
    setSelectedFilterProjects([]);
    setSelectedFilterSubProjects([]);
    setSelectedInventory(null);
    setSelectedSubType(null);
    setSelectedInventoryMaterialTypes(null);
    setSelectedGenericSpec(null);
    setSelectedColor(null);
    setSelectedBrand(null);
    setSelectedUom(null);
    setSelectedGatePass(null);
    setSelectedGatePassNumbers([]);
    setSelectedPoNumbers([]);
    setSelectedStatuses([]);
    setSelectedCreatedBy([]);
    setSelectedApprovedBy([]);
    setFilterShow(false);
    setCurrentPage(1);

    // Reset current filters and refetch unfiltered data
    setCurrentFilters({
      companyId: "",
      projectId: "",
      siteId: "",
    });
  };

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

  // Fetch companies on component mount
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

  // Fetch inventory types for filter
  useEffect(() => {
    if (!token) return;

    axios
      .get(
        `${baseURL}pms/inventory_types.json?q[category_eq]=material&token=${token}`
      )
      .then((response) => {
        const inventoryData = Array.isArray(response.data)
          ? response.data
          : response.data.inventory_types || [];
        const options = inventoryData.map((inventory) => ({
          value: inventory.id,
          label: inventory.name,
        }));
        setInventoryTypes(options);
      })
      .catch((error) => {
        console.error("Error fetching inventory types:", error);
        setInventoryTypes([]);
      });
  }, [token]);

  // Fetch UOMs for filter
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${baseURL}unit_of_measures.json?token=${token}`)
      .then((response) => {
        const options = response.data.map((uom) => ({
          value: uom.id,
          label: uom.name,
        }));
        setUoms(options);
      })
      .catch((error) => {
        console.error("Error fetching UOMs:", error);
      });
  }, [token]);

  // Fetch gate pass numbers and PO numbers for filter
  useEffect(() => {
    if (!token) return;

    // Fetch gate pass types
    axios
      .get(`${baseURL}gate_pass_types.json?token=${token}`)
      .then((response) => {
        const options = (response.data || []).map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setGatePassOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching gate pass types:", error);
        setGatePassOptions([]);
      });

    // Fetch gate pass numbers - updated endpoint
    axios
      .get(`${baseURL}gate_passes/gate_pass_nos.json?token=${token}`)
      .then((response) => {
        const options = (response.data || []).map((item) => ({
          value: item.id,
          label: item.gate_pass_no,
        }));
        setGatePassNumberOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching gate pass numbers:", error);
        setGatePassNumberOptions([]);
      });

    // Fetch PO numbers - updated endpoint
    axios
      .get(`${baseURL}gate_passes/po_numbers.json?token=${token}`)
      .then((response) => {
        // API returns array of strings, not objects
        const options = (response.data || []).map((poNumber, index) => ({
          value: poNumber,
          label: poNumber,
        }));
        setPoNumberOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching PO numbers:", error);
        setPoNumberOptions([]);
      });
  }, [token]);

  // Fetch inventory sub-types when an inventory type is selected
  useEffect(() => {
    if (selectedInventory) {
      const inventoryTypeIds = selectedInventory
        .map((item) => item.value)
        .join(",");

      axios
        .get(
          `${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${inventoryTypeIds}&token=${token}`
        )
        .then((response) => {
          const options = response.data.map((subType) => ({
            value: subType.id,
            label: subType.name,
          }));
          setInventorySubTypes(options);
        })
        .catch((error) => {
          console.error("Error fetching inventory sub-types:", error);
        });
    }
  }, [selectedInventory]);

  // Fetch inventory materials when an inventory type is selected
  useEffect(() => {
    if (selectedInventory) {
      const inventoryTypeIds = selectedInventory
        .map((item) => item.value)
        .join(",");

      axios
        .get(
          `${baseURL}pms/inventories.json?q[inventory_type_id_in]=${inventoryTypeIds}&q[material_category_eq]=material&token=${token}`
        )
        .then((response) => {
          const options = response.data.map((subType) => ({
            value: subType.id,
            label: subType.name,
          }));
          setInventoryMaterialTypes(options);
        })
        .catch((error) => {
          console.error("Error fetching inventory materials:", error);
        });
    }
  }, [selectedInventory]);

  // Fetch generic specifications, colors and brands when material is selected
  useEffect(() => {
    if (selectedInventoryMaterialTypes) {
      const materialIds = selectedInventoryMaterialTypes
        .map((item) => item.value)
        .join(",");

      // Fetch generic specifications
      axios
        .get(
          `${baseURL}pms/generic_infos.json?q[material_id_eq]=${materialIds}&token=${token}`
        )
        .then((response) => {
          const options = response.data.map((spec) => ({
            value: spec.id,
            label: spec.generic_info,
          }));
          setGenericSpecifications(options);
        })
        .catch((error) => {
          console.error("Error fetching generic specifications:", error);
        });

      // Fetch colors
      axios
        .get(
          `${baseURL}pms/colours.json?q[material_id_eq]=${materialIds}&token=${token}`
        )
        .then((response) => {
          const options = response.data.map((color) => ({
            value: color.id,
            label: color.colour,
          }));
          setColors(options);
        })
        .catch((error) => {
          console.error("Error fetching colors:", error);
        });

      // Fetch brands
      axios
        .get(
          `${baseURL}pms/inventory_brands.json?q[material_id_eq]=${materialIds}&token=${token}`
        )
        .then((response) => {
          const options = response.data.map((brand) => ({
            value: brand.id,
            label: brand.brand_name,
          }));
          setBrands(options);
        })
        .catch((error) => {
          console.error("Error fetching brands:", error);
        });
    }
  }, [selectedInventoryMaterialTypes]);

  // Filter companies cascade - update project options
  useEffect(() => {
    if (selectedFilterCompanies.length > 0) {
      const selectedCompanyIds = selectedFilterCompanies.map((c) => c.value);
      const projects = companies
        .filter((company) => selectedCompanyIds.includes(company.id))
        .flatMap((company) => company.projects || [])
        .map((prj) => ({ value: prj.id, label: prj.name }));
      setFilterProjectOptions(projects);
    } else {
      setFilterProjectOptions([]);
    }
    setSelectedFilterProjects([]);
    setSelectedFilterSubProjects([]);
  }, [selectedFilterCompanies, companies]);

  // Filter projects cascade - update sub-project options
  useEffect(() => {
    if (selectedFilterProjects.length > 0) {
      const selectedProjectIds = selectedFilterProjects.map((p) => p.value);
      const subProjects = companies
        .flatMap((company) => company.projects || [])
        .filter((prj) => selectedProjectIds.includes(prj.id))
        .flatMap((prj) => prj.pms_sites || [])
        .map((site) => ({ value: site.id, label: site.name }));
      setFilterSubProjectOptions(subProjects);
    } else {
      setFilterSubProjectOptions([]);
    }
    setSelectedFilterSubProjects([]);
  }, [selectedFilterProjects, companies]);

  // Handle company selection
  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption);
    setSelectedProject(null);
    setSelectedSite(null);

    if (selectedOption) {
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedOption.value
      );
      setProjects(
        selectedCompanyData?.projects.map((prj) => ({
          value: prj.id,
          label: prj.name,
        })) || []
      );
    }
  };

  // Handle project selection
  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedSite(null);

    if (selectedOption) {
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedCompany.value
      );
      const selectedProjectData = selectedCompanyData?.projects.find(
        (project) => project.id === selectedOption.value
      );

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

  const [activeTab, setActiveTab] = useState("list");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // fetchTabData(tab, 1); // Always go to first page on tab change
    setCurrentPage(1); // R
  };
  const [allBillCount, setAllBillCount] = useState(0); // <-- Add this

  // Add state to store current filters
  const [currentFilters, setCurrentFilters] = useState({
    companyId: "",
    projectId: "",
    siteId: "",
  });
  // Update the date formatting function
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Build base URL
        let url = `${baseURL}gate_passes.json?token=${token}&page=${currentPage}&per_page=${pageSize}`;

        // Add filters
        if (currentFilters.companyId) {
          url += `&q[company_id_eq]=${currentFilters.companyId}`;
        }
        if (currentFilters.projectId) {
          url += `&q[project_id_eq]=${currentFilters.projectId}`;
        }
        if (currentFilters.siteId) {
          // Assuming siteId corresponds to sub_project_id
          url += `&q[sub_project_id_eq]=${currentFilters.siteId}`;
        }
        if (returnableFilter === true) url += `&q[returnable_eq]=true`;
        if (returnableFilter === false) url += `&q[returnable_eq]=false`;

        // Add search
        if (searchKeyword) {
          url += `&search=${searchKeyword}`;
        }
        const response = await axios.get(url);
        // The API returns gate_passes array
        const data = (response.data.gate_passes || []).map((entry, index) => ({
          id: entry.id,
          srNo: (currentPage - 1) * pageSize + index + 1,
          ...entry,
          due_date: formatDate(entry.due_date),
          gate_pass_date: formatDate(entry.gate_pass_date),
          expected_return_date: formatDate(entry.expected_return_date),
          created_at: formatDate(entry.created_at),
          updated_at: formatDate(entry.updated_at),
          due_at: formatDate(entry.due_at),
        }));
        setBillEntries(data);
        // Set pagination info if available
        setMeta(response.data.pagination || {});
        setTotalPages(response.data.pagination?.total_pages || 1);
        setTotalEntries(response.data.pagination?.total_count || data.length);
        setStatusCounts(response.data.status_counts || {});
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, pageSize, searchKeyword, currentFilters, returnableFilter]);

  const columns = allColumns;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";

      // Get day, month, and year (last two digits)
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString().slice(-2); // Only last two digits

      // Return in DD-MM-YY format
      return `${day}-${month}-${year}`;
    } catch (e) {
      return "-";
    }
  };

  // Remove the duplicate handlePageChange and consolidate data fetching
  const handlePageChange = (event, value) => {
    setCurrentPage(value);

    // The useEffect will handle the data fetching with filters
  };

  const fetchFilteredData = () => {
    const companyId = selectedCompany?.value || "";
    const projectId = selectedProject?.value || "";
    const siteId = selectedSite?.value || "";

    // Store current filters
    setCurrentFilters({
      companyId,
      projectId,
      siteId,
    });

    // Reset to first page when applying new filters
    setCurrentPage(1);
  };

  // Update the handleReset function
  const handleReset = () => {
    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedSite(null);
    setSearchKeyword("");
    setCurrentFilters({
      companyId: "",
      projectId: "",
      siteId: "",
    });

    // Reset to first page
    setCurrentPage(1);
  };

  const [searchInput, setSearchInput] = useState("");

  // Handle search button click
  const handleSearch = () => {
    setSearchKeyword(searchInput);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle cross button click
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchKeyword("");
    setCurrentPage(1); // Reset to first page
  };

  const getTransformedRows = () => {
    let rowsToShow = showOnlyPinned
      ? billEntries.filter((row) => pinnedRows.includes(row.id))
      : billEntries;

    return rowsToShow;
  };

  // Calculate displayed rows for the current page
  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalEntries);

  const [statusOptions, setStatusOptions] = useState([]);
  const [createdByOptions, setCreatedByOptions] = useState([]);
  const [approvedByOptions, setApprovedByOptions] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState([]);
  const [selectedApprovedBy, setSelectedApprovedBy] = useState([]);

  useEffect(() => {
    if (!token) return;

    // Status options
    axios
      .get(`${baseURL}gate_passes/unique_statuses.json?token=${token}`)
      .then((response) => {
        const options = (response.data || []).map((status) => ({
          value: status,
          label: status.charAt(0).toUpperCase() + status.slice(1),
        }));
        setStatusOptions(options);
      })
      .catch(() => setStatusOptions([]));

    // Created By options
    axios
      .get(
        `${baseURL}gate_passes/gate_pass_users.json?created_by=true&token=${token}`
      )
      .then((response) => {
        const options = (response.data || []).map((user) => ({
          value: user.id,
          label: user.name,
        }));
        setCreatedByOptions(options);
      })
      .catch(() => setCreatedByOptions([]));

    // Approved By options
    axios
      .get(
        `${baseURL}gate_passes/gate_pass_users.json?approved_by=true&token=${token}`
      )
      .then((response) => {
        const options = (response.data || []).map((user) => ({
          value: user.id,
          label: user.name,
        }));
        setApprovedByOptions(options);
      })
      .catch(() => setApprovedByOptions([]));
  }, [token]);

  return (
    <>
      {/* <style type="text/css">
        {`

.tbl-container {

height: 350px !important;

}
.css-5n0k77:last-child{
display:none !important;
}



`}
      </style> */}
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">Home &gt; Store &gt; Store Operations &gt; Gate Pass</a>
          <h5 className="mt-4 fw-bold">Gate Pass List</h5>

          <div className="material-boxes mt-3">
            <div className="container-fluid">
              <div className="row separteinto6 justify-content-center">
                <div className="col-md-2 text-center">
                  <div
                    className={`content-box tab-button ${
                      returnableFilter === null ? "active" : ""
                    }`}
                    onClick={() => {
                      setReturnableFilter(null);
                      setCurrentPage(1);
                    }}
                  >
                    <h4 className="content-box-title fw-semibold">Total</h4>
                    <p className="content-box-sub">{statusCounts.total}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    className={`content-box tab-button ${
                      returnableFilter === true ? "active" : ""
                    }`}
                    onClick={() => {
                      setReturnableFilter(true);
                      setCurrentPage(1);
                    }}
                  >
                    <h4 className="content-box-title fw-semibold">
                      Returnable
                    </h4>
                    <p className="content-box-sub">{statusCounts.returnable}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    className={`content-box tab-button ${
                      returnableFilter === false ? "active" : ""
                    }`}
                    onClick={() => {
                      setReturnableFilter(false);
                      setCurrentPage(1);
                    }}
                  >
                    <h4 className="content-box-title fw-semibold">
                      Non-Returnable
                    </h4>
                    <p className="content-box-sub">
                      {statusCounts.non_returnable}
                    </p>
                  </div>
                </div>
                {/* <div className="col-md-2 text-center">
                  <div className="content-box tab-button">
                    <h4 className="content-box-title fw-semibold">
                      Pending to Return
                    </h4>
                    <p className="content-box-sub">5</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div className="content-box tab-button">
                    <h4 className="content-box-title fw-semibold">Value</h4>
                    <p className="content-box-sub">100200 ₹</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          <div className="card mt-3 pb-4">
            <div className="card mx-3 mt-3">
              <div className="card-header3">
                <h3 className="card-title">Quick Filter</h3>
                <div className="card-tools">
                  <button
                    type="button"
                    className="btn btn-tool"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                    <svg
                      width={32}
                      height={32}
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx={16} cy={16} r={16} fill="#8B0203" />
                      <path
                        d={
                          isCollapsed
                            ? "M16 24L9.0718 12L22.9282 12L16 24Z"
                            : "M16 8L22.9282 20L9.0718 20L16 8Z"
                        }
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <div className="card-body pt-0 mt-0">
                  <div className="row my-2 align-items-end">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Company</label>
                        <SingleSelector
                          options={companies.map((c) => ({
                            value: c.id,
                            label: c.company_name,
                          }))}
                          onChange={handleCompanyChange}
                          value={selectedCompany}
                          placeholder="Select Company"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Project</label>
                        <SingleSelector
                          options={projects}
                          onChange={handleProjectChange}
                          value={selectedProject}
                          placeholder="Select Project"
                          isDisabled={!selectedCompany}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Sub-project</label>
                        <SingleSelector
                          options={siteOptions}
                          onChange={handleSiteChange}
                          value={selectedSite}
                          placeholder="Select Sub-project"
                          isDisabled={!selectedProject}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <button
                        className="purple-btn2 m-0"
                        onClick={fetchFilteredData}
                      >
                        Go
                      </button>

                      {/* <div className="col-md-2"> */}
                      <button
                        className="purple-btn2 ms-2"
                        onClick={handleReset}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex mt-3 align-items-end px-3">
              <div className="col-md-6">
                <div className="input-group">
                  <input
                    type="search"
                    className="form-control tbl-search"
                    placeholder="Type your keywords here"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <div className="input-group-append">
                    {/* {searchInput && (
                      <button
                        type="button"
                        className="btn btn-md btn-default"
                        onClick={handleClearSearch}
                      >
                         ✕ {/* Cross icon */}
                    {/* </button> */}
                    {searchInput && (
                      <button
                        type="button"
                        className="btn btn-md btn-default"
                        // onClick={() => {
                        //   setSearchTerm(""); // Clear the search term
                        //   fetchData();
                        //   // activeTab,
                        //   // filters,
                        //   // pagination.current_page,
                        //   // "" // Fetch data without search
                        // }}
                        onClick={handleClearSearch}
                      >
                        ✕ {/* Cross icon */}
                      </button>
                    )}
                    {/* )} */}
                    <button
                      type="submit"
                      className="btn btn-md btn-default"
                      onClick={handleSearch}
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
              </div>
              <div className="col-md-5 d-flex justify-content-end align-items-center gap-5 mt-4">
                <button
                  type="button"
                  className="btn btn-md"
                  onClick={handleFilterModalShow}
                >
                  <FilterIcon />
                </button>
                <button
                  type="button"
                  className="btn btn-md"
                  onClick={handleSettingModalShow}
                >
                  <SettingIcon />
                </button>
                <button
                  className="purple-btn2"
                  onClick={() => navigate(`/gate-pass-create?token=${token}`)}
                >
                  <span> + Add</span>
                </button>
              </div>
            </div>

            <div className="mx-1 mt-3" style={{ width: "100%" }}>
              <DataGrid
                rows={getTransformedRows()}
                columns={columns}
                pageSize={pageSize}
                autoHeight
                getRowId={(row) => row.id}
                loading={loading}
                disableSelectionOnClick
                columnVisibilityModel={columnVisibility}
                onColumnVisibilityModelChange={setColumnVisibility}
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
                  "& .MuiDataGrid-virtualScroller": {
                    overflowX: "auto",
                  },
                  "& .MuiDataGrid-virtualScrollerContent": {
                    minWidth: "100%",
                  },
                  "& .MuiDataGrid-virtualScrollerRenderZone": {
                    position: "relative",
                  },
                  "& .MuiDataGrid-main": {
                    overflow: "visible",
                  },
                }}
              />
            </div>

            {/* Bootstrap-style Pagination Bar */}
            <div className="d-flex justify-content-between align-items-center px-3 py-2">
              <nav aria-label="Page navigation example">
                <ul className="pagination mb-0">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      First
                    </button>
                  </li>
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                  </li>
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, idx, arr) => {
                      // Add ellipsis if needed
                      if (idx > 0 && page - arr[idx - 1] > 1) {
                        return [
                          <li
                            key={`ellipsis-${page}`}
                            className="page-item disabled"
                          >
                            <span className="page-link">...</span>
                          </li>,
                          <li
                            key={page}
                            className={`page-item ${
                              currentPage === page ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </li>,
                        ];
                      }
                      return (
                        <li
                          key={page}
                          className={`page-item ${
                            currentPage === page ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      );
                    })}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      Last
                    </button>
                  </li>
                </ul>
              </nav>
              <div className="ms-3">
                <span>
                  Showing {startEntry} to {endEntry} of {totalEntries} entries
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  {/* <button type="submit" className="btn btn-md">
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
                  </button> */}
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
          {/* <Button variant="primary" onClick={handleShowAll}>
            Show All
          </Button>
          <Button variant="danger" onClick={handleHideAll}>
            Hide All
          </Button> */}
          <button className="purple-btn2" onClick={handleShowAll}>
            Show All
          </button>
          <button className="purple-btn1" onClick={handleHideAll}>
            Hide All
          </button>
        </Modal.Footer>
      </Modal>

      {/* Filter Modal */}
      <Modal
        show={filterShow}
        onHide={handleFilterClose}
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
                  onClick={handleFilterClose}
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
                onClick={handleFilterReset}
                role="button"
              >
                Reset
              </span>
            </div>
          </div>
        </Modal.Header>

        <div className="modal-body" style={{ overflowY: "scroll" }}>
          <div className="row justify-content-between align-items-center mt-2">
            <div className="col-6 mt-2">
              <label className="block text-sm font-medium">Company</label>
              <MultiSelector
                options={companies.map((c) => ({
                  value: c.id,
                  label: c.company_name,
                }))}
                value={selectedFilterCompanies}
                onChange={setSelectedFilterCompanies}
                placeholder="Select Company"
                isMulti
              />
            </div>
            <div className="col-6 mt-2">
              <label className="block text-sm font-medium">Project</label>
              <MultiSelector
                options={filterProjectOptions}
                value={selectedFilterProjects}
                onChange={setSelectedFilterProjects}
                placeholder="Select Project"
                isMulti
              />
            </div>
            <div className="col-6 mt-2">
              <label className="block text-sm font-medium">Sub-Project</label>
              <MultiSelector
                options={filterSubProjectOptions}
                value={selectedFilterSubProjects}
                onChange={setSelectedFilterSubProjects}
                placeholder="Select Sub-Project"
                isMulti
              />
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Material Type</label>
                <MultiSelector
                  options={inventoryTypes}
                  onChange={handleInventoryChange}
                  value={selectedInventory}
                  placeholder="Select Material Type"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mt-2">
                <label>Material Sub-Type</label>
                <MultiSelector
                  options={inventorySubTypes}
                  onChange={handleSubTypeChange}
                  value={selectedSubType}
                  placeholder="Select Material Sub-Type"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mt-2">
                <label>Material</label>
                <MultiSelector
                  options={inventoryMaterialTypes}
                  onChange={handleInventoryMaterialTypeChange}
                  value={selectedInventoryMaterialTypes}
                  placeholder="Select Material"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mt-2">
                <label>Generic Specification</label>
                <SingleSelector
                  options={genericSpecifications}
                  onChange={handleGenericSpecChange}
                  value={selectedGenericSpec}
                  placeholder="Select Gen Specification"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mt-2">
                <label>Colour</label>
                <SingleSelector
                  options={colors}
                  onChange={handleColorChange}
                  value={selectedColor}
                  placeholder="Select Colour"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mt-2">
                <label>Brand</label>
                <SingleSelector
                  options={brands}
                  onChange={handleBrandChange}
                  value={selectedBrand}
                  placeholder="Select Brand"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mt-2">
                <label>UOM</label>
                <SingleSelector
                  options={uoms}
                  onChange={handleUomChange}
                  value={selectedUom}
                  placeholder="Select UOM"
                />
              </div>
            </div>
            <div className="col-6 mt-2">
              <label className="block text-sm font-medium">
                Gate Pass Type
              </label>
              <SingleSelector
                options={gatePassOptions}
                value={selectedGatePass}
                onChange={handleGatePassChange}
                placeholder="Select Gate Pass Type"
              />
            </div>
            <div className="col-6 mt-2">
              <label className="block text-sm font-medium">Gate Pass No.</label>
              <MultiSelector
                options={gatePassNumberOptions}
                value={selectedGatePassNumbers}
                onChange={handleGatePassNumberChange}
                placeholder="Select Gate Pass No."
                isMulti
              />
            </div>
            <div className="col-6 mt-2">
              <label className="block text-sm font-medium">PO / MTO No.</label>
              <MultiSelector
                options={poNumberOptions}
                value={selectedPoNumbers}
                onChange={handlePoNumberChange}
                placeholder="Select PO No."
                isMulti
              />
            </div>
            <div className="col-6 mt-2">
              <label className="block text-sm font-medium">Status</label>
              <MultiSelector
                options={statusOptions}
                value={selectedStatuses}
                onChange={setSelectedStatuses}
                placeholder="Select Status"
                isMulti
              />
            </div>
            <div className="col-6 mt-2">
              <label className="block text-sm font-medium">Issued By</label>
              <MultiSelector
                options={createdByOptions}
                value={selectedCreatedBy}
                onChange={setSelectedCreatedBy}
                placeholder="Select Issued By"
                isMulti
              />
            </div>
            <div className="col-6 mt-2">
              <label className="block text-sm font-medium">Approved By</label>
              <MultiSelector
                options={approvedByOptions}
                value={selectedApprovedBy}
                onChange={setSelectedApprovedBy}
                placeholder="Select Approved By"
                isMulti
              />
            </div>
          </div>
        </div>

        <div className="modal-footer justify-content-center">
          <button
            className="btn"
            style={{ backgroundColor: "#8b0203", color: "#fff" }}
            onClick={handleFilterGo}
          >
            Go
          </button>
        </div>
      </Modal>
    </>
  );
};

export default GatePassList;
