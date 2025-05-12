import React, { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import SingleSelector from "../components/base/Select/SingleSelector";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import MultiSelector from "../components/base/Select/MultiSelector";
import { useNavigate } from "react-router-dom";

const BillBookingCreate = () => {
  const [actionDetails, setactionDetails] = useState(false);
  const [selectPOModal, setselectPOModal] = useState(false);
  const [selectGRNModal, setselectGRNModal] = useState(false);
  const [attachOneModal, setattachOneModal] = useState(false);
  const [attachTwoModal, setattachTwoModal] = useState(false);
  const [attachThreeModal, setattachThreeModal] = useState(false);
  const navigate = useNavigate();
  const [creditNoteAmount, setCreditNoteAmount] = useState(null);

  const [rows, setRows] = useState([
    {
      id: 1,
      type: "Handling Charges",
      percentage: "",
      inclusive: false,
      amount: "",
      isEditable: false,
      addition: true,
    },
    {
      id: 2,
      type: "Other charges",
      percentage: "",
      inclusive: false,
      amount: "",
      isEditable: false,
      addition: true,
    },
    {
      id: 3,
      type: "Freight",
      percentage: "",
      inclusive: false,
      amount: "",
      isEditable: false,
      addition: true,
    },
    {
      id: 4,
      type: "IGST",
      percentage: "",
      inclusive: false,
      amount: "",
      isEditable: true,
      addition: true,
    },
  ]);
  const [taxTypes, setTaxTypes] = useState([]); // State to store tax types

  // Fetch tax types from API
  useEffect(() => {
    const fetchTaxTypes = async () => {
      try {
        const response = await axios.get(
          "https://marathon.lockated.com/rfq/events/taxes_dropdown?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        );
        setTaxTypes(response.data.taxes); // Assuming the API returns an array of tax types
      } catch (error) {
        console.error("Error fetching tax types:", error);
      }
    };

    fetchTaxTypes();
  }, []);
  // console.log("tax types:", taxTypes)
  const addRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: prevRows.length + 1,
        type: "",
        percentage: "0",
        inclusive: false,
        amount: "",
        isEditable: true,
        addition: true,
      },
    ]);
  };
  // Function to calculate the subtotal of addition rows
  const calculateSubTotal = () => {
    return rows
      .reduce((total, row) => total + (parseFloat(row.amount) || 0), 0)
      .toFixed(2);
  };

  // Delete a row
  const deleteRow = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  // deduction
  const [deductionRows, setDeductionRows] = useState([
    // { id: 1, type: "", charges: "", inclusive: false, amount: 0.0 },
  ]);
  // const addDeductionRow = () => {
  //   setDeductionRows((prevRows) => [
  //     ...prevRows,
  //     { id: prevRows.length + 1, type: "", charges: "", inclusive: false, amount: 0.0 },
  //   ]);
  // };

  const [deductionTypes, setDeductionTypes] = useState([]); // State to store tax types

  // Fetch tax types from API
  useEffect(() => {
    const fetchTaxTypes = async () => {
      try {
        const response = await axios.get(
          `https://marathon.lockated.com/rfq/events/deduction_tax_details?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        setDeductionTypes(response.data.taxes); // Assuming the API returns an array of tax types
      } catch (error) {
        console.error("Error fetching tax types:", error);
      }
    };

    fetchTaxTypes();
  }, []);

  const addDeductionRow = () => {
    if (deductionRows.length === 0) {
      setDeductionRows([
        {
          id: 1,
          type: "",
          percentage: "",
          inclusive: false,
          amount: "",
          addition: false,
        },
      ]);
    }
  };
  // Function to calculate the subtotal of deduction rows
  const calculateDeductionSubTotal = () => {
    return deductionRows
      .reduce((total, row) => total + (parseFloat(row.amount) || 0), 0)
      .toFixed(2);
  };
  // Function to calculate the payable amount
  const calculatePayableAmount = () => {
    const grossAmount =
      parseFloat(selectedGRN?.base_cost || 0) + parseFloat(calculateSubTotal());
    const deductionSubTotal = parseFloat(calculateDeductionSubTotal()) || 0;
    return (grossAmount - deductionSubTotal).toFixed(2);
  };

  const deleteDeductionRow = (id) => {
    setDeductionRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  // Add new state for taxes
  const [taxes, setTaxes] = useState([]);
  const [selectedTax, setSelectedTax] = useState(null);
  const [taxDeductionData, setTaxDeductionData] = useState({
    total_material_cost: 0,
    deduction_mor_inventory_tax_amount: 0,
    total_deduction_cost: 0,
  });

  const [taxDetailsData, setTaxDetailsData] = useState({
    tax_data: {},
  });

  // Add useEffect to fetch taxes
  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/deduction_tax_details.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        console.log("Taxes response:", response.data);
        if (response.data && response.data.taxes) {
          setTaxes(response.data.taxes);
        }
      } catch (error) {
        console.error("Error fetching taxes:", error);
        setTaxes([]);
      }
    };

    fetchTaxes();
  }, []);

  // Convert taxes to options format with null check
  const taxOptions =
    taxes && Array.isArray(taxes) && taxes.length > 0
      ? taxes.map((tax) => ({
          value: tax.id,
          label: tax.name,
        }))
      : [];

  console.log("Tax options:", taxOptions); // Add this for debugging

  // action dropdown
  const actionDropdown = () => {
    setactionDetails(!actionDetails);
  };
  //   modal
  const openSelectPOModal = () => {
    setselectPOModal(true);
    // Fetch all POs without company filter
    fetchPurchaseOrders();
  };
  // const closeSelectPOModal = () => setselectPOModal(false);

  const openSelectGRNModal = () => setselectGRNModal(true);
  const closeSelectGRNModal = () => setselectGRNModal(false);

  const openAttachOneModal = () => setattachOneModal(true);
  const closeAttachOneModal = () => setattachOneModal(false);

  const openAttachTwoModal = () => setattachTwoModal(true);
  const closeAttachTwoModal = () => setattachTwoModal(false);

  const openAttachThreeModal = () => setattachThreeModal(true);
  const closeAttachThreeModal = () => setattachThreeModal(false);

  const [charges, setCharges] = useState([
    { id: 1, type: "SGCT", amount: 270, inclusive: false },
    { id: 2, type: "CGST", amount: 270, inclusive: false },
  ]);

  const [deductions, setDeductions] = useState([
    { id: 1, type: "TDS", amount: 30 },
  ]);

  // Function to add a new charge row
  const addCharge = () => {
    setCharges([
      ...charges,
      { id: Date.now(), type: "", amount: 0, inclusive: false },
    ]);
  };

  // Function to remove a charge row
  const removeCharge = (id) => {
    setCharges(charges.filter((charge) => charge.id !== id));
  };

  // Function to add a new deduction row
  const addDeduction = () => {
    setDeductions([...deductions, { id: Date.now(), type: "", amount: 0 }]);
  };

  // Function to remove a deduction row
  const removeDeduction = (id) => {
    setDeductions(deductions.filter((deduction) => deduction.id !== id));
  };

  // const [rows, setRows] = useState([
  //   { id: 1, type: "TDS 1", charges: "100", inclusive: false, amount: 50.0 },
  // ]);
  const [showRows, setShowRows] = useState(true);

  // Add New Row
  const handleAddRow = () => {
    setRows((prevRows) => [...prevRows, newRow]);
  };

  // Delete Row
  const handleDeleteRow = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  // Toggle Rows
  const toggleRows = () => {
    setShowRows((prev) => !prev);
  };

  const closeSelectPOModal = () => {
    console.log("Close button clicked");
    setselectPOModal(false);
  };

  // Add new state variables for API data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);
  const [selectedGRN, setSelectedGRN] = useState(null);
  const [selectedGRNs, setSelectedGRNs] = useState([]);
  const [formData, setFormData] = useState({
    poNumber: "",
    poDate: "",
    poValue: "",
    gstin: "",
    pan: "",
    invoiceNumber: "",
    invoiceDate: "",
    invoiceAmount: "",
    baseCost: "",
    netTaxes: "",
    netCharges: "",
    allInclusiveCost: "",
    charges: [],
    deductions: [],
    typeOfCertificate: "",
    departmentId: "",
    otherDeductions: "",
    otherDeductionRemarks: "",
    otherAdditions: "",
    otherAdditionRemarks: "",
    retentionPercentage: "",
    retentionAmount: "",
    remark: "",
    payeeName: "",
    paymentMode: "",
    paymentDueDate: "",
    attachments: [],
    currentAdvanceDeduction: "",
    status: "draft",
  });

  const [filterParams, setFilterParams] = useState({
    startDate: "",
    endDate: "",
    poType: "",
    poNumber: "",
    selectedPOIds: [], // Ensure this is initialized as an empty array
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    next_page: 2,
    prev_page: null,
    total_pages: 10,
    total_count: 46,
  });

  const [pageSize, setPageSize] = useState(10); // Set default page size to 10

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));

    // Fetch data for the new page with current filters
    fetchPurchaseOrders(
      selectedCompany?.value,
      selectedProject?.value,
      selectedSite?.value,
      {
        ...filterParams,
        page: page,
        pageSize: 10,
      }
    );
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

  const fetchPurchaseOrders = async (
    companyId,
    projectId,
    siteId,
    filters = {
      startDate: "",
      endDate: "",
      poType: "",
      poNumber: "",
      selectedPOIds: [],
      supplierId: "",
      page: 1,
      pageSize: 10,
    }
  ) => {
    try {
      setLoading(true);
      let url = `${baseURL}purchase_orders/grn_details.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;

      // Add company filter only if company is selected
      if (companyId) {
        url += `&q[company_id_eq]=${companyId}`;
      }

      // Only add project and site filters if they are provided
      if (projectId) url += `&q[po_mor_inventories_project_id_eq]=${projectId}`;
      if (siteId) url += `&q[po_mor_inventories_pms_site_id_eq]=${siteId}`;

      // Add other filters if they are provided
      if (filters?.supplierId)
        url += `&q[supplier_id_eq]=${filters.supplierId}`;
      if (filters?.startDate) url += `&q[po_date_gteq]=${filters.startDate}`;
      if (filters?.endDate) url += `&q[po_date_lteq]=${filters.endDate}`;
      if (filters?.poType) url += `&q[po_type_eq]=${filters.poType}`;

      // Only add selectedPOIds filter if we're not changing pages
      if (filters?.selectedPOIds?.length > 0 && !filters.page) {
        url += `&q[id_in]=${filters.selectedPOIds.join(",")}`;
      }

      // Always add pagination parameters
      url += `&page=${filters.page || 1}`;
      url += `&per_page=10`;

      const response = await axios.get(url);
      setPurchaseOrders(response.data.purchase_orders);

      // Update pagination state with server response
      if (response.data.pagination) {
        setPagination({
          current_page: response.data.pagination.current_page,
          next_page: response.data.pagination.next_page,
          prev_page: response.data.pagination.prev_page,
          total_pages: response.data.pagination.total_pages,
          total_count: response.data.pagination.total_count,
        });
      }
    } catch (err) {
      setError("Failed to fetch purchase orders");
      console.error("Error fetching purchase orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (!selectedCompany) {
      alert("Please select a company first");
      return;
    }

    // Reset to first page when applying filters
    setPagination((prev) => ({
      ...prev,
      current_page: 1,
    }));

    fetchPurchaseOrders(
      selectedCompany.value,
      selectedProject?.value, // Pass project only on search
      selectedSite?.value, // Pass site only on search
      {
        startDate: filterParams.startDate,
        endDate: filterParams.endDate,
        poType: filterParams.poType,
        selectedPOIds: filterParams.selectedPOIds,
        supplierId: selectedSupplier?.value || "",
        page: 1,
        pageSize: 10,
      }
    );
  };

  // Handle reset button click
  const handleReset = () => {
    setFilterParams({
      startDate: "",
      endDate: "",
      poType: "",
      poNumber: "",
      selectedPOIds: [],
    });

    // Reset selections
    setSelectedPO(null);
    setSelectedSupplier(null);

    // Fetch all POs for the selected company
    if (selectedCompany) {
      fetchPurchaseOrders(
        selectedCompany.value,
        selectedProject?.value,
        selectedSite?.value
      );
    }
  };

  // Fetch purchase orders on component mount
  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  // Handle PO selection
  const handlePOSelect = (po) => {
    setSelectedPO(po);
    setFilterParams((prev) => ({
      ...prev,
      selectedPOIds: [po.id],
    }));
    setFormData((prev) => ({
      ...prev,
      poNumber: po.po_number,
      poDate: po.po_date,
      poValue: po.total_value,
      gstin: po.gstin,
      pan: po.pan,
    }));

    // Reset GRN-related state when a different PO is selected
    setSelectedGRN(null);
    setSelectedGRNs([]);
    setFormData((prev) => ({
      ...prev,
      baseCost: 0,
      netTaxes: 0,
      netCharges: 0,
      allInclusiveCost: 0,
      charges: [],
      deductions: [],
    }));

    closeSelectPOModal();
  };

  // Handle GRN selection
  const handleGRNSelect = (grn) => {
    setSelectedGRN(grn);
    setFormData((prev) => ({
      ...prev,
      baseCost: grn.base_cost,
      netTaxes: grn.net_taxes,
      netCharges: grn.net_charges,
      allInclusiveCost: grn.all_inc_tax,
      charges: grn.addition_tax_charges || [],
      deductions: grn.deduction_taxes || [],
    }));
  };

  // Handle GRN checkbox selection
  const handleGRNCheckboxSelect = (grn) => {
    setSelectedGRNs((prev) => {
      const isSelected = prev.some((g) => g.id === grn.id);
      if (isSelected) {
        return prev.filter((g) => g.id !== grn.id);
      } else {
        return [...prev, grn];
      }
    });
  };

  // Handle GRN submission
  const handleGRNSubmit = () => {
    setSelectedGRN(selectedGRNs[0]); // Set the first selected GRN as the main selected GRN
    closeSelectGRNModal();
  };

  // Render PO table in modal
  const renderPOTable = () => {
    if (purchaseOrders.length === 0) {
      return (
        <div className="tbl-container mx-3 mt-3">
          <p className="text-center mt-3">No purchase orders found.</p>
        </div>
      );
    }

    return (
      <>
        <div className="tbl-container mx-3 mt-3">
          <table className="w-100">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th className="text-start">Sr.No</th>
                <th className="text-start">PO Number</th>
                <th className="text-start">PO Date</th>
                <th className="text-start">PO Value</th>
                <th className="text-start">PO Type</th>
                <th className="text-start">Action</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((po, index) => (
                <tr key={po.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedPO?.id === po.id}
                      onChange={() => handlePOSelect(po)}
                    />
                  </td>
                  <td className="text-start">{index + 1}</td>
                  <td className="text-start">{po.po_number}</td>
                  <td className="text-start">{po.po_date}</td>
                  <td className="text-start">{po.total_value}</td>
                  <td className="text-start">{po.po_type}</td>
                  <td>
                    <button
                      className="btn btn-light p-0 border-0"
                      onClick={() => handlePOSelect(po)}
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center px-3 mt-2">
          <ul className="pagination justify-content-center d-flex">
            {/* First Button */}
            <li
              className={`page-item ${
                pagination.current_page === 1 ? "disabled" : ""
              }`}
            >
              <button className="page-link" onClick={() => handlePageChange(1)}>
                First
              </button>
            </li>

            {/* Previous Button */}
            <li
              className={`page-item ${
                pagination.current_page === 1 ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
              >
                Prev
              </button>
            </li>

            {/* Ellipsis before first page numbers if needed */}
            {pagination.current_page > 5 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}

            {/* Dynamic Page Numbers */}
            {getPageNumbers().map((pageNumber) => (
              <li
                key={pageNumber}
                className={`page-item ${
                  pagination.current_page === pageNumber ? "active" : ""
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

            {/* Ellipsis after last page numbers if needed */}
            {pagination.current_page + 4 < pagination.total_pages && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}

            {/* Next Button */}
            <li
              className={`page-item ${
                pagination.current_page === pagination.total_pages
                  ? "disabled"
                  : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.total_pages}
              >
                Next
              </button>
            </li>

            {/* Last Button */}
            <li
              className={`page-item ${
                pagination.current_page === pagination.total_pages
                  ? "disabled"
                  : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(pagination.total_pages)}
                disabled={pagination.current_page === pagination.total_pages}
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
                (pagination.current_page - 1) * pageSize + 1 || 1,
                pagination.total_count
              )}{" "}
              to{" "}
              {Math.min(
                pagination.current_page * pageSize,
                pagination.total_count
              )}{" "}
              of {pagination.total_count} entries
            </p>
          </div>
        </div>
      </>
    );
  };

  // Render GRN table in modal
  const renderGRNTable = () => {
    if (!selectedPO) return null;

    return (
      <div className="tbl-container mx-3 mt-3">
        <table className="w-100">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Material Name</th>
              <th>Material GRN Amount</th>
              <th>Certified Till Date</th>
              <th>Base cost</th>
              <th>Net Taxes</th>
              <th>Net Charges</th>
              <th className="text-start">All Inclusive Cost</th>
              <th className="text-start">Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedPO.grn_materials.map((grn, index) => (
              <tr key={grn.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedGRNs.some((g) => g.id === grn.id)}
                    onChange={() => handleGRNCheckboxSelect(grn)}
                  />
                </td>
                <td>{grn.material_name}</td>
                <td>{grn.material_grn_amount}</td>
                <td>{grn.certified_till_date || "-"}</td>
                <td>{grn.base_cost}</td>
                <td>{grn.net_taxes}</td>
                <td>{grn.net_charges}</td>
                <td>{grn.all_inc_tax}</td>
                <td>
                  <button
                    className="btn btn-light p-0 border-0"
                    onClick={() => {
                      handleGRNSelect(grn);
                      setattachThreeModal(true);
                    }}
                  >
                    Taxes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const [companies, setCompanies] = useState([]);
  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.company_name,
  }));

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
      .get(
        `${baseURL}pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((response) => {
        setCompanies(response.data.companies);
        // setData(response.data); // Set the data from the API to state
        setLoading(false); // Update the loading state
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
        setLoading(false);
      });
  }, []);

  // Handle company selection
  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption); // Set selected company
    setSelectedProject(null); // Reset project selection
    setSelectedSite(null); // Reset site selection
    // setSelectedWing(null); // Reset wing selection
    setProjects([]); // Reset projects
    setSiteOptions([]); // Reset site options
    // setWingsOptions([]); // Reset wings options

    // Reset selected PO and related form data
    setSelectedPO(null);
    setFormData((prev) => ({
      ...prev,
      poNumber: "",
      poDate: "",
      poValue: "",
      gstin: "",
      pan: "",
    }));

    if (selectedOption) {
      fetchPurchaseOrders(selectedOption.value);

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

  //   console.log("selected company:",selectedCompany)
  //   console.log("selected  prj...",projects)

  // Handle project selection
  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedSite(null); // Reset site selection
    // setSelectedWing(null); // Reset wing selection
    setSiteOptions([]); // Reset site options
    // setWingsOptions([]); // Reset wings options

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

  //   console.log("selected prj:",selectedProject)
  //   console.log("selected sub prj...",siteOptions)

  // Handle site selection
  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
  };

  // Add PO Type options
  const poTypeOptions = [
    { value: "Domestic", label: "Domestic" },
    { value: "ROPO", label: "ROPO" },
    { value: "Import", label: "Import" },
  ];

  // const [selectedPOType, setSelectedPOType] = useState(null);
  const [selectedPOType, setSelectedPOType] = useState({
    value: "Domestic",
    label: "Domestic",
  });

  // Add E-Invoice options
  const eInvoiceOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const [selectedEInvoice, setSelectedEInvoice] = useState(null);

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Add this useEffect to fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(
          `${baseURL}pms/suppliers.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  // Convert suppliers data to options format
  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier.id,
    label: supplier.organization_name,
  }));

  const [isLoading, setIsLoading] = useState(false);

  const handleTaxChange = (selectedOption) => {
    console.log("Selected tax:", selectedOption);
    setSelectedTax(selectedOption);
    if (selectedOption && selectedOption.value) {
      setFormData((prev) => ({
        ...prev,
        tax: selectedOption.value,
        taxName: selectedOption.label,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        tax: "",
        taxName: "",
      }));
    }
  };

  // Add null check for selectedTax in the SingleSelector
  <SingleSelector
    options={taxOptions}
    value={selectedTax || null}
    onChange={handleTaxChange}
    placeholder="Select Tax"
    isDisabled={isLoading}
  />;

  // Add percentage options for tax/charges
  const percentageOptions = [
    { value: "1", label: "1%" },
    { value: "2", label: "2%" },
    { value: "3", label: "3%" },
  ];

  // Add useEffect to fetch tax deduction data when GRNs change
  useEffect(() => {
    const fetchTaxDeductionData = async () => {
      if (selectedGRNs.length > 0) {
        try {
          const grnIds = selectedGRNs.map((grn) => grn.id);
          const response = await axios.get(
            `${baseURL}bill_bookings/deduction_data?grns=[${grnIds.join(
              ","
            )}]&token=653002727bac82324277efbb6279fcf97683048e44a7a839`
          );
          setTaxDeductionData(response.data);
        } catch (error) {
          console.error("Error fetching tax deduction data:", error);
        }
      }
    };

    fetchTaxDeductionData();
  }, [selectedGRNs]);

  // Add useEffect to fetch tax details data when GRNs change
  useEffect(() => {
    const fetchTaxDetailsData = async () => {
      if (selectedGRNs.length > 0) {
        try {
          const grnIds = selectedGRNs.map((grn) => grn.id);
          const response = await axios.get(
            `${baseURL}bill_bookings/taxes_data?grns=[${grnIds.join(
              ","
            )}]&token=653002727bac82324277efbb6279fcf97683048e44a7a839`
          );
          setTaxDetailsData(response.data);
        } catch (error) {
          console.error("Error fetching tax details data:", error);
        }
      }
    };

    fetchTaxDetailsData();
  }, [selectedGRNs]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (
      !selectedCompany ||
      !selectedProject ||
      !selectedSite ||
      !selectedPO ||
      selectedGRNs.length === 0
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        bill_booking: {
          company_id: selectedCompany?.value || null,
          site_id: selectedSite?.value || null,
          project_id: selectedProject?.value || null,
          pms_supplier_id: selectedSupplier?.value || null,
          invoice_number: formData.invoiceNumber,
          einvoice: selectedEInvoice?.value === "yes",
          inventory_date: formData.invoiceDate,
          invoice_amount: parseFloat(formData.invoiceAmount),
          type_of_certificate: formData.typeOfCertificate,
          department_id: formData.departmentId,
          other_deductions: parseFloat(otherDeductions) || 0,
          other_deduction_remarks: formData.otherDeductionRemarks,
          other_additions: parseFloat(otherAdditions) || 0,
          other_addition_remarks: formData.otherAdditionRemarks,
          retention_per: parseFloat(formData.retentionPercentage) || 0,
          retention_amount: parseFloat(formData.retentionAmount) || 0,
          total_value: taxDeductionData.total_material_cost,
          total_amount: taxDeductionData.total_material_cost,
          payable_amount:
            taxDeductionData.total_material_cost -
            taxDeductionData.total_deduction_cost,
          remark: formData.remark || "",
          status: "draft", // Changed to hardcoded "draft"
          po_type: "domestic",
          payee_name: formData.payeeName,
          payment_mode: formData.paymentMode,
          payment_due_date: formData.paymentDueDate,
          created_by_id: 1,
          current_advance_deduction:
            parseFloat(formData.currentAdvanceDeduction) || 0,
          billing_po: [
            {
              id: selectedPO.id,
              grn_ids: selectedGRNs.map((grn) => grn.id),
            },
          ],
          attachments: documentRows.map((row) => ({
            filename: row.upload?.filename || "",
            content: row.upload?.content || "",
            content_type: row.upload?.content_type || "",
          })),
        },
      };

      console.log("Payload for API:", payload);

      const response = await axios.post(
        `${baseURL}bill_bookings?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        payload
      );

      if (response.data) {
        alert("Bill booking created successfully!");
        navigate("/bill-booking-list"); // Redirect to bill-booking-list
        // Reset form or redirect as needed
      }
    } catch (error) {
      console.error("Error creating bill booking:", error);
      alert("Failed to create bill booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

  const [otherDeductions, setOtherDeductions] = useState(0);
  const [otherAdditions, setOtherAdditions] = useState(0);
  const [taxDetailsTotal, setTaxDetailsTotal] = useState(0);

  // Function to calculate the total dynamically
  const calculateTaxDetailsTotal = () => {
    const baseCost = taxDeductionData.total_material_cost || 0;
    const taxAmount = Object.values(taxDetailsData.tax_data).reduce(
      (sum, value) => sum + (value || 0),
      0
    );
    const total =
      baseCost +
      taxAmount +
      parseFloat(otherAdditions || 0) -
      parseFloat(otherDeductions || 0);
    setTaxDetailsTotal(total);
  };

  // Update total whenever deductions or additions change
  useEffect(() => {
    calculateTaxDetailsTotal();
  }, [otherDeductions, otherAdditions, taxDeductionData, taxDetailsData]);

  // Update rows when selectedGRN changes
  useEffect(() => {
    const defaultRows = [
      {
        id: 1,
        type: "Handling Charges",
        percentage: "",
        inclusive: false,
        amount: "",
        isEditable: false,
        addition: true,
      },
      {
        id: 2,
        type: "Other charges",
        percentage: "",
        inclusive: false,
        amount: "",
        isEditable: false,
        addition: true,
      },
      {
        id: 3,
        type: "Freight",
        percentage: "",
        inclusive: false,
        amount: "",
        isEditable: false,
        addition: true,
      },
    ];

    if (
      selectedGRN?.addition_tax_charges &&
      selectedGRN.addition_tax_charges.length > 0
    ) {
      const taxCharges = selectedGRN.addition_tax_charges;
      setRows((prevRows) => {
        // Create a map of existing rows by type
        const existingRows = new Map(prevRows.map((row) => [row.type, row]));

        // Update or add rows based on API response
        const updatedRows = taxCharges.map((tax, index) => ({
          id: index + 1,
          type: tax.tax_name,
          percentage: tax.tax_charge_per_uom || "",
          inclusive: tax.inclusive || false,
          amount: tax.amount || "",
          isEditable: ![
            "Handling Charges",
            "Other charges",
            "Freight",
          ].includes(tax.tax_name),
          addition: true,
        }));

        // Add any default rows that weren't in the API response
        defaultRows.forEach((row) => {
          if (!existingRows.has(row.type)) {
            updatedRows.push(row);
          }
        });

        return updatedRows;
      });
    } else {
      // If no tax charges in API, show default rows
      setRows(defaultRows);
    }
  }, [selectedGRN]);

  // Update deductionRows when selectedGRN changes
  useEffect(() => {
    if (
      selectedGRN?.deduction_taxes &&
      selectedGRN.deduction_taxes.length > 0
    ) {
      const deductionTaxes = selectedGRN.deduction_taxes;
      setDeductionRows((prevRows) => {
        return deductionTaxes.map((tax, index) => ({
          id: index + 1,
          type: tax.tax_name,
          percentage: tax.tax_charge_per_uom || "",
          inclusive: tax.inclusive || false,
          amount: tax.amount || "",
          addition: false,
        }));
      });
    }
  }, [selectedGRN]);

  const [pendingAdvances, setPendingAdvances] = useState([]);

  useEffect(() => {
    const fetchPendingAdvances = async () => {
      if (selectedPO?.id) {
        try {
          const response = await axios.get(
            `${baseURL}advance_notes?q[purchase_order__id_eq]=${selectedPO.id}`
          );
          setPendingAdvances(response.data.advance_notes || []);
        } catch (error) {
          console.error("Error fetching pending advances:", error);
          setPendingAdvances([]);
        }
      }
    };

    fetchPendingAdvances();
  }, [selectedPO]);

  const [creditNotes, setCreditNotes] = useState([]);
  const [debitNotes, setDebitNotes] = useState([]);

  useEffect(() => {
    const fetchCreditAndDebitNotes = async () => {
      if (selectedPO?.id) {
        try {
          // Fetch Credit Notes
          const creditResponse = await axios.get(
            `${baseURL}credit_notes?q[purchase_order__id_eq]=${selectedPO.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
          );
          setCreditNotes(creditResponse.data.credit_notes || []);

          // Fetch Debit Notes
          const debitResponse = await axios.get(
            `${baseURL}debit_notes?q[purchase_order__id_eq]=${selectedPO.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
          );
          setDebitNotes(debitResponse.data.debit_notes || []);
        } catch (error) {
          console.error("Error fetching credit or debit notes:", error);
          setCreditNotes([]);
          setDebitNotes([]);
        }
      }
    };

    fetchCreditAndDebitNotes();
  }, [selectedPO]);

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section px-2">
          <a href="">Home &gt; Billing &amp; Accounts &gt; Bill Booking</a>
          <h5 className="mt-3">Bill Booking</h5>
          <div className="row my-4 align-items-center container-fluid">
            <div className="col-md-12 ">
              <div className="card p-3">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Company</label>
                      <SingleSelector
                        options={companyOptions}
                        className="form-control form-select"
                        value={selectedCompany}
                        onChange={handleCompanyChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="event-no-select">Project</label>
                    <div className="form-group">
                      <SingleSelector
                        options={projects}
                        onChange={handleProjectChange}
                        value={selectedProject}
                        placeholder={`Select Project`} // Dynamic placeholder
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="event-no-select"> SubProject</label>
                    <div className="form-group">
                      <SingleSelector
                        options={siteOptions}
                        onChange={handleSiteChange}
                        value={selectedSite}
                        placeholder={`Select Sub-project`} // Dynamic placeholder
                      />
                    </div>
                  </div>

                  <div className="col-md-4  mt-2">
                    <div className="form-group">
                      <label>Supplier</label>
                      <SingleSelector
                        options={supplierOptions}
                        className="form-control form-select"
                        value={selectedSupplier}
                        onChange={(selected) => setSelectedSupplier(selected)}
                        placeholder="Select Supplier"
                      />
                    </div>
                  </div>
                  {/* <div className="col-md-1 pt-2 mt-4">
                    <p className="mt-2 text-decoration-underline">
                      View Details
                    </p>
                  </div> */}

                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>PO Type</label>
                      <SingleSelector
                        options={poTypeOptions}
                        className="form-control form-select"
                        value={selectedPOType}
                        onChange={(selected) => setSelectedPOType(selected)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 mt-2">
                    <div className="form-group">
                      <label>PO Number</label>
                      {/* <SingleSelector
                        options={purchaseOrders.map((po) => ({
                          value: po.id,
                          label: po.po_number,
                        }))}
                        className="form-control form-select"
                        value={
                          selectedPO
                            ? {
                                value: selectedPO.id,
                                label: selectedPO.po_number,
                              }
                            : null
                        }
                        onChange={(selected) => {
                          const selectedPO = purchaseOrders.find(
                            (po) => po.id === selected.value
                          );
                          if (selectedPO) {
                            handlePOSelect(selectedPO);
                          }
                        }}
                      /> */}
                      <input
                        className="form-control"
                        type="text"
                        value={selectedPO?.po_number || ""}
                        disabled
                      />
                    </div>
                  </div>
                  <div
                    className="col-md-1 pt-4"
                    data-bs-toggle="modal"
                    data-bs-target="#selectModal"
                    onClick={openSelectPOModal}
                  >
                    <p className="mt-3 text-decoration-underline">Select</p>
                  </div>

                  <div className="d-flex justify-content-between mt-3 me-2">
                    <h5 className=" ">PO Details</h5>
                  </div>

                  <div className="tbl-container mx-1 mt-3">
                    <table className="w-100">
                      <thead>
                        <tr>
                          <th className="text-start">Sr. No.</th>
                          <th className="text-start">Po Display No</th>
                          <th className="text-start">PO Date</th>
                          <th className="text-start">PO Value</th>
                          <th className="text-start">PO Type</th>
                          <th className="text-start">PO Fright</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-start">1</td>
                          <td className="text-start">
                            {selectedPO?.po_number || "-"}
                          </td>
                          <td className="text-start">
                            {selectedPO?.po_date || "-"}
                          </td>
                          <td className="text-start">
                            {selectedPO?.total_value || "-"}
                          </td>
                          <td className="text-start">
                            {selectedPO?.po_type || "-"}
                          </td>
                          <td className="text-start">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-4 mt-3">
                    <div className="form-group">
                      <label>Invoice Number</label>
                      <input
                        className="form-control"
                        type="text"
                        value={formData.invoiceNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            invoiceNumber: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-3">
                    <div className="form-group">
                      <label>E-Invoice</label>
                      <SingleSelector
                        options={eInvoiceOptions}
                        className="form-control form-select"
                        value={selectedEInvoice}
                        onChange={(selected) => setSelectedEInvoice(selected)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-3">
                    <div className="form-group">
                      <label>Invoice Date</label>
                      <input
                        className="form-control"
                        type="date"
                        value={formData.invoiceDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            invoiceDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-3">
                    <div className="form-group">
                      <label>Invoice Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        value={formData.invoiceAmount}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            invoiceAmount: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-3">
                    <div className="form-group">
                      <label>PO Value</label>
                      <input
                        className="form-control"
                        type="number"
                        value={formData.poValue}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-3 mt-3">
                    <div className="form-group">
                      <label>GSTIN</label>
                      <input
                        className="form-control"
                        type="text"
                        value={formData.gstin}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-1 pt-4 mt-3">
                    <p className="mt-2 text-decoration-underline">Verify</p>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>PAN</label>
                      <input
                        className="form-control"
                        type="text"
                        value={formData.pan}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Type of Certificate</label>
                      <SingleSelector
                        options={companyOptions}
                        className="form-control form-select"
                      ></SingleSelector>
                    </div>
                  </div>

                  {/* <div className="col-md-4 mt-3">
                    <div className="form-group">
                      <label>Department</label>
                      <SingleSelector
                        options={companyOptions}
                        className="form-control form-select"
                      ></SingleSelector>
                    </div>
                  </div> */}
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">GRN Details</h5>
                  <div
                    className="card-tools d-flex"
                    data-bs-toggle="modal"
                    data-bs-target="#RevisionModal"
                  >
                    <button
                      className="purple-btn2 rounded-3"
                      data-bs-toggle="modal"
                      data-bs-target="#RevisionModal"
                      fdprocessedid="xn3e6n"
                      onClick={openSelectGRNModal}
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
                      <span>Select GRN</span>
                    </button>
                  </div>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Sr. No.</th>
                        <th className="text-start">Material Name</th>
                        <th className="text-start">Material GRN Amount</th>
                        <th className="text-start">Certified Till Date</th>
                        <th className="text-start">Base Cost</th>
                        <th className="text-start">Net Taxes</th>
                        <th className="text-start">Net Charges</th>
                        <th className="text-start">Qty</th>
                        <th className="text-start">All Inclusive Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedGRNs.map((grn, index) => (
                        <tr key={grn.id}>
                          <td className="text-start">{index + 1}</td>
                          <td className="text-start">{grn.material_name}</td>
                          <td className="text-start">{grn.all_inc_tax}</td>
                          <td className="text-start">
                            {grn.certified_till_date || "-"}
                          </td>
                          <td className="text-start">{grn.base_cost}</td>
                          <td className="text-start">{grn.net_taxes}</td>
                          <td className="text-start">{grn.net_charges}</td>
                          <td className="text-start">{grn.qty || "-"}</td>
                          <td className="text-start">{grn.all_inc_tax}</td>
                        </tr>
                      ))}
                      <tr>
                        <th className="text-start">Total</th>
                        <td />
                        <td className="text-start">
                          {selectedGRNs.reduce(
                            (acc, grn) =>
                              acc + (parseFloat(grn.all_inc_tax) || 0),
                            0
                          )}
                        </td>
                        <td />
                        <td className="text-start">
                          {selectedGRNs.reduce(
                            (acc, grn) =>
                              acc + (parseFloat(grn.base_cost) || 0),
                            0
                          )}
                        </td>
                        <td className="text-start">
                          {selectedGRNs.reduce(
                            (acc, grn) =>
                              acc + (parseFloat(grn.net_taxes) || 0),
                            0
                          )}
                        </td>
                        <td className="text-start">
                          {selectedGRNs.reduce(
                            (acc, grn) =>
                              acc + (parseFloat(grn.net_charges) || 0),
                            0
                          )}
                        </td>
                        <td className="text-start">
                          {selectedGRNs.reduce(
                            (acc, grn) => acc + (parseFloat(grn.qty) || 0),
                            0
                          )}
                        </td>
                        <td className="text-start">
                          {selectedGRNs.reduce(
                            (acc, grn) =>
                              acc + (parseFloat(grn.all_inc_tax) || 0),
                            0
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Pending Advances (&gt; 60 days)</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Project</th>
                        <th className="text-start">PO No.</th>
                        <th className="text-start">Paid Ammount</th>
                        <th className="text-start">Adjusted Amount</th>
                        <th className="text-start">Balance Amount</th>
                        <th className="text-start">
                          Current Adjustment Amount
                        </th>
                        <th className="text-start">Net Amount</th>
                        <th className="text-start">Add Certificate No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingAdvances.length > 0 ? (
                        pendingAdvances.map((advance, index) => (
                          <tr key={index}>
                            <td className="text-start">
                              {advance.project_name || "-"}
                            </td>
                            <td className="text-start">
                              {advance.po_number || "-"}
                            </td>
                            <td className="text-start">
                              {advance.paid_amount || "-"}
                            </td>
                            <td className="text-start">
                              {advance.adjusted_amount || "-"}
                            </td>
                            <td className="text-start">
                              {advance.balance_amount || "-"}
                            </td>
                            <td className="text-start">
                              {advance.current_adjustment || "-"}
                            </td>
                            <td className="text-start">
                              {advance.net_amount || "-"}
                            </td>
                            <td className="text-start">
                              {advance.certificate_no || "-"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-start" colSpan="8">
                            No pending advances found.
                          </td>
                        </tr>
                      )}
                      <tr>
                        <th className="text-start">Total</th>
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Tax Deduction:</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Tax / Charge Type</th>
                        <th className="text-start">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start">Taxable Amount</td>
                        <td className="text-start">
                          {taxDeductionData.total_material_cost}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-start">Deduction Tax</td>
                        <td className="text-start">
                          {taxDeductionData.deduction_mor_inventory_tax_amount}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-start">Total Deduction</td>
                        <td className="text-start">
                          {taxDeductionData.total_deduction_cost}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-start">Payable Amount</td>
                        <td className="text-start">
                          {taxDeductionData.total_material_cost -
                            taxDeductionData.deduction_mor_inventory_tax_amount}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Tax Details:</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Tax / Charge Type</th>
                        <th className="text-start">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start">Base Cost</td>
                        <td className="text-start">
                          {taxDeductionData.total_material_cost}
                        </td>
                      </tr>
                      {Object.entries(taxDetailsData.tax_data).map(
                        ([taxType, amount]) => (
                          <tr key={taxType}>
                            <td className="text-start">{taxType}</td>
                            <td className="text-start">{amount}</td>
                          </tr>
                        )
                      )}
                      {/* <tr>
                        <th className="text-start">Total</th>
                        <td className="text-start">
                          {Object.values(taxDetailsData.tax_data).reduce(
                            (sum, value) => sum + (value || 0),
                            0
                          ) + taxDeductionData.total_material_cost}
                        </td>
                      </tr> */}
                      <tr>
                        <td className="text-start">Other Additions</td>
                        <td className="text-start">{otherAdditions}</td>
                      </tr>
                      <tr>
                        <td className="text-start">Other Deductions</td>
                        <td className="text-start">-{otherDeductions}</td>
                      </tr>
                      <tr>
                        <th className="text-start">Total</th>
                        <td className="text-start">{taxDetailsTotal}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Advance Adjusted:</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Tax</th>
                        <th className="text-start">Tax Amount</th>
                        <th className="text-start">Tax Adjusted</th>
                        <th className="text-start">Net Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
                      <tr>
                        <td className="text-start"> </td>
                        <td className="text-start" />
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Advance Details:</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Project Name</th>
                        <th className="text-start">PO Display No.</th>
                        <th className="text-start">Advance Amount</th>
                        <th className="text-start">Advance Paid Till Date</th>
                        <th className="text-start">Debit Note for Advance</th>
                        <th className="text-start">Advance Outstanding</th>
                        <th className="text-start">
                          Current Advance Deduction
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
                      <tr>
                        <td className="text-start" />
                        <td className="text-start">Total</td>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Retention Details:</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Retention Amount Payable</th>
                        <th className="text-start">Retention Amount Paid</th>
                        <th className="text-start">Retention Amount Pending</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
                    </tbody>
                  </table>
                </div> */}
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Current advance deduction:</h5>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Total advance deduction amount</label>
                      <input
                        className="form-control"
                        type="number"
                        value={formData.currentAdvanceDeduction}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            currentAdvanceDeduction: e.target.value,
                          }))
                        }
                        placeholder="Enter advance deduction amount"
                      />
                    </div>
                  </div>
                  {/* </div> */}
                  {/* <div className="row"> */}
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Other Deduction</label>
                      <input
                        className="form-control"
                        type="number"
                        // value={formData.otherDeductions}
                        // onChange={(e) =>
                        //   setFormData((prev) => ({
                        //     ...prev,
                        //     otherDeductions: e.target.value,
                        //   }))
                        // }
                        value={otherDeductions}
                        onChange={(e) => setOtherDeductions(e.target.value)}
                        placeholder="Enter other deduction amount"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Other Deduction Remark</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={formData.otherDeductionRemarks}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            otherDeductionRemarks: e.target.value,
                          }))
                        }
                        placeholder="Enter other deduction remarks"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Other Addition</label>
                      {/* <input
                        className="form-control"
                        type="number"
                        value={formData.otherAdditions}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            otherAdditions: e.target.value,
                          }))
                        }
                        placeholder="Enter other addition amount"
                      /> */}
                      <input
                        className="form-control"
                        type="number"
                        value={otherAdditions}
                        onChange={(e) => setOtherAdditions(e.target.value)}
                        placeholder="Enter other addition amount"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Other Addition Remark</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={formData.otherAdditionRemarks}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            otherAdditionRemarks: e.target.value,
                          }))
                        }
                        placeholder="Enter other addition remarks"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Retention Percentage</label>
                      <input
                        className="form-control"
                        type="number"
                        value={formData.retentionPercentage}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            retentionPercentage: e.target.value,
                          }))
                        }
                        placeholder="Enter retention percentage"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Retention Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        value={formData.retentionAmount}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            retentionAmount: e.target.value,
                          }))
                        }
                        placeholder="Enter retention amount"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Favouring / Payee</label>
                      <input
                        className="form-control"
                        type="text"
                        value={formData.payeeName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            payeeName: e.target.value,
                          }))
                        }
                        placeholder="Enter payee name"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Payment Mode</label>
                      <input
                        className="form-control"
                        type="text"
                        value={formData.paymentMode}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentMode: e.target.value,
                          }))
                        }
                        placeholder="Enter payment mode"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Payment Due Date</label>
                      <input
                        className="form-control"
                        type="date"
                        value={formData.paymentDueDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentDueDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Total Certified Till Date</label>
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
                      <label>Remark</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Enter ..."
                        defaultValue={""}
                        value={formData.remark} // Bind to formData.remark
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            remark: e.target.value, // Update formData.remark
                          }))
                        }
                      />
                    </div>
                  </div>
                  {/* <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Expected Payment Date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div> */}
                  {/* <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Processed Date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div> */}
                </div>
                {/* <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Status</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div> */}
                {/* </div> */}
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Advance Adjusted:</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">ID</th>
                        <th className="text-start">PO Display No.</th>
                        <th className="text-start">Project</th>
                        <th className="text-start">Advance Amount (INR)</th>
                        <th className="text-start">
                          Debit Note For Advance (INR)
                        </th>
                        <th className="text-start">
                          Advance Adjusted Till Date (INR)
                        </th>
                        <th className="text-start">
                          Advance Outstanding till Certificate Date (INR)
                        </th>
                        <th className="text-start">
                          Advance Outstanding till current Date (INR)
                        </th>
                        <th className="text-start">This Recovery (INR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingAdvances.length > 0 ? (
                        pendingAdvances.map((advance, index) => (
                          <tr key={index}>
                            <td className="text-start">{advance.id || "-"}</td>
                            <td className="text-start">
                              {advance.po_number || "-"}
                            </td>
                            <td className="text-start">
                              {advance.project_name || "-"}
                            </td>
                            <td className="text-start">
                              {advance.advance_amount || "-"}
                            </td>
                            <td className="text-start">
                              {advance.debit_note_for_advance || "-"}
                            </td>
                            <td className="text-start">
                              {advance.advance_adjusted_till_date || "-"}
                            </td>
                            <td className="text-start">
                              {advance.advance_outstanding_till_certificate_date ||
                                "-"}
                            </td>
                            <td className="text-start">
                              {advance.advance_outstanding_till_current_date ||
                                "-"}
                            </td>
                            <td className="text-start">
                              {advance.this_recovery || "-"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-start" colSpan="9">
                            No advance adjusted data found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Payment Details</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Mode of Payment</th>
                        <th className="text-start">Instrument Date</th>
                        <th className="text-start">Instrument No.</th>
                        <th className="text-start">Bank / Cash Account</th>
                        <th className="text-start">Amount</th>
                        <th className="text-start">Created by</th>
                        <th className="text-start">Created On</th>
                        <th className="text-start">Status</th>
                        <th className="text-start">View Cheque Details</th>
                        <th className="text-start">Print</th>
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
                      </tr>
                    </tbody>
                  </table>
                </div> */}
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Debit Note</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Debit Note No.</th>
                        <th className="text-start">PO Display No.</th>
                        <th className="text-start">Project</th>
                        <th className="text-start">Debit Note Amount</th>
                        <th className="text-start">
                          Debit Note Recovery Till Date
                        </th>
                        <th className="text-start">Waive off Till Date</th>
                        <th className="text-start">
                          Outstanding Amount (Certificate Date)
                        </th>
                        <th className="text-start">
                          Outstanding Amount (Current Date)
                        </th>
                        <th className="text-start">Debit Note Reason Type</th>
                        <th className="text-start">This Recovery</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debitNotes.length > 0 ? (
                        debitNotes.map((note, index) => (
                          <tr key={index}>
                            <td className="text-start">
                              {note.debit_note_no || "-"}
                            </td>
                            <td className="text-start">
                              {note.po_number || "-"}
                            </td>
                            <td className="text-start">
                              {note.project_name || "-"}
                            </td>
                            <td className="text-start">
                              {note.debit_note_amount || "-"}
                            </td>
                            <td className="text-start">
                              {note.recovery_till_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.waive_off_till_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.outstanding_certificate_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.outstanding_current_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.reason_type || "-"}
                            </td>
                            <td className="text-start">
                              {note.this_recovery || "-"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-start" colSpan="10">
                            No debit notes found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Credit Note</h5>
                </div>
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Credit Note No.</th>
                        <th className="text-start">PO Display No.</th>
                        <th className="text-start">Project</th>
                        <th className="text-start">Credi Note Amount</th>
                        <th className="text-start">
                          Credit Note Recovery Till Date
                        </th>
                        <th className="text-start">Waive off Till Date</th>
                        <th className="text-start">
                          Outstanding Amount (Certificate Date)
                        </th>
                        <th className="text-start">
                          Outstanding Amount (Current Date)
                        </th>
                        <th className="text-start">Credit Note Reason Type</th>
                        <th className="text-start">This Recovery</th>
                      </tr>
                    </thead>
                    <tbody>
                      {creditNotes.length > 0 ? (
                        creditNotes.map((note, index) => (
                          <tr key={index}>
                            <td className="text-start">
                              {note.credit_note_no || "-"}
                            </td>
                            <td className="text-start">
                              {note.po_number || "-"}
                            </td>
                            <td className="text-start">
                              {note.project_name || "-"}
                            </td>
                            <td className="text-start">
                              {note.credit_note_amount || "-"}
                            </td>
                            <td className="text-start">
                              {note.recovery_till_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.waive_off_till_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.outstanding_certificate_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.outstanding_current_date || "-"}
                            </td>
                            <td className="text-start">
                              {note.reason_type || "-"}
                            </td>
                            <td className="text-start">
                              {note.this_recovery || "-"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-start" colSpan="10">
                            No credit notes found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Document Attachment</h5>
                  <div
                    className="card-tools d-flex"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    <button
                      className="purple-btn2 rounded-3"
                      data-bs-toggle="modal"
                      data-bs-target="#viewDocumentModal"
                      fdprocessedid="xn3e6n"
                      onClick={openAttachTwoModal}
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
                <div className="tbl-container mx-3 mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Sr. No.</th>
                        <th className="text-start">Document Name</th>
                        <th className="text-start">File Name</th>
                        <th className="text-start">File Type</th>
                        <th className="text-start">Upload Date</th>
                        <th className="text-start">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start">PO.pdf</td>
                        <td className="text-start">04-03-2024</td>
                        <td
                          className="text-decoration-underline cursor-pointer"
                          // data-bs-toggle="modal"
                          // data-bs-target="#RevisionModal"
                          onClick={openAttachOneModal}
                        >
                          View
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div> */}
                {/* // Replace the existing Document Attachment section with this
                code */}
                <div>
                  <div className="d-flex justify-content-between align-items-end mx-1 mt-5">
                    <h5 className="mt-3">
                      Document Attachments{" "}
                      <span style={{ color: "red", fontSize: "16px" }}>*</span>
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
                              handleFileChange(index, e.target.files[0])
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
                          onClick={() => handleRemoveDocumentRow(index)}
                          disabled={documentRows.length === 1}
                        >
                          Remove
                        </button>
                      ),
                    }))}
                  />
                </div>
              </div>
              {/* <div className="row">
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
              <div className="row">
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
              </div> */}
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
              <div className="d-flex justify-content-end align-items-center gap-3 mt-2">
                <p className="mb-0">Status</p>
                <select
                  className="form-select purple-btn2"
                  style={{ width: "150px" }}
                  value={formData.status || "draft"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="verified">Verified</option>
                  <option value="approved">Approved</option>
                  <option value="submitted">Submitted</option>
                  <option value="proceed">Proceed</option>
                </select>
              </div>

              <div className="row mt-2 justify-content-end">
                <div className="col-md-2">
                  <button
                    className="purple-btn2 w-100"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
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

      {/* modal */}
      <Modal
        centered
        size="lg"
        show={selectPOModal}
        onHide={closeSelectPOModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select PO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="d-flex justify-content-between mt-3 me-2">
              <h5 className=" ">Category of PO</h5>
            </div>
            <div className="radio-buttons d-flex align-items-center gap-4">
              <div className="form-check">
                <button
                  className="border-0 "
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal2"
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="radio1"
                  />
                </button>
                <label className="form-check-label" htmlFor="yesRadio">
                  Material
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="radio1"
                  id="noRadio"
                />
                <label className="form-check-label" htmlFor="noRadio">
                  Asset
                </label>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Project</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder=""
                    fdprocessedid="qv9ju9"
                    value={selectedProject?.label || ""}
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Sub Project</label>
                  <input
                    className="form-control"
                    type="text"
                    value={selectedSite?.label || ""}
                    placeholder=""
                    fdprocessedid="qv9ju9"
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Supplier</label>
                  <input
                    className="form-control"
                    type="text"
                    value={selectedSupplier?.label || ""}
                    placeholder=""
                    fdprocessedid="qv9ju9"
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>PO Start Date</label>
                  <input
                    className="form-control"
                    type="date"
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
              <div className="col-md-6">
                <div className="form-group">
                  <label>PO End Date</label>
                  <input
                    className="form-control"
                    type="date"
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
              <div className="col-md-6">
                <div className="form-group">
                  <label>PO Type</label>
                  <SingleSelector
                    options={poTypeOptions}
                    className="form-control form-select"
                    value={
                      filterParams.poType
                        ? {
                            value: filterParams.poType,
                            label: filterParams.poType,
                          }
                        : null
                    }
                    onChange={(selected) =>
                      setFilterParams((prev) => ({
                        ...prev,
                        poType: selected ? selected.value : "",
                      }))
                    }
                  />
                </div>
              </div>
              {/* <div className="col-md-6">
                <div className="form-group">
                  <label>PO Number</label>
                  <SingleSelector
                    options={purchaseOrders.map((po) => ({
                      value: po.id,
                      label: po.po_number,
                    }))}
                    className="form-control form-select"
                    value={
                      selectedPO
                        ? {
                            value: selectedPO.id,
                            label: selectedPO.po_number,
                          }
                        : null
                    }
                    onChange={(selected) => 
                      {
                      const selectedPO = purchaseOrders.find(
                        (po) => po.id === selected.value
                      );
                      if (selectedPO) {
                        setSelectedPO(selectedPO);
                        setFilterParams((prev) => ({
                          ...prev,
                          selectedPOIds: [selectedPO.id],
                        }));
                        setFormData((prev) => ({
                          ...prev,
                          poNumber: selectedPO.po_number,
                          poDate: selectedPO.po_date,
                          poValue: selectedPO.total_value,
                          gstin: selectedPO.gstin,
                          pan: selectedPO.pan,
                        }));
                      }

                    }}
                  />
                </div>
              </div> */}
              {/* <div className="col-md-6">
                <div className="form-group">
                  <label>PO Number</label>
                  <SingleSelector
                    
                    options={purchaseOrders.map((po) => ({
                      value: po.id,
                      label: po.po_number,
                    }))}
                    className="form-control form-select"
                    value={
                      filterParams.selectedPOIds.length > 0
                        ? {
                            value: filterParams.selectedPOIds[0],
                            label:
                              purchaseOrders.find(
                                (po) => po.id === filterParams.selectedPOIds[0]
                              )?.po_number || "",
                          }
                        : null
                    }
                    onChange={(selected) =>
                      setFilterParams((prev) => ({
                        ...prev,
                        selectedPOIds: selected ? [selected.value] : [],
                      }))
                    }
                    placeholder="Select PO Number"
                  />
                </div>
              </div> */}
              <div className="col-md-6">
                <div className="form-group">
                  <label>PO Number</label>
                  <MultiSelector
                    options={purchaseOrders.map((po) => ({
                      value: po.id,
                      label: po.po_number,
                    }))}
                    value={filterParams.selectedPOIds.map((id) => {
                      const po = purchaseOrders.find((po) => po.id === id);
                      return po ? { value: po.id, label: po.po_number } : null;
                    })}
                    onChange={(selected) =>
                      setFilterParams((prev) => ({
                        ...prev,
                        selectedPOIds: selected
                          ? selected.map((item) => item.value)
                          : [],
                      }))
                    }
                    placeholder="Select PO Numbers"
                    isDisabled={false}
                  />
                </div>
              </div>
            </div>
            <div className="row mt-2 justify-content-center">
              <div className="col-md-3">
                <button className="purple-btn2 w-100" onClick={handleSearch}>
                  Search
                </button>
              </div>
              {/* <div className="col-md-3">
                <button
                  className="purple-btn2 w-100"
                  onClick={() => {
                    const allPOIds = purchaseOrders.map((po) => po.id);
                    setFilterParams((prev) => ({
                      ...prev,
                      selectedPOIds: allPOIds,
                    }));
                  }}
                >
                  Select All
                </button>
              </div> */}
              <div className="col-md-3">
                <button className="purple-btn1 w-100" onClick={handleReset}>
                  Reset
                </button>
              </div>
              <div className="col-md-3">
                <button
                  className="purple-btn1 w-100"
                  onClick={closeSelectPOModal}
                >
                  Close
                </button>
              </div>
            </div>
            {renderPOTable()}
          </div>

          <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button
                className="purple-btn1 w-100"
                fdprocessedid="u33pye"
                onClick={closeSelectPOModal}
              >
                Close
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/*  */}
      <Modal
        centered
        size="lg"
        show={selectGRNModal}
        onHide={closeSelectGRNModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>GRN Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-4">
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
          </div>
          <div className=" mt-3 me-2">
            <h5 className=" ">GRN Details</h5>
          </div>
          {renderGRNTable()}
          <div className="row mt-2 justify-content-center">
            <div className="col-md-3">
              <button
                className="purple-btn2 w-100"
                onClick={handleGRNSubmit}
                disabled={selectedGRNs.length === 0}
              >
                Submit
              </button>
            </div>
            <div className="col-md-3">
              <button
                className="purple-btn1 w-100"
                onClick={closeSelectGRNModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/*  */}
      <Modal
        centered
        size="lg"
        show={attachOneModal}
        onHide={closeAttachOneModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Attach Other Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="d-flex justify-content-between mt-3 me-2">
              <h5 className=" ">Latest Documents</h5>
              <div
                className="card-tools d-flex"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <button
                  className="purple-btn2 rounded-3"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                  data-bs-target="#secModal"
                  fdprocessedid="xn3e6n"
                  // onClick={openAttachTwoModal}
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
                    <th>Uploaded By</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>MTC</td>
                    <td>Material test Cert 1.pdf</td>
                    <td>01-03-2024</td>
                    <td>vendor user</td>
                    <td>
                      <i
                        className="fa-regular fa-eye"
                        data-bs-toggle="modal"
                        data-bs-target="#comments-modal"
                        style={{ fontSize: 18 }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className=" mt-3 me-2">
              <h5 className=" ">Document Attachment History</h5>
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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>MTC</td>
                    <td>Material test Cert 1.pdf</td>
                    <td>01-03-2024</td>
                    <td>vendor user</td>
                    <td>
                      <i
                        className="fa-regular fa-eye"
                        data-bs-toggle="modal"
                        data-bs-target="#comments-modal"
                        style={{ fontSize: 18 }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-4">
              <button className="purple-btn1 w-100" fdprocessedid="af5l5g">
                Close
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        centered
        size="lg"
        show={attachTwoModal}
        onHide={closeAttachOneModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Attach Other Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {/* Document Name Input */}
            <div className="mb-3">
              <label htmlFor="documentName" className="form-label">
                Document Name
              </label>
              <input
                type="text"
                className="form-control"
                id="documentName"
                placeholder="Enter document name"
              />
            </div>

            {/* File Upload Field */}
            <div className="mb-3">
              <label htmlFor="fileUpload" className="form-label">
                Choose File
              </label>
              <input type="file" className="form-control" id="fileUpload" />
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="row mt-3 justify-content-center">
              <div className="col-md-4">
                <button className="purple-btn2 w-100">Submit</button>
              </div>
              <div className="col-md-4">
                <button
                  className="purple-btn1 w-100"
                  onClick={closeAttachTwoModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/*  */}
      {/* <Modal
        centered
        size="lg"
        show={attachTwoModal}
        onHide={closeAttachTwoModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Attach Other Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>PO Number</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>GRN Number</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Delivery Challan No</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Amount (INR)</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Certified Till Date (INR)</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>All Inclusive Cost (INR)</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
          </div>
          <div className=" mt-3 me-2">
            <h5 className=" ">GRN Details</h5>
          </div>
          <div className="tbl-container mx-3 mt-3">
            <table className="w-100">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Material Name</th>
                  <th>Material GRN Amount</th>
                  <th>Certified Till Date</th>
                  <th>Base cost</th>
                  <th>Net Taxes</th>
                  <th>Net Charges</th>
                  <th>Qty</th>
                  <th>All Inclusive Cost</th>
                  <th>Taxes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />

                  <td>
                    <button
                      className=" btn text-decoration-underline"
                      data-bs-toggle="modal"
                      data-bs-target="#taxesModal"
                      onClick={openAttachThreeModal}
                    >
                      Taxes
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-4">
              <button className="purple-btn2 w-100" fdprocessedid="u33pye">
                Submit
              </button>
            </div>
            <div className="col-md-4">
              <button className="purple-btn1 w-100" fdprocessedid="af5l5g">
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}

      {/*  */}
      <Modal
        centered
        size="lg"
        show={attachThreeModal}
        onHide={closeAttachThreeModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Tax & Charges</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="tbl-container mx-3 mt-3">
            <table className="w-100">
              <thead>
                <tr>
                  <th className="text-start">Tax / Charge Type</th>
                  <th className="text-start">Tax / Charges per UOM (INR)</th>
                  <th className="text-start">Inclusive / Exclusive</th>
                  <th className="text-start">Amount</th>
                  <th className="text-start">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Static Rows for Addition Tax */}
                <tr>
                  <th className="text-start">Total Base Cost</th>
                  <td className="text-start" />
                  <td className="text-start" />
                  <td className="text-start">
                    {" "}
                    {selectedGRN?.base_cost || ""}
                  </td>
                  <td />
                </tr>
                <tr>
                  <th className="text-start">Addition Tax & Charges</th>
                  <td className="text-start" />
                  <td className="text-start" />
                  <td className="text-start" />
                  <td onClick={addRow}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-plus-circle"
                      viewBox="0 0 16 16"
                      style={{
                        transform: showRows ? "rotate(45deg)" : "none",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                    </svg>
                  </td>
                </tr>
                {/* Dynamic Rows for Addition Tax */}
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="text-start">
                      <SingleSelector
                        options={taxTypes.map((type) => ({
                          value: type.name,
                          label: type.name,
                          isDisabled:
                            // Disable "Handling Charges", "Other charges", "Freight" for all rows
                            [
                              "Handling Charges",
                              "Other charges",
                              "Freight",
                            ].includes(type.name) ||
                            // Disable "SGST", "CGST", "IGST" if already selected in another row
                            (["SGST", "CGST", "IGST"].includes(type.name) &&
                              rows.some(
                                (r) => r.type === type.name && r.id !== row.id
                              )),
                        }))}
                        value={{ value: row.type, label: row.type }}
                        // onChange={(selectedOption) =>
                        //   setRows((prevRows) =>
                        //     prevRows.map((r) =>
                        //       r.id === row.id
                        //         ? { ...r, type: selectedOption.value || "" }
                        //         : r
                        //     )
                        //   )
                        // }
                        onChange={(selectedOption) => {
                          console.log("Selected Option:", selectedOption);
                          setRows((prevRows) =>
                            prevRows.map((r) =>
                              r.id === row.id
                                ? { ...r, type: selectedOption?.value || "" }
                                : r
                            )
                          );
                        }}
                        placeholder="Select Type"
                        isDisabled={!row.isEditable} // Disable if not editable
                      />
                    </td>
                    <td className="text-start">
                      {row.isEditable ? (
                        <select
                          className="form-control form-select"
                          value={row.percentage}
                          onChange={(e) => {
                            const percentage =
                              parseFloat(e.target.value.split(" ")[1]) || 0;
                            const amount =
                              ((selectedGRN?.base_cost || 0) * percentage) /
                              100;

                            setRows((prevRows) =>
                              prevRows.map((r) =>
                                r.id === row.id
                                  ? {
                                      ...r,
                                      percentage: e.target.value,
                                      amount: amount.toFixed(2),
                                    }
                                  : r
                              )
                            );
                          }}
                        >
                          <option value="">Select Tax</option>
                          {row.type === "IGST" && (
                            <>
                              <option value="IGST 5%">IGST 5%</option>
                              <option value="IGST 12%">IGST 12%</option>
                              <option value="IGST 18%">IGST 18%</option>
                              <option value="IGST 28%">IGST 28%</option>
                            </>
                          )}
                          {row.type === "SGST" && (
                            <>
                              <option value="SGST 5%">SGST 5%</option>
                              <option value="SGST 12%">SGST 12%</option>
                              <option value="SGST 18%">SGST 18%</option>
                              <option value="SGST 28%">SGST 28%</option>
                            </>
                          )}
                          {row.type === "CGST" && (
                            <>
                              <option value="CGST 5%">CGST 5%</option>
                              <option value="CGST 12%">CGST 12%</option>
                              <option value="CGST 18%">CGST 18%</option>
                              <option value="CGST 28%">CGST 28%</option>
                            </>
                          )}
                        </select>
                      ) : (
                        <input
                          type="text"
                          className="form-control"
                          value={row.percentage}
                          disabled
                        />
                      )}
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={row.inclusive}
                        onChange={(e) =>
                          setRows((prevRows) =>
                            prevRows.map((r) =>
                              r.id === row.id
                                ? { ...r, inclusive: e.target.checked }
                                : r
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={row.amount}
                        disabled={row.percentage !== ""}
                        onChange={(e) =>
                          setRows((prevRows) =>
                            prevRows.map((r) =>
                              r.id === row.id
                                ? {
                                    ...r,
                                    amount: parseFloat(e.target.value) || 0,
                                  }
                                : r
                            )
                          )
                        }
                      />
                    </td>
                    <td
                      className="text-start"
                      onClick={() => deleteRow(row.id)}
                      style={{ cursor: "pointer", color: "black" }}
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

                <tr>
                  <th className="text-start">Sub Total A (Addition)</th>
                  <td className="text-start" />
                  <td className="" />
                  <td className="text-start">{calculateSubTotal()}</td>
                  <td />
                </tr>
                <tr>
                  <th className="text-start">Gross Amount</th>
                  <td className="text-start" />
                  <td className="" />
                  <td className="text-start">
                    {(
                      parseFloat(calculateSubTotal()) +
                      (parseFloat(selectedGRN?.base_cost) || 0)
                    ).toFixed(2)}
                  </td>
                  <td />
                </tr>
                {/* Deduction Tax Section */}
                <tr>
                  <th className="text-start">Deduction Tax</th>
                  <td className="text-start" />
                  <td className="" />
                  <td className="text-start" />
                  <td onClick={addDeductionRow}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-plus-circle"
                      viewBox="0 0 16 16"
                      style={{
                        // transform: showDeductionRows ? "rotate(45deg)" : "none",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                    </svg>
                  </td>
                </tr>
                {/* Dynamic Rows for Deduction Tax */}
                {deductionRows.map((row) => (
                  <tr key={row.id}>
                    <td className="text-start">
                      <SingleSelector
                        options={deductionTypes.map((type) => ({
                          value: type.name,
                          label: type.name,
                        }))}
                        value={{ value: row.type, label: row.type }}
                        onChange={(selectedOption) =>
                          setDeductionRows((prevRows) =>
                            prevRows.map((r) =>
                              r.id === row.id
                                ? { ...r, type: selectedOption.value }
                                : r
                            )
                          )
                        }
                        placeholder="Select Type"
                      />
                    </td>
                    <td className="text-start">
                      {/* <select
                                                  className="form-control form-select"
                                                  value={row.percentage}
                                                  onChange={(e) =>
                                                    
                                                    setDeductionRows((prevRows) =>
                                                      prevRows.map((r) =>
                                                        r.id === row.id ? { ...r, percentage: e.target.value } : r
                                                      )
                                                    )
                                                  }
                                                > */}
                      <select
                        className="form-control form-select"
                        value={row.percentage}
                        onChange={(e) => {
                          const percentage =
                            parseFloat(e.target.value.split(" ")[1]) || 0;
                          const amount =
                            ((selectedGRN?.base_cost || 0) * percentage) / 100;

                          setDeductionRows((prevRows) =>
                            prevRows.map((r) =>
                              r.id === row.id
                                ? {
                                    ...r,
                                    percentage: e.target.value,
                                    amount: amount.toFixed(2),
                                  }
                                : r
                            )
                          );
                        }}
                      >
                        <option value="">Select Tax</option>
                        {row.type === "TDS" && (
                          <>
                            <option value="TDS 1%">TDS 1%</option>
                            <option value="TDS 2%">TDS 2%</option>
                            <option value="TDS 10%">TDS 10%</option>
                          </>
                        )}
                      </select>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={row.inclusive}
                        onChange={(e) =>
                          setDeductionRows((prevRows) =>
                            prevRows.map((r) =>
                              r.id === row.id
                                ? { ...r, inclusive: e.target.checked }
                                : r
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={row.amount}
                        disabled
                        onChange={(e) =>
                          setDeductionRows((prevRows) =>
                            prevRows.map((r) =>
                              r.id === row.id
                                ? {
                                    ...r,
                                    amount: parseFloat(e.target.value) || 0,
                                  }
                                : r
                            )
                          )
                        }
                      />
                    </td>
                    <td
                      className="text-start"
                      onClick={() => deleteDeductionRow(row.id)}
                      style={{ cursor: "pointer", color: "black" }}
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
                {/* Static Rows */}
                <tr>
                  <th className="text-start">Sub Total B (Deductions)</th>
                  <td className="text-start" />
                  <td className="" />
                  <td className="text-start">{calculateDeductionSubTotal()}</td>
                  <td />
                </tr>
                <tr>
                  <th className="text-start">Payable Amount</th>
                  <td className="text-start" />
                  <td className="" />
                  <td className="text-start">{calculatePayableAmount()}</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BillBookingCreate;
