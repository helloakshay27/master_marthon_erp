import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Pagination,
  Typography,
  Stack,
  Button as MuiButton,
  Box,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import axios, { all } from "axios";
import SingleSelector from "../components/base/Select/SingleSelector"; // Adjust path as needed
import CollapsibleCard from "../components/base/Card/CollapsibleCards";

import { baseURL, baseURL1 } from "../confi/apiDomain";
import MultiSelector from "../components/base/Select/MultiSelector";
import { toast, ToastContainer } from "react-toastify";
// import { useLocation } from "react-router-dom";


const ErpStockRegister13B = () => {
  // const location = useLocation(); // ✅ this gives you the current location object
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [bulkIsCollapsed, setBulkIsCollapsed] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [settingShow, setSettingShow] = useState(false);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showOnlyPinned, setShowOnlyPinned] = useState(false);
  const [pinnedRows, setPinnedRows] = useState([]);
  const [errors, setErrors] = useState({});
  const [pagination, setPagination] = useState({});




  // Column settings modal handlers (keep only one set, remove duplicates below)
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
  const handleReset = () => {
    const defaultVisibility = allColumns.reduce((acc, column) => {
      acc[column.field] = true;
      return acc;
    }, {});
    setColumnVisibility(defaultVisibility);
  };

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

  const handleSettingClose = () => setSettingShow(false);
  const handleClose = () => setShow(false);
  const handleSettingModalShow = () => setSettingShow(true);
  const handleModalShow = () => setShow(true);

  // Calculate displayed rows for the current page
  const startEntry = (page - 1) * pageSize + 1;
  // console.log("pagination:-", pagination);

  // const endEntry = Math.min(
  //   pagination.current_page * pageSize,
  //   pagination.total_count
  // );

  // (Removed duplicate columns declaration)

  const handlePinRow = (rowId) => {
    setPinnedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  const toggleShowOnlyPinned = () => {
    setShowOnlyPinned((prev) => !prev);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Stock_Data.xlsx");
  };

  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [subProjects, setSubProjects] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedSubProject, setSelectedSubProject] = useState([]);
  const [selectedIds, setSelectedIds] = useState({
    genericInfos: [],
    materialSubTypes: [],
    materialTypes: [],
    unitOfMeasures: [],
    morNumbers: [],
    grnNumbers: [],
  });

  const [morOptions, setMorOptions] = useState([]);
  const [grnOptions, setGrnOptions] = useState([]);

  // Extract unique MOR and GRN numbers from table data
  useEffect(() => {
    if (data && data.length > 0) {
      // Extract unique MOR numbers
      const uniqueMorNumbers = [
        ...new Set(data.map((item) => item.mor).filter(Boolean)),
      ];
      const morOptions = uniqueMorNumbers.map((number) => ({
        value: number,
        label: number,
      }));
      setMorOptions(morOptions);

      // Extract unique GRN numbers
      const uniqueGrnNumbers = [
        ...new Set(data.map((item) => item.grn_number).filter(Boolean)),
      ];
      const grnOptions = uniqueGrnNumbers.map((number) => ({
        value: number,
        label: number,
      }));
      setGrnOptions(grnOptions);
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const urlParams = new URLSearchParams(location.search);
        // const token = urlParams.get("token");
        // const token = "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414";

        const response = await fetch(
          `${baseURL}/stock_details.json?token=${token}`
          // &search=${encodeURIComponent(
          //   searchTerm
          // )}&q[generic_info_id]=${selectedIds.genericInfos
          // }&q[material_type_id]=${selectedIds.materialTypes
          // }&q[material_sub_type_id]=${selectedIds.materialSubTypes
          // }&q[brand_id]=&q[uom_id]=${selectedIds.unitOfMeasures
          // }&q[mor_number]=${selectedIds.morNumbers}&q[grn_number]=${selectedIds.grnNumbers
          // }&q[store_id_eq]=${selectedStore?.value || ""}&page=${page}&per_page=${pageSize}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        console.log("result ---", result);
        const transformedData = result?.mor_inventories?.map((item, index) => {
          const materialUrl =
            item.id && token
              ? `/stock_register_detail/${item.id}/?token=${token}`
              : "#";
          const firstStore = item.stores && item.stores.length > 0 ? item.stores[0] : null;

          return {


            id: item.id ?? `row-${index + 1}`,
            store_id: firstStore ? firstStore.store_id : null,
            srNo: index + 1,
            material: item.category || "-",
            materialUrl: materialUrl,
            material_name: item.material_name || "-",
            lastReceived: item.last_received_on || "-",
            total_received: item.total_received !== null && item.total_received !== undefined ? item.total_received : "-",
            total_issued: item.total_issued !== null && item.total_issued !== undefined ? item.total_issued : "-",
            deadstockQty: item.deadstock_qty !== null && item.deadstock_qty !== undefined ? item.deadstock_qty : "-",
            stock_as_on: item.stock_as_on !== null && item.stock_as_on !== undefined ? item.stock_as_on : "-",
            stockStatus: item.stock_details?.[0]?.status || "-",
            theftMissing: item.missing_qty !== undefined && item.missing_qty !== null ? item.missing_qty : "-",
            uom_name: item.uom || "-",
            mor: item.stock_details?.map((stock) => stock.mor).join(", ") || "-",
            grn_number: item.stock_details?.map((stock) => stock.grn_number).join(", ") || "-",
            stock_details: item?.stock_details?.map((stock) => ({
              stockId: stock.id,
              createdAt: stock.created_at || "-",
              mor: stock.mor || "-",
              resourceNumber: stock.resource_number || "-",
              receivedQty: stock.received_qty !== null && stock.receivedQty !== undefined ? stock.receivedQty : "-",
              issuedQty: stock.issued_qty !== null && stock.issued_qty !== undefined ? stock.issued_qty : "-",
              returnedQty: stock.returned_qty !== null && stock.returned_qty !== undefined ? stock.returned_qty : "-",
              balancedQty: stock.balanced_qty !== null && stock.balanced_qty !== undefined ? stock.balanced_qty : "-",
            })) || [],

          };
        });

        setData(transformedData);
        // setFilteredData(transformedData);
        setLoading(false);
        setPagination(result.pagination);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [
    location.search,
    selectedCompany,
    selectedProject,
    page,
    searchTerm,
    selectedIds,
    selectedSubProject,
  ]);

  const handleResets = () => {
    setSelectedCompany([]);
    setSelectedProject([]);
    setSelectedSubProject([]);
    setSelectedStore(null)
  };

  const getTransformedRows = () => {
    let rowsToShow = data;

    // Apply search filter
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    if (normalizedSearchTerm) {
      rowsToShow = rowsToShow.filter((item) =>
        Object.values(item).some(
          (value) =>
            value && String(value).toLowerCase().includes(normalizedSearchTerm)
        )
      );
    }

    return rowsToShow;
  };

  const bulkToggleCardBody = () => {
    setBulkIsCollapsed(!bulkIsCollapsed);
  };

  const toggleCardBody = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Fetch Companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        setCompanies(response.data.companies || []);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  // Handle Company Selection
  const handleCompanyChange = (companyId) => {
    setSelectedCompany(companyId);
    setSelectedProject(null);
    setSelectedSubProject(null);
    setProjects([]);
    setSubProjects([]);

    if (companyId) {
      const company = companies.find((c) => c.id === companyId);
      setProjects(
        company?.projects.map((p) => ({ value: p.id, label: p.name })) || []
      );
    }
  };
  const [selectedStore, setSelectedStore] = useState(null);

  // Handle Project Selection
  const handleProjectChange = (projectId) => {
    setSelectedProject(projectId);
    setSelectedSubProject(null);
    setSubProjects([]);

    if (projectId) {
      const company = companies.find((c) => c.id === selectedCompany); // Use selectedCompany directly
      const project = company?.projects.find((p) => p.id === projectId);

      // setSubProjects(
      //   project?.pms_sites.map((s) => ({ value: s.id, label: s.name })) || []
      // );

      setSubProjects(
        project?.pms_sites.map((s) => ({
          value: s.id,
          label: s.name,
          store_id: s.store_id,
          store_name: s.store_name,
          // add any other fields you need from s
        })) || []
      );
    }
  };

  // Handle Subproject Selection



  // / Update handleSubProjectChange to also set the store
  const handleSubProjectChange = (subProjectId) => {
    setSelectedSubProject(subProjectId);
    console.log("sub prj-----", subProjectId)
    // Find the selected sub-project from subProjects array
    const subProjectObj = subProjects.find((s) => s.value === subProjectId);
    console.log("sub prj obj", subProjectObj)
    if (subProjectObj && subProjectObj.store_id && subProjectObj.store_name) {
      setSelectedStore({
        value: subProjectObj.store_id,
        label: subProjectObj.store_name,
      });
    } else {
      setSelectedStore(null);
    }
  };
  console.log("selected store:", selectedStore)
  // Prepare store options based on selected sub-project
  const storeOptions = (() => {
    const subProjectObj = subProjects.find((s) => s.value === selectedSubProject);
    if (subProjectObj && subProjectObj.store_id && subProjectObj.store_name) {
      return [
        {
          value: subProjectObj.store_id,
          label: subProjectObj.store_name,
        },
      ];
    }
    return [];
  })();



  const [genericInfos, setGenericInfos] = useState([]);
  const [materialSubTypes, setMaterialSubTypes] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  // const [unitOfMeasures, setUnitOfMeasures] = useState([]);

  const fetchData = async (url, setState) => {
    try {
      const response = await axios.get(url);
      setState(response.data);
    } catch (error) {
      console.error("Error fetching data from", url, error);
    }
  };

  useEffect(() => {
    fetchData(
      `${baseURL}pms/generic_infos.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
      setGenericInfos
    );
    fetchData(
      `${baseURL}pms/inventory_sub_types.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
      setMaterialSubTypes
    );
    fetchData(
      `${baseURL}pms/inventory_types.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
      setMaterialTypes
    );
    fetchData(
      `${baseURL}unit_of_measures.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
      setUnitOfMeasures
    );
  }, []);

  const formatOptions = (data) => {
    return data.map((item) => ({
      label: item.name || item.title || item.generic_info,
      value: item.id,
    }));
  };

  const handleChange = (key, selectedOptions) => {
    setSelectedIds((prev) => ({
      ...prev,
      [key]: selectedOptions.map((option) => option.value), // Persist selected values
    }));
  };

  // Helper function to get selected options for MultiSelector
  const getSelectedOptions = (key, options) => {
    return options.filter((option) => selectedIds[key].includes(option.value));
  };

  // Pagination logic for custom UI
  const totalPages = Number.isInteger(pagination?.total_pages)
    ? pagination.total_pages
    : 1;
  const currentPage = Number.isInteger(pagination?.current_page)
    ? pagination.current_page
    : 1;
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setLoading(true); // Show loader immediately
    setPage(pageNumber);
  };


  const handleGoClick = async (e) => {
    console.log("handle go ....")
    e.preventDefault();

    if (!selectedCompany || !selectedProject || !selectedSubProject || !selectedStore) {
      toast.error("Please select Company, Project, Sub-project, and Store");
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
        token: "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
        search: "",
        // "q[stock_details_mor_inventory_material_order_request_company_id_eq]": selectedCompany,
        // "q[stock_details_mor_inventory_material_order_request_project_id_eq]": selectedProject || "",
        // "q[stock_details_mor_inventory_material_order_request_pms_site_id_eq]": selectedSubProject || "",
        "q[store_id_eq]": selectedStore?.value || "",
        "q[generic_info_id]": selectedIds.genericInfos.join(","),
        "q[material_type_id]": selectedIds.materialTypes.join(","),
        "q[material_sub_type_id]": selectedIds.materialSubTypes.join(","),
        "q[uom_id]": selectedIds.unitOfMeasures.join(","),
        "q[mor_number]": selectedIds.morNumbers.join(","),
        "q[grn_number]": selectedIds.grnNumbers.join(","),
        page: 1,
        per_page: 10,
      });

      const response = await axios.get(`https://marathon.lockated.com/stock_details.json?${params.toString()}`);

      // Handle response data
      console.log("Fetched stock data:", response.data);
      setFilteredData(response.data); // or any appropriate state you have
    } catch (error) {
      console.error("Error fetching stock details:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };


  // Update columnVisibility to the correct fields and remove duplicate/conflicting declarations
  const [columnVisibility, setColumnVisibility] = useState({
    srNo: true,
    material: true,
    material_name: true,
    // material_type: true,
    // materialSubType: true,
    // materialDescription: true,
    // specification: true,
    lastReceived: true,
    total_received: true,
    total_issued: true,
    stock_as_on: true,
    // status: true,
    deadstockQty: true,
    theftMissing: true,
    uom_name: true,
    // Star: true,
    mor: true, // Added Mor Number column
    grn_number: true, //
  });

  const allColumns = [
    { field: "srNo", headerName: "Sr.No.", width: 80, sortable: true },
    {
      field: "material",
      headerName: "Material Category",
      width: 150,
      sortable: true,
    },
    {
      field: "material_name",
      headerName: "Material Name",
      width: 300,
      sortable: true,
      renderCell: (params) =>
        params.value && params.row.store_id ? (
          <Link
            // to={`/stock_register_detail/${params.row.store_id}?token=${token}`
            to={`/stock_register_detail/${params.row.id}&store_id=${selectedStore?.value}?token=${token}`}

          >
            <span className="boq-id-link">{params.value}</span>
          </Link>
        ) : (
          "-"
        ),
    },
    // {
    //   field: "material_type",
    //   headerName: "Material Type",
    //   width: 150,
    //   sortable: true,
    // },
    // {
    //   field: "materialSubType",
    //   headerName: "Material Sub Type",
    //   width: 150,
    //   sortable: true,
    // },
    // {
    //   field: "materialDescription",
    //   headerName: "Material Description",
    //   width: 200,
    //   sortable: true,
    // },
    // {
    //   field: "specification",
    //   headerName: "Specification",
    //   width: 180,
    //   sortable: true,
    // },
    {
      field: "lastReceived",
      headerName: "Last Received On",
      width: 150,
      sortable: true,
    },
    {
      field: "total_received",
      headerName: "Total Received",
      width: 130,
      sortable: true,
    },
    {
      field: "total_issued",
      headerName: "Total Issued",
      width: 120,
      sortable: true,
    },
    {
      field: "stock_as_on",
      headerName: "Stock As On",
      width: 120,
      sortable: true,
    },
    // {
    //   field: "status",
    //   headerName: "Stock Status",
    //   width: 120,
    //   sortable: true,
    // },
    {
      field: "deadstockQty",
      headerName: "Deadstock Qty",
      width: 120,
      sortable: true,
    },
    {
      field: "theftMissing",
      headerName: "Theft/Missing Qty",
      width: 140,
      sortable: true,
    },
    { field: "uom_name", headerName: "UOM", width: 100, sortable: true },
    // { field: "Star", headerName: "Star", width: 80, sortable: false },
    { field: "mor", headerName: "MOR Number", width: 120, sortable: true },
    {
      field: "grn_number",
      headerName: "GRN Number",
      width: 120,
      sortable: true,
    },
  ];


  // material type options 
  const [formData, setFormData] = useState({
    materialType: "",
    materialSubType: "",
    material: "",
    genericSpecification: "",
    colour: "",
    brand: "",
    effectiveDate: "",
    rate: "",
    rateType: "",
    poRate: "",
    avgRate: "",
    uom: "",
  });

  const [inventoryTypes2, setInventoryTypes2] = useState([]);  // State to hold the fetched data
  const [selectedInventory2, setSelectedInventory2] = useState(null);  // State to hold selected inventory type
  const [inventorySubTypes2, setInventorySubTypes2] = useState([]); // State to hold the fetched inventory subtypes
  const [selectedSubType2, setSelectedSubType2] = useState(null); // State to hold selected sub-type
  const [inventoryMaterialTypes2, setInventoryMaterialTypes2] = useState([]); // State to hold the fetched inventory subtypes
  const [selectedInventoryMaterialTypes2, setSelectedInventoryMaterialTypes2] = useState(null); // State to hold selected sub-type
  // Fetching inventory types data from API on component mount
  useEffect(() => {
    axios.get(`${baseURL}pms/inventory_types.json?q[category_eq]=material&token=${token}`)
      .then(response => {
        // Map the fetched data to the format required by react-select
        const options = response.data.map(inventory => ({
          value: inventory.id,
          label: inventory.name
        }));

        setInventoryTypes2(options)
      })
      .catch(error => {
        console.error('Error fetching inventory types:', error);
      });
  }, []);  // Empty dependency array to run only once on mount


  // Fetch inventory sub-types when an inventory type is selected
  useEffect(() => {
    if (selectedInventory2) {
      //   const inventoryTypeIds = selectedInventory.map(item => item.value).join(','); // Get the selected inventory type IDs as a comma-separated list

      axios.get(`${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${selectedInventory2?.value}&token=${token}`)
        .then(response => {
          // Map the sub-types to options for the select dropdown
          const options = response.data.map(subType => ({
            value: subType.id,
            label: subType.name
          }));

          setInventorySubTypes2(options)
        })
        .catch(error => {
          console.error('Error fetching inventory sub-types:', error);
        });
    }
  }, [selectedInventory2]); // Run this effect whenever the selectedInventory state changes

  // Fetch inventory Material when an inventory type is selected
  useEffect(() => {
    if (selectedInventory2) {
      //   const inventoryTypeIds = selectedInventory.map(item => item.value).join(','); // Get the selected inventory type IDs as a comma-separated list

      axios.get(`${baseURL}pms/inventories.json?q[inventory_type_id_in]=${selectedInventory2?.value}&q[material_category_eq]=material&token=${token}`)
        .then(response => {
          // Map the sub-types to options for the select dropdown
          const options = response.data.map(subType => ({
            value: subType.id,
            label: subType.name
          }));

          setInventoryMaterialTypes2(options)
        })
        .catch(error => {
          console.error('Error fetching inventory sub-types:', error);
        });
    }
  }, [selectedInventory2]); // Run this effect whenever the selectedInventory state changes
  // for generic specification
  const [genericSpecifications, setGenericSpecifications] = useState([]); // State to hold the fetched generic specifications
  const [selectedGenericSpecifications, setSelectedGenericSpecifications] = useState(null); // Holds the selected generic specifications for each material

  // Fetch generic specifications for materials
  useEffect(() => {

    if (selectedInventoryMaterialTypes2) {
      axios
        .get(
          `${baseURL}pms/generic_infos.json?q[material_id_eq]=${selectedInventoryMaterialTypes2.value}&token=${token}`
        )
        .then((response) => {
          const options = response.data.map((specification) => ({
            value: specification.id,
            label: specification.generic_info,
          }));

          setGenericSpecifications(options);
        })
        .catch((error) => {
          console.error("Error fetching generic specifications:", error);
        });
    }

  }, [selectedInventoryMaterialTypes2, baseURL]); // Runs when materials or baseURL changes

  // color
  const [colors, setColors] = useState([]); // State to hold the fetched colors
  const [selectedColors, setSelectedColors] = useState(null); // Holds the selected colors for each material
  useEffect(() => {
    if (selectedInventoryMaterialTypes2) {
      axios
        .get(
          `${baseURL}pms/colours.json?q[material_id_eq]=${selectedInventoryMaterialTypes2.value}&token=${token}`
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
    }
  }, [selectedInventoryMaterialTypes2, baseURL]); // Runs when materials or baseURL changes

  //for brand in material table
  const [inventoryBrands, setInventoryBrands] = useState([]); // State to hold the fetched inventory brands
  const [selectedInventoryBrands, setSelectedInventoryBrands] = useState(null); // Holds the selected brands for each material
  useEffect(() => {
    if (selectedInventoryMaterialTypes2) {
      axios
        .get(
          `${baseURL}pms/inventory_brands.json?q[material_id_eq]=${selectedInventoryMaterialTypes2.value}&token=${token}`
        )
        .then((response) => {
          const options = response.data.map((brand) => ({
            value: brand.id,
            label: brand.brand_name,
          }));
          setInventoryBrands(options);
        })
        .catch((error) => {
          console.error(
            "Error fetching inventory brands for material:",
            error
          );
        });
    }
  }, [selectedInventoryMaterialTypes2, baseURL]); // Runs when materials or baseURL changes
  const handleSelectorChange = (field, selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: selectedOption?.value || "",
      [`${field}Label`]: selectedOption?.label || "",
    }));

    if (field === "materialType") {
      // Logic for materialType selection
      setSelectedInventory2(selectedOption); // Set the selected inventory type
      setSelectedSubType2(null); // Clear the selected sub-type when inventory type changes
      setInventorySubTypes2([]); // Reset the sub-types list
      setInventoryMaterialTypes2([]); // Reset the material types list
      setSelectedInventoryMaterialTypes2(null); // Clear selected material type
      setGenericSpecifications([])
      setSelectedGenericSpecifications(null)
      setColors([])
      setSelectedColors(null)
      setInventoryBrands([])
      setSelectedInventoryBrands(null)
    }

    if (field === "materialSubType") {
      // Logic for materialSubType selection
      setSelectedSubType2(selectedOption); // Set the selected inventory sub-type
    }
    if (field === "material") {
      // Logic for materialSubType selection
      setSelectedInventoryMaterialTypes2(selectedOption); // Set the selected inventory sub-type

    }
    if (field === "uom") {
      // Logic for materialSubType selection
      setSelectedUnit(selectedOption); // Set the selected inventory sub-type
    }
    if (field === "genericSpecification") {
      // Logic for materialSubType selection
      setSelectedGenericSpecifications(selectedOption); // Set the selected inventory sub-type
    }
    if (field === "colour") {
      // Logic for materialSubType selection
      setSelectedColors(selectedOption); // Set the selected inventory sub-type
    }
    if (field === "brand") {
      // Logic for materialSubType selection
      setSelectedInventoryBrands(selectedOption); // Set the selected inventory sub-type
    }
  };

  // umo api

  const [unitOfMeasures, setUnitOfMeasures] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  // Fetching the unit of measures data on component mount
  useEffect(() => {
    axios
      .get(
        `${baseURL}unit_of_measures.json?token=${token}`
      )
      .then((response) => {
        // Mapping the response to the format required by react-select
        const options = response.data.map((unit) => ({
          value: unit.id,
          label: unit.name,
        }));
        setUnitOfMeasures(options); // Save the formatted options to state
      })
      .catch((error) => {
        console.error("Error fetching unit of measures:", error);
      });
  }, []);


  // Add this function inside your component
  const handleFilterGo = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        token: "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
        search: "",
        "q[material_type_id_eq]": formData.materialType || "",
        "q[material_sub_type_id_eq]": formData.materialSubType || "",
        "q[material_id_eq]": formData.material || "",
        "q[generic_info_id_eq]": formData.genericSpecification || "",
        "q[unit_of_measure_id]": formData.uom || "",
        "q[status_eq]": "", // Add status if you have it in your form
        "q[brand_id_eq]": formData.brand || "",
        "q[colour_id_eq]": formData.colour || "",
        page: 1,
        per_page: 10,
      });

      const response = await axios.get(`https://marathon.lockated.com/stock_details.json?${params.toString()}`);
      console.log("response.data", response.data)
      // Handle response data
      const result = response.data;
      console.log("result ---", result);
      const transformedData = result?.mor_inventories?.map((item, index) => {
        const materialUrl =
          item.id && token
            ? `/stock_register_detail/${item.id}/?token=${token}`
            : "#";
        const firstStore = item.stores && item.stores.length > 0 ? item.stores[0] : null;

        return {


          id: item.id ?? `row-${index + 1}`,
          store_id: firstStore ? firstStore.store_id : null,
          srNo: index + 1,
          material: item.category || "-",
          materialUrl: materialUrl,
          material_name: item.material_name || "-",
          lastReceived: item.last_received_on || "-",
          total_received: item.total_received !== null && item.total_received !== undefined ? item.total_received : "-",
          total_issued: item.total_issued !== null && item.total_issued !== undefined ? item.total_issued : "-",
          deadstockQty: item.deadstock_qty !== null && item.deadstock_qty !== undefined ? item.deadstock_qty : "-",
          stock_as_on: item.stock_as_on !== null && item.stock_as_on !== undefined ? item.stock_as_on : "-",
          stockStatus: item.stock_details?.[0]?.status || "-",
          theftMissing: item.missing_qty !== undefined && item.missing_qty !== null ? item.missing_qty : "-",
          uom_name: item.uom || "-",
          mor: item.stock_details?.map((stock) => stock.mor).join(", ") || "-",
          grn_number: item.stock_details?.map((stock) => stock.grn_number).join(", ") || "-",
          stock_details: item?.stock_details?.map((stock) => ({
            stockId: stock.id,
            createdAt: stock.created_at || "-",
            mor: stock.mor || "-",
            resourceNumber: stock.resource_number || "-",
            receivedQty: stock.received_qty !== null && stock.receivedQty !== undefined ? stock.receivedQty : "-",
            issuedQty: stock.issued_qty !== null && stock.issued_qty !== undefined ? stock.issued_qty : "-",
            returnedQty: stock.returned_qty !== null && stock.returned_qty !== undefined ? stock.returned_qty : "-",
            balancedQty: stock.balanced_qty !== null && stock.balanced_qty !== undefined ? stock.balanced_qty : "-",
          })) || [],

        };
      });
      setData(transformedData)
      setFilteredData(transformedData);
      setPagination(response.data?.pagination || {});
      setShow(false); // Close modal after filter
    } catch (error) {
      toast.error("Failed to fetch filtered data");
      console.error("Filter API error:", error);
    } finally {
      setLoading(false);
    }
  };

//   const handleFilterReset =async () => {
//     // setSelectedIds({
//     //   genericInfos: [],
//     //   materialSubTypes: [],
//     //   materialTypes: [],
//     //   unitOfMeasures: [],
//     //   morNumbers: [],
//     //   grnNumbers: [],
//     // });

//     setSelectedInventory2(null)
// setInventoryTypes2([])
//     setSelectedSubType2(null); // Clear the selected sub-type when inventory type changes
//     setInventorySubTypes2([]); // Reset the sub-types list
//     setInventoryMaterialTypes2([]); // Reset the material types list
//     setSelectedInventoryMaterialTypes2(null); // Clear selected material type
//     setGenericSpecifications([])
//     setSelectedGenericSpecifications(null)
//     setColors([])
//     setSelectedColors(null)
//     setInventoryBrands([])
//     setSelectedInventoryBrands(null)
//     setSelectedUnit(null)
//     setUnitOfMeasures([])
//         // setShow(false)



//          setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         token: "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
//         search: "",
//         "q[material_type_id_eq]": formData.materialType || "",
//         "q[material_sub_type_id_eq]": formData.materialSubType || "",
//         "q[material_id_eq]": formData.material || "",
//         "q[generic_info_id_eq]": formData.genericSpecification || "",
//         "q[unit_of_measure_id]": formData.uom || "",
//         "q[status_eq]": "", // Add status if you have it in your form
//         "q[brand_id_eq]": formData.brand || "",
//         "q[colour_id_eq]": formData.colour || "",
//         page: 1,
//         per_page: 10,
//       });

//       const response = await axios.get(`https://marathon.lockated.com/stock_details.json?${params.toString()}`);
//       console.log("response.data", response.data)
//       // Handle response data
//       const result = response.data;
//       console.log("result ---", result);
//       const transformedData = result?.mor_inventories?.map((item, index) => {
//         const materialUrl =
//           item.id && token
//             ? `/stock_register_detail/${item.id}/?token=${token}`
//             : "#";
//         const firstStore = item.stores && item.stores.length > 0 ? item.stores[0] : null;

//         return {


//           id: item.id ?? `row-${index + 1}`,
//           store_id: firstStore ? firstStore.store_id : null,
//           srNo: index + 1,
//           material: item.category || "-",
//           materialUrl: materialUrl,
//           material_name: item.material_name || "-",
//           lastReceived: item.last_received_on || "-",
//           total_received: item.total_received !== null && item.total_received !== undefined ? item.total_received : "-",
//           total_issued: item.total_issued !== null && item.total_issued !== undefined ? item.total_issued : "-",
//           deadstockQty: item.deadstock_qty !== null && item.deadstock_qty !== undefined ? item.deadstock_qty : "-",
//           stock_as_on: item.stock_as_on !== null && item.stock_as_on !== undefined ? item.stock_as_on : "-",
//           stockStatus: item.stock_details?.[0]?.status || "-",
//           theftMissing: item.missing_qty !== undefined && item.missing_qty !== null ? item.missing_qty : "-",
//           uom_name: item.uom || "-",
//           mor: item.stock_details?.map((stock) => stock.mor).join(", ") || "-",
//           grn_number: item.stock_details?.map((stock) => stock.grn_number).join(", ") || "-",
//           stock_details: item?.stock_details?.map((stock) => ({
//             stockId: stock.id,
//             createdAt: stock.created_at || "-",
//             mor: stock.mor || "-",
//             resourceNumber: stock.resource_number || "-",
//             receivedQty: stock.received_qty !== null && stock.receivedQty !== undefined ? stock.receivedQty : "-",
//             issuedQty: stock.issued_qty !== null && stock.issued_qty !== undefined ? stock.issued_qty : "-",
//             returnedQty: stock.returned_qty !== null && stock.returned_qty !== undefined ? stock.returned_qty : "-",
//             balancedQty: stock.balanced_qty !== null && stock.balanced_qty !== undefined ? stock.balanced_qty : "-",
//           })) || [],

//         };
//       });
//       setData(transformedData)
//       setFilteredData(transformedData);
//       setPagination(response.data?.pagination || {});
//       setShow(false); // Close modal after filter
//     } catch (error) {
//       toast.error("Failed to fetch filtered data");
//       console.error("Filter API error:", error);
//     } finally {
//       setLoading(false);
//     }

//   };


   const handleFilterReset = () => {

    //  setSelectedInventory2(null)
// setInventoryTypes2([])
    // setSelectedSubType2(null); // Clear the selected sub-type when inventory type changes
    // setInventorySubTypes2([]); // Reset the sub-types list
    // setInventoryMaterialTypes2([]); // Reset the material types list
    // setSelectedInventoryMaterialTypes2(null); // Clear selected material type
    // setGenericSpecifications([])
    // setSelectedGenericSpecifications(null)
    // setColors([])
    // setSelectedColors(null)
    // setInventoryBrands([])
    // setSelectedInventoryBrands(null)
    // setSelectedUnit(null)
    // setUnitOfMeasures([])
    // setSelectedCategory(null);
    // setSelectedSubCategory(null);
    // setSelectedStatus(null);
    // setSelectedUnit(null);
    // setSelectedInventory(null)
    // setSelectedInventoryMaterialTypes(null)
    // Optionally, reset other states like `searchKeyword` if needed
    // console.log("Filters reset");

    setFormData({
       materialType: "",
    materialSubType: "",
    material: "",
    genericSpecification: "",
    colour: "",
    brand: "",
    effectiveDate: "",
    rate: "",
    rateType: "",
    poRate: "",
    avgRate: "",
    uom: "",
    })
  };


  if (loading) return <div>Loading...</div>;
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
      {/* {console.log("columnVisibility", columnVisibility, allColumns)} */}
      <div className="website-content overflow-auto">
        <div className="module-data-section px-3">
          <p>Home &gt; Store &gt; Store Operations &gt; Stock Register</p>
          <h5 className="mt-2">Stock Register</h5>

          <div className="card mt-3 pb-4">
            <CollapsibleCard title="Quick Filter" isInitiallyCollapsed={true}>
              <div className="row my-2 align-items-end">
                <div className="col-md-2">
                  <div className="form-group">
                    <label>
                      Company <span>*</span>
                    </label>
                    <SingleSelector
                      options={companies?.map((c) => ({
                        value: c.id,
                        label: c.company_name,
                      }))}
                      onChange={(option) => handleCompanyChange(option.value)}
                      value={
                        companies.find((c) => c.id === selectedCompany)
                          ? {
                            value: selectedCompany,
                            label: companies.find(
                              (c) => c.id === selectedCompany
                            ).company_name,
                          }
                          : null
                      }
                      placeholder="Select Company"
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>
                      Project <span>*</span>
                    </label>
                    <SingleSelector
                      options={projects}
                      onChange={(option) => handleProjectChange(option.value)}
                      value={
                        projects.find((p) => p.value === selectedProject) ||
                        null
                      }
                      placeholder="Select Project"
                    // isDisabled={!selectedCompany}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>Sub-project <span>*</span></label>
                    <SingleSelector
                      options={subProjects}
                      onChange={(option) =>
                        handleSubProjectChange(option.value)
                      }
                      value={
                        subProjects.find(
                          (s) => s.value === selectedSubProject
                        ) || null
                      }
                      placeholder="Select Sub-project"
                    // isDisabled={!selectedProject}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>Store <span>*</span></label>
                    <SingleSelector
                      options={storeOptions}
                      onChange={setSelectedStore}
                      value={selectedStore}
                      placeholder="Select Store"
                    // isDisabled={!selectedSubProject}
                    />
                    {console.log("store options:", storeOptions)}
                  </div>
                </div>
                <div className="col-md-2">
                  <button className="purple-btn2 me-2" onClick={handleGoClick}>
                    Go
                  </button>
                  <button className="purple-btn1 m-0" onClick={handleResets}>
                    Reset
                  </button>
                </div>
              </div>
            </CollapsibleCard>
            <div className="d-flex mt-3 align-items-end px-3">
              <div className="col-md-6">
                <form>
                  <div className="input-group">
                    <input
                      type="search"
                      id="searchInput"
                      className="form-control tbl-search"
                      placeholder="Type your keywords here"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="input-group-append">
                      <button type="button" className="btn btn-md btn-default">
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
              <div className="col-md-6">
                <div className="row justify-content-end">
                  <div className="col-md-5">
                    <div className="row justify-content-end px-3">
                      <div className="col-md-3">
                        <button
                          className="btn btn-md"
                          onClick={handleModalShow}
                        >
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
                      </div>
                      {/* <div className="col-md-3">
                        <button
                          type="submit"
                          className="btn btn-md"
                          onClick={toggleShowOnlyPinned}
                        >
                          {showOnlyPinned ? (
                            <svg
                              class="star-icon pinned-star"
                              data-id="259"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              width="27"
                              height="27"
                              fill="#8B0203"
                              stroke="#8B0203"
                            >
                              <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z"></path>
                            </svg>
                          ) : (
                            <svg
                              class="star-icon"
                              data-id="260"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              width="27"
                              height="27"
                              fill="#cccccc"
                              stroke="#cccccc"
                            >
                              <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z"></path>
                            </svg>
                          )}
                        </button>
                      </div> */}
                      <div className="col-md-3">
                        <button
                          onClick={downloadExcel}
                          id="downloadButton"
                          type="submit"
                          className="btn btn-md"
                        >
                          <svg
                            width={22}
                            height={23}
                            viewBox="0 0 22 23"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20.8468 22.9744H1.1545C0.662189 22.9744 0.333984 22.6462 0.333984 22.1538V15.5897C0.333984 15.0974 0.662189 14.7692 1.1545 14.7692C1.6468 14.7692 1.97501 15.0974 1.97501 15.5897V21.3333H20.0263V15.5897C20.0263 15.0974 20.3545 14.7692 20.8468 14.7692C21.3391 14.7692 21.6673 15.0974 21.6673 15.5897V22.1538C21.6673 22.6462 21.3391 22.9744 20.8468 22.9744ZM11.0007 18.0513C10.9186 18.0513 10.7545 18.0513 10.6724 17.9692C10.5904 17.9692 10.5083 17.8872 10.4263 17.8051L3.86219 11.241C3.53398 10.9128 3.53398 10.4205 3.86219 10.0923C4.19039 9.7641 4.6827 9.7641 5.01091 10.0923L10.1801 15.2615V0.820513C10.1801 0.328205 10.5083 0 11.0007 0C11.493 0 11.8212 0.328205 11.8212 0.820513V15.2615L16.9904 10.0923C17.3186 9.7641 17.8109 9.7641 18.1391 10.0923C18.4673 10.4205 18.4673 10.9128 18.1391 11.241L11.575 17.8051C11.493 17.8872 11.4109 17.9692 11.3289 17.9692C11.2468 18.0513 11.0827 18.0513 11.0007 18.0513Z"
                              fill="#8B0203"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="col-md-3">
                        <button
                          type="submit"
                          className="btn btn-md"
                          onClick={handleSettingModalShow}
                        >
                          <svg
                            width={22}
                            height={24}
                            viewBox="0 0 22 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M10.9985 7.45532C8.64565 7.45532 6.73828 9.36269 6.73828 11.7155C6.73828 14.0684 8.64565 15.9757 10.9985 15.9757C13.3514 15.9757 15.2587 14.0684 15.2587 11.7155C15.2587 9.36269 13.3514 7.45532 10.9985 7.45532ZM8.86838 11.7155C8.86838 10.5391 9.82208 9.58544 10.9985 9.58544C12.1749 9.58544 13.1286 10.5391 13.1286 11.7155C13.1286 12.892 12.1749 13.8457 10.9985 13.8457C9.82208 13.8457 8.86838 12.892 8.86838 11.7155Z"
                              fill="#8B0203"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M14.3416 2.97635C13.8887 -0.992103 8.10872 -0.992127 7.65577 2.97635L7.56116 3.80528C7.46818 4.61997 6.60664 5.12268 5.84081 4.79072L5.07295 4.45788C1.43655 2.88166 -1.52087 7.83752 1.73283 10.2351L2.40609 10.7312C3.07122 11.2213 3.07122 12.2099 2.40609 12.7L1.73283 13.1961C-1.52085 15.5936 1.43653 20.5496 5.07295 18.9733L5.84081 18.6405C6.60664 18.3085 7.46818 18.8113 7.56116 19.6259L7.65577 20.4549C8.10872 24.4233 13.8887 24.4233 14.3416 20.4549L14.4362 19.6259C14.5292 18.8113 15.3908 18.3085 16.1565 18.6405L16.9244 18.9733C20.5609 20.5495 23.5183 15.5936 20.2645 13.1961L19.5913 12.7C18.9262 12.2099 18.9262 11.2213 19.5913 10.7312L20.2645 10.2351C23.5183 7.83753 20.5609 2.88164 16.9244 4.45788L16.1566 4.79072C15.3908 5.12268 14.5292 4.61997 14.4362 3.8053L14.3416 2.97635ZM9.77214 3.2179C9.93768 1.76752 12.0597 1.7675 12.2252 3.2179L12.3198 4.04684C12.5762 6.29253 14.9347 7.64199 17.0037 6.74512L17.7716 6.41228C19.1548 5.81273 20.1484 7.67469 19.001 8.52023L18.3278 9.01632C16.5072 10.3578 16.5072 13.0734 18.3278 14.4149L19.001 14.911C20.1484 15.7566 19.1548 17.6185 17.7716 17.019L17.0037 16.686C14.9347 15.7891 12.5762 17.1386 12.3198 19.3843L12.2252 20.2133C12.0597 21.6636 9.93768 21.6638 9.77214 20.2133L9.67753 19.3843C9.42121 17.1386 7.06273 15.7891 4.99366 16.686L4.22578 17.019C2.84258 17.6185 1.84896 15.7566 2.99644 14.911L3.66969 14.4149C5.49017 13.0734 5.49015 10.3578 3.66969 9.01632L2.99642 8.52021C1.84898 7.67471 2.84256 5.81271 4.2258 6.4123L4.99366 6.74512C7.06273 7.64199 9.42121 6.29253 9.67753 4.04684L9.77214 3.2179Z"
                              fill="#8B0203"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4"></div>
                </div>
              </div>
            </div>

            <div
              className="tbl-container  px-1 mt-3"
              style={{
                width: "max-congent",
                height: "300px !important",
                boxShadow: "unset",
              }}
            >
              {getTransformedRows().length > 0 ? (
                <DataGrid
                  rows={getTransformedRows()}
                  columns={allColumns}
                  columnVisibilityModel={columnVisibility}
                  onColumnVisibilityModelChange={setColumnVisibility}
                  pageSize={pageSize}
                  getRowId={(row) => row.id}
                  sx={{
                    flexGrow: 1,
                    width: "100%",
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
                      overflowY: "auto",
                    },
                    // You can add more custom styles here if needed
                  }}
                  components={{
                    NoRowsOverlay: () => (
                      <div style={{ padding: "2rem", textAlign: "center" }}>
                        No records found.
                      </div>
                    ),
                  }}
                />
              ) : (
                <div className="text-center mt-5">
                  <p>No records found for the selected filters.</p>
                </div>
              )}
            </div>
            <div className="d-flex justify-content-between align-items-center px-3 mt-2">
              <ul className="pagination justify-content-center d-flex">
                {/* First Button */}
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(1)}
                  >
                    First
                  </button>
                </li>
                {/* Previous Button */}
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                </li>
                {/* Dynamic Page Numbers */}
                {pageNumbers.map((pageNumber) => (
                  <li
                    key={pageNumber}
                    className={`page-item ${currentPage === pageNumber ? "active" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  </li>
                ))}
                {/* Next Button */}
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
                {/* Last Button */}
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
              {/* Showing entries count */}
              <div>
                <p>
                  Showing{" "}
                  {Math.min(
                    (currentPage - 1) * pageSize + 1,
                    pagination?.total_count || 0
                  )}{" "}
                  to{" "}
                  {Math.min(
                    currentPage * pageSize,
                    pagination?.total_count || 0
                  )}{" "}
                  of {pagination?.total_count || 0} entries
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                onClick={handleFilterReset}
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
                options={inventoryTypes2}  // Provide the fetched options to the select component
                value={inventoryTypes2.find((option) => option.value === formData.materialType)} // Bind value to state
                placeholder={`Select Material Type`} // Dynamic placeholder
                onChange={(selectedOption) => handleSelectorChange("materialType", selectedOption)}
              />
            </div>

            <div className="col-6 mt-2">
              <label className="block text-sm font-medium">
                Material Sub Type
              </label>
              <SingleSelector
                options={inventorySubTypes2}
                value={inventorySubTypes2.find((option) => option.value === formData.materialSubType)} // Bind value to state
                placeholder={`Select Material Sub Type`} // Dynamic placeholder
                onChange={(selectedOption) => handleSelectorChange("materialSubType", selectedOption)}
              />

            </div>

            <div className="col-md-6 mt-2">
              <div className="form-group">
                <label className="po-fontBold">Material</label>
                <SingleSelector
                  options={inventoryMaterialTypes2}
                  value={inventoryMaterialTypes2.find((option) => option.value === formData.material)} // Bind value to state
                  placeholder={`Select Material`} // Dynamic placeholder
                  onChange={(selectedOption) => handleSelectorChange("material", selectedOption)}
                />

              </div>
            </div>

            <div className="col-6 mt-2">
              <label className="block text-sm font-medium">Generic Info</label>
              <SingleSelector
                options={Array.isArray(genericSpecifications) ? genericSpecifications : []}
                value={genericSpecifications.find((option) => option.value === formData.genericSpecification)} // Bind value to state
                placeholder={`Select Specification`} // Dynamic placeholder
                onChange={(selectedOption) => handleSelectorChange("genericSpecification", selectedOption)}
              />
            </div>

            <div className="col-md-6 mt-2">
              <div className="form-group">
                <label className="po-fontBold">Colour</label>
                <SingleSelector
                  options={colors || []}
                  value={colors.find((option) => option.value === formData.colour)} // Bind value to stat
                  placeholder={`Select Colour`} // Dynamic placeholder
                  onChange={(selectedOption) => handleSelectorChange("colour", selectedOption)}
                />
              </div>
            </div>
            <div className="col-md-6 mt-2">
              <div className="form-group">
                <label className="po-fontBold">Brand</label>
                <SingleSelector
                  options={inventoryBrands || []}
                  value={inventoryBrands.find((option) => option.value === formData.brand)} // Bind value to state
                  placeholder={`Select Brand`} // Dynamic placeholder
                  onChange={(selectedOption) => handleSelectorChange("brand", selectedOption)}
                />
              </div>
            </div>

            <div className="col-6 mt-2 mb-5">
              <label className="block text-sm font-medium">
                Unit of Measures
              </label>
              <SingleSelector
                options={unitOfMeasures}
                value={unitOfMeasures.find((option) => option.value === formData.uom)} // Bind value to state
                placeholder={`Select UOM`} // Dynamic placeholder
                onChange={(selectedOption) => handleSelectorChange("uom", selectedOption)}
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
            onClick={handleFilterGo}
          >
            Go
          </button>
        </div>
      </Modal>

      <Modal
        show={settingShow}
        onHide={settingShow}
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
              <Modal.Title>Layout</Modal.Title>
              <Button
                style={{ textDecoration: "underline" }}
                variant="alert"
                onClick={handleReset}
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
            .map((column, index) => (
              <div
                className="row justify-content-between align-items-center mt-2"
                key={column.field} // Use column.field as the key
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
                      id={`flexSwitchCheckDefault-${column.field}`} // Unique ID for each input
                    />
                  </div>
                </div>
              </div>
            ))}
        </Modal.Body>
      </Modal>
      <ToastContainer position="top-right" autoClose={3000} />

    </>
  );
};

export default ErpStockRegister13B;
