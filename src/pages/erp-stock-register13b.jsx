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
import axios from "axios";
import SingleSelector from "../components/base/Select/SingleSelector"; // Adjust path as needed

import { baseURL, baseURL1 } from "../confi/apiDomain";
import MultiSelector from "../components/base/Select/MultiSelector";

const ErpStockRegister13B = () => {
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

  const [columnVisibility, setColumnVisibility] = useState({
    srNo: true,
    material: true,
    material_name: true,
    material_type: true,
    materialSubType: true,
    materialDescription: true,
    specification: true,
    lastReceived: true,
    total_received: true,
    total_issued: true,
    stock_as_on: true,
    stockStatus: true,
    deadstockQty: true,
    theftMissing: true,
    uom_name: true,
    Star: true,
    mor: true, // Added Mor Number column
    grn_number: true, //
  });

  const location = useLocation();

  const handleSettingClose = () => setSettingShow(false);
  const handleClose = () => setShow(false);
  const handleSettingModalShow = () => setSettingShow(true);
  const handleModalShow = () => setShow(true);

  // Calculate displayed rows for the current page
  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, filteredData.length);

  const allColumns = [
    { field: "srNo", headerName: "Sr. No.", width: 100 },
    {
      field: "Star",
      headerName: "Star",
      width: 90,
      renderCell: (params) => (
        <button
          className="btn btn-sm"
          onClick={() => handlePinRow(params.row.id)}
        >
          {pinnedRows.includes(params.row.id) ? (
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
      ),
    },

    { field: "material", headerName: "Material / Asset", width: 200 },

    {
      field: "material_name",
      headerName: "Material",
      width: 300,
      renderCell: (params) => (
        <a href={params.row.materialUrl} rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },

    { field: "mor", headerName: "MOR Number", width: 150 }, // Added Mor Number column
    { field: "grn_number", headerName: "GRN Number", width: 150 }, // Added Grn Number column

    { field: "lastReceived", headerName: "Last Received On", width: 200 },

    { field: "total_received", headerName: "Total Received", width: 150 },

    { field: "total_issued", headerName: "Total Issued", width: 150 },

    { field: "stock_as_on", headerName: "Stock As On", width: 150 },

    { field: "deadstockQty", headerName: "Deadstock Qty", width: 150 },

    { field: "theftMissing", headerName: "Theft / Missing", width: 150 },

    { field: "uom_name", headerName: "UOM", width: 100 },
  ];

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1); // MUI Pagination starts at 1, DataGrid at 0
  };

  const columns = allColumns.filter((col) => columnVisibility[col.field]);

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
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get("token");

        const response = await fetch(
          `${baseURL}/mor_inventories/stock_data.json?token=${token}&search=${encodeURIComponent(
            searchTerm
          )}&q[company_id]=${selectedCompany}&q[project_id]=${selectedProject}&q[sub_project_id]=${selectedSubProject}&q[generic_info_id]=${selectedIds.genericInfos
          }&q[material_type_id]=${selectedIds.materialTypes
          }&q[material_sub_type_id]=${selectedIds.materialSubTypes
          }&q[brand_id]=&q[uom_id]=${selectedIds.unitOfMeasures
          }&q[mor_number]=${selectedIds.morNumbers}&q[grn_number]=${selectedIds.grnNumbers
          }&page=${page}&per_page=${pageSize}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        const transformedData = result?.mor_inventories.map((item, index) => {
          const materialUrl =
            item.id && token
              ? `/stock_register_detail/${item.id}/?token=${token}`
              : "#";

          return {
            id: item.id ?? `row-${index + 1}`,
            srNo: index + 1,
            material: item.category || "-",
            materialUrl: materialUrl,
            material_name: item.material_name || "-",
            lastReceived: item.last_received_on || "-",
            total_received: item.total_received || "-",
            total_issued: item.total_issued || "-",
            deadstockQty: item.deadstockQty || "-",
            stock_as_on: item.stock_as_on || "-",
            stockStatus: item.stock_details?.[0]?.status || "-",
            theftMissing:
              item.theftMissing !== undefined ? item.theftMissing : "-",
            uom_name: item.uom_name || "-",
            mor:
              item.stock_details?.map((stock) => stock.mor).join(", ") || "-",
            grn_number:
              item.stock_details?.map((stock) => stock.grn_number).join(", ") ||
              "-",
            stock_details:
              item?.stock_details?.map((stock) => ({
                stockId: stock.id,
                createdAt: stock.created_at || "-",
                mor: stock.mor || "-",
                resourceNumber: stock.resource_number || "-",
                receivedQty: stock.received_qty || "-",
                issuedQty: stock.issued_qty || "-",
                returnedQty: stock.returned_qty || "-",
              })) || [],
          };
        });

        setData(transformedData);
        setFilteredData(transformedData);
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
  };

  const getTransformedRows = () => {
    let rowsToShow = showOnlyPinned
      ? data.filter((row) => pinnedRows.includes(row.id))
      : data;

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

    return rowsToShow.map((row, index) => ({
      ...row,
      id: row.id || `row-${index}`, // Ensure unique `id`
      srNo: index + 1,
    }));
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

  // Handle Project Selection
  const handleProjectChange = (projectId) => {
    setSelectedProject(projectId);
    setSelectedSubProject(null);
    setSubProjects([]);

    if (projectId) {
      const company = companies.find((c) => c.id === selectedCompany); // Use selectedCompany directly
      const project = company?.projects.find((p) => p.id === projectId);

      setSubProjects(
        project?.pms_sites.map((s) => ({ value: s.id, label: s.name })) || []
      );
    }
  };

  // Handle Subproject Selection
  const handleSubProjectChange = (option) => {
    setSelectedSubProject(option);
  };

  const [genericInfos, setGenericInfos] = useState([]);
  const [materialSubTypes, setMaterialSubTypes] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [unitOfMeasures, setUnitOfMeasures] = useState([]);

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

  if (loading) return <div>Loading...</div>;
  return (
    <>
      <style type="text/css">
        {`

.tbl-container {

height: 300px !important;

}



`}
      </style>
      <div className="website-content overflow-auto">
        <div className="module-data-section px-3">
          <p>Home &gt; Store &gt; Store Operations &gt; Stock Register</p>
          <h5 className="mt-2">Stock Register</h5>

          <div className="card mt-3 pb-4">
            <div className="card mx-3 mt-3">
              <div className="card-header3">
                <h3 className="card-title">Quick Filter</h3>
                <div className="card-tools">
                  <button
                    type="button"
                    className="btn btn-tool"
                    onClick={toggleCardBody}
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
                        <label>
                          Company <span>*</span>
                        </label>
                        <SingleSelector
                          options={companies.map((c) => ({
                            value: c.id,
                            label: c.company_name,
                          }))}
                          onChange={(option) =>
                            handleCompanyChange(option.value)
                          } // Pass only the ID
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
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Project <span>*</span>
                        </label>
                        <SingleSelector
                          options={projects}
                          onChange={(option) =>
                            handleProjectChange(option.value)
                          } // Pass only the ID
                          value={
                            projects.find((p) => p.value === selectedProject) ||
                            null
                          } // Ensure correct value format
                          placeholder="Select Project"
                          isDisabled={!selectedCompany}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Sub-project</label>
                        <SingleSelector
                          options={subProjects}
                          onChange={(option) =>
                            handleSubProjectChange(option.value)
                          } // Pass only the ID
                          value={
                            subProjects.find(
                              (s) => s.value === selectedSubProject
                            ) || null
                          } // Ensure correct value format
                          placeholder="Select Sub-project"
                          isDisabled={!selectedProject}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <button
                        className="purple-btn2 m-0"
                        onClick={handleResets}
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
                      <div className="col-md-3">
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
                      </div>
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
              <DataGrid
                rows={getTransformedRows()}
                columns={columns}
                pageSize={pageSize}
                autoHeight={false} // IMPORTANT: disable autoHeight for scroll
                getRowId={(row) => row.id}
              />

            </div>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              padding={2}
            >
              <Pagination
                count={pagination.total_pages || 1} // Use API's total pages
                page={page}
                onChange={(event, value) => setPage(value)} // Update page state
                siblingCount={1}
                boundaryCount={1}
                color="primary"
                showFirstButton
                showLastButton
                disabled={pagination.total_pages <= 1} // Disable if only one page
              />

              {/* Dynamic Entries Info */}
              <Typography variant="body2">
                Showing {startEntry} to {endEntry} of {pagination.total_count}{" "}
                entries
              </Typography>
            </Stack>
          </div>
        </div>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
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
              <Link
                className="resetCSS"
                style={{ fontSize: "14px", textDecoration: "underline" }}
                to="#"
              >
                Reset
              </Link>
            </div>
          </div>
        </Modal.Header>
        <div className="modal-body" style={{ overflowY: scroll }}>
          <div className="row justify-content-between align-items-center mt-2">
            <div className="col-6 mt-2">
              <label className="block text-sm font-medium">Material Type</label>
              <MultiSelector
                options={formatOptions(materialTypes)}
                isMulti
                value={getSelectedOptions(
                  "materialTypes",
                  formatOptions(materialTypes)
                )} // Show selected options
                onChange={(selected) => handleChange("materialTypes", selected)}
              />
            </div>

            <div className="col-6 mt-2">
              <label className="block text-sm font-medium">
                Material Sub Type
              </label>
              <MultiSelector
                options={formatOptions(materialSubTypes)}
                isMulti
                value={getSelectedOptions(
                  "materialSubTypes",
                  formatOptions(materialSubTypes)
                )}
                onChange={(selected) =>
                  handleChange("materialSubTypes", selected)
                }
              />
            </div>

            <div className="col-6 mt-2">
              <label className="block text-sm font-medium">Generic Info</label>
              <MultiSelector
                options={formatOptions(genericInfos)}
                isMulti
                value={getSelectedOptions(
                  "genericInfos",
                  formatOptions(genericInfos)
                )}
                onChange={(selected) => handleChange("genericInfos", selected)}
              />
            </div>

            <div className="col-6 mt-2">
              <label className="block text-sm font-medium">
                Unit of Measures
              </label>
              <MultiSelector
                options={formatOptions(unitOfMeasures)}
                isMulti
                value={getSelectedOptions(
                  "unitOfMeasures",
                  formatOptions(unitOfMeasures)
                )}
                onChange={(selected) =>
                  handleChange("unitOfMeasures", selected)
                }
              />
            </div>

            <div className="col-6 mt-2">
              <label className="block text-sm font-medium">MOR Numbers</label>
              <MultiSelector
                options={morOptions}
                isMulti
                value={getSelectedOptions("morNumbers", morOptions)}
                onChange={(selected) => handleChange("morNumbers", selected)}
                placeholder="Select MOR Numbers"
              />
            </div>

            <div className="col-6 mt-2">
              <label className="block text-sm font-medium">GRN Numbers</label>
              <MultiSelector
                options={grnOptions}
                isMulti
                value={getSelectedOptions("grnNumbers", grnOptions)}
                onChange={(selected) => handleChange("grnNumbers", selected)}
                placeholder="Select GRN Numbers"
              />
            </div>
          </div>
        </div>

        <div className="modal-footer justify-content-center">
          <button
            className="btn"
            style={{ backgroundColor: "#8b0203", color: "#fff" }}
            onClick={handleClose}
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
                      id={`flexSwitchCheckDefault-${column.field}`} // Unique ID for each input
                    />
                  </div>
                </div>
              </div>
            ))}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleShowAll}>
            Show All
          </Button>

          <Button variant="danger" onClick={handleHideAll}>
            Hide All
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};



export default ErpStockRegister13B;
