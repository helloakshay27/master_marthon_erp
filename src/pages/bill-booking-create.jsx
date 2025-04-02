import React, { useEffect } from "react";
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
const BillBookingCreate = () => {
  const [actionDetails, setactionDetails] = useState(false);
  const [selectPOModal, setselectPOModal] = useState(false);
  const [selectGRNModal, setselectGRNModal] = useState(false);
  const [attachOneModal, setattachOneModal] = useState(false);
  const [attachTwoModal, setattachTwoModal] = useState(false);
  const [attachThreeModal, setattachThreeModal] = useState(false);
  // const companyOptions = [
  //   { value: "alabama", label: "Alabama" },
  //   { value: "alaska", label: "Alaska" },
  //   { value: "california", label: "California" },
  //   { value: "delaware", label: "Delaware" },
  //   { value: "tennessee", label: "Tennessee" },
  //   { value: "texas", label: "Texas" },
  //   { value: "washington", label: "Washington" },
  // ];

  // action dropdown
  const actionDropdown = () => {
    setactionDetails(!actionDetails);
  };
  //   modal
  const openSelectPOModal = () => {
    if (!selectedCompany) {
      alert("Please select a company first");
      return;
    }
    setselectPOModal(true);
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

  const [rows, setRows] = useState([
    { id: 1, type: "TDS 1", charges: "100", inclusive: false, amount: 50.0 },
  ]);
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
  });

  const [filterParams, setFilterParams] = useState({
    startDate: "",
    endDate: "",
    poType: "",
    poNumber: "",
    selectedPOIds: [], // Ensure this is initialized as an empty array
  });

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
      supplierId: "", // Add supplierId to filters
    }
  ) => {
    try {
      setLoading(true);
      let url = `${baseURL}purchase_orders/grn_details.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;

      // Add base filters
      url += `&q[company_id_eq]=${companyId}`;
      if (projectId) url += `&q[po_mor_inventories_project_id_eq]=${projectId}`;
      if (siteId) url += `&q[po_mor_inventories_pms_site_id_eq]=${siteId}`;
      if (filters?.supplierId)
        url += `&q[supplier_id_eq]=${filters.supplierId}`;

      // Add additional filters with null checks
      if (filters?.startDate) url += `&q[po_date_gteq]=${filters.startDate}`;
      if (filters?.endDate) url += `&q[po_date_lteq]=${filters.endDate}`;
      if (filters?.poType) url += `&q[po_type_eq]=${filters.poType}`;
      if (filters?.selectedPOIds?.length > 0) {
        url += `&q[id_in]=${filters.selectedPOIds.join(",")}`;
      }

      const response = await axios.get(url);
      setPurchaseOrders(response.data.purchase_orders);
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

    fetchPurchaseOrders(
      selectedCompany.value,
      selectedProject?.value,
      selectedSite?.value,
      {
        startDate: filterParams.startDate,
        endDate: filterParams.endDate,
        poType: filterParams.poType,
        selectedPOIds: filterParams.selectedPOIds,
        supplierId: selectedSupplier?.value || "", // Add selected supplier ID
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
    return (
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
              <th>Qty</th>
              <th>All Inclusive Cost</th>
              <th>Action</th>
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
                <td>{grn.qty || "-"}</td>
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

  const [selectedPOType, setSelectedPOType] = useState(null);

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

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid px-2">
          <a href="">Home &gt; Billing &amp; Accounts &gt; Bill Booking</a>
          <h5 className="mt-3">Bill Booking</h5>
          <div className="row my-4 align-items-center">
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
                  <div className="col-md-1 pt-2 mt-4">
                    <p className="mt-2 text-decoration-underline">
                      View Details
                    </p>
                  </div>

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
                  <div className="col-md-4 mt-2">
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
                  <div className="col-md-4 mt-3">
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
                        <td>
                          {selectedGRNs.reduce(
                            (acc, grn) =>
                              acc + (parseFloat(grn.all_inc_tax) || 0),
                            0
                          )}
                        </td>
                        <td />
                        <td>
                          {selectedGRNs.reduce(
                            (acc, grn) =>
                              acc + (parseFloat(grn.base_cost) || 0),
                            0
                          )}
                        </td>
                        <td>
                          {selectedGRNs.reduce(
                            (acc, grn) =>
                              acc + (parseFloat(grn.net_taxes) || 0),
                            0
                          )}
                        </td>
                        <td>
                          {selectedGRNs.reduce(
                            (acc, grn) =>
                              acc + (parseFloat(grn.net_charges) || 0),
                            0
                          )}
                        </td>
                        <td>
                          {selectedGRNs.reduce(
                            (acc, grn) => acc + (parseFloat(grn.qty) || 0),
                            0
                          )}
                        </td>
                        <td>
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
                      <tr>
                        <td className="text-start"> 1</td>
                        <td className="text-start" />
                        <td className="text-start"> </td>
                        <td className="text-start" />
                        <td className="text-start text-decoration-underline" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                      </tr>
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
                        {/* <th className="text-start">
                          Tax / Charges per UOM (INR)
                        </th> */}
                        {/* <th className="text-start">Inclusive / Exclusive</th> */}
                        <th className="text-start">Amount</th>
                        {/* <th className="text-start">Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="text-start">Taxable Amount</th>
                        {/* <td className="text-start" />
                        <td className="text-start" /> */}
                        <td className="text-start">3000</td>
                        {/* <td /> */}
                      </tr>
                      {/* <tr>
                        <th className="text-start">Deduction Tax</th>
                        <td className="text-start" />
                        <td className="text-start" />
                        <td className="text-start" />
                        <td>
                          {/* Add Row Using Plus Icon */}
                      {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-plus-circle"
                            viewBox="0 0 16 16"
                            style={{ cursor: "pointer" }}
                            onClick={handleAddRow} // Add Row on Click
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                          </svg>
                        </td>
                      </tr> */}

                      {/* Dynamic Rows */}
                      {/* {rows.map((row) => (
                        <tr key={row.id}>
                          <td className="text-start">
                            <select className="form-control form-select">
                              <option selected>{row.type}</option>
                              <option>Other Type</option>
                            </select>
                          </td>
                          <td className="text-start">
                            <select className="form-control form-select">
                              <option selected>{row.charges}</option>
                              <option>Other Charges</option>
                            </select>
                          </td>
                          <td className="text-start">
                            <input
                              type="checkbox"
                              checked={row.inclusive}
                              disabled={row.inclusive}
                              readOnly
                            />
                          </td>
                          <td className="text-start"></td>
                          <td
                            className="text-start"
                            onClick={() => handleDeleteRow(row.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-dash-circle"
                              viewBox="0 0 16 16"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"></path>
                            </svg>
                          </td>
                        </tr>
                      ))} */}

                      <tr>
                        <th className="text-start">Total Deduction</th>
                        <td className="text-start" />
                        {/* <td className="" /> */}
                        {/* <td className="text-start">3540</td> */}
                        {/* <td /> */}
                      </tr>
                      <tr>
                        <th className="text-start">Payable Amount</th>
                        <td className="text-start" />
                        {/* <td className="" /> */}
                        {/* <td className="text-start" /> */}
                        {/* <td /> */}
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
                        <td className="text-start" />
                      </tr>
                      <tr>
                        <td className="text-start">Handling Charges</td>
                        <td className="text-start" />
                      </tr>
                      <tr>
                        <td className="text-start">CGST</td>
                        <td className="text-start" />
                      </tr>
                      <tr>
                        <td className="text-start">SGST</td>
                        <td className="text-start" />
                      </tr>
                      <tr>
                        <th className="text-start">Total</th>
                        <td className="text-start" />
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

                <div className="d-flex justify-content-between mt-3 me-2">
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
                </div>
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
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Other Deduction</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={123}
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="form-group">
                      <label>Other Deduction Remark</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Other Addition</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={123}
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-8 mt-2">
                    <div className="form-group">
                      <label>Other Addition Remark</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Debit Note Adjustment</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Total Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Retention Percentage</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder="%"
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Retention Amount</label>
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
                      <label>Amount Payable</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Round Off Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Favouring / Payee</label>
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
                      <label>Payment Mode</label>
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
                      <label>Payment Due Date</label>
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
                      <label>Total Certified Till Date</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-8 mt-2">
                    <div className="form-group">
                      <label>Remark</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Expected Payment Date</label>
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
                      <label>Processed Date</label>
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
                      <label>Status</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                </div>
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
                      </tr>
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
                </div>
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
                </div>
              </div>
              <div className="row">
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
              <div className="d-flex justify-content-end align-items-center gap-3 mt-2">
                <p className="mb-0">Status</p>
                <select
                  className="form-select purple-btn2"
                  style={{ width: "150px" }}
                >
                  <option value="draft">PO Draft</option>
                  <option value="accept">Accept</option>
                  <option value="reject">Reject</option>
                  <option value="submit">Submit</option>
                </select>
              </div>

              <div className="row mt-2 justify-content-end">
                <div className="col-md-2">
                  <button className="purple-btn2 w-100">Submit</button>
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
              <div className="col-md-3">
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
              </div>
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
                  <th>Tax / Charge Type</th>
                  <th>Tax / Charges per UOM (INR)</th>
                  <th>Inclusive / Exclusive</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Base Cost Row */}
                <tr>
                  <th>Total Base Cost</th>
                  <td></td>
                  <td></td>
                  <td>{selectedGRN?.base_cost || 0}</td>
                  <td></td>
                </tr>

                {/* Addition Tax & Charges Section */}
                <tr>
                  <th>Addition Tax & Charges</th>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                {formData.charges.map((charge) => (
                  <tr key={charge.id}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={charge.tax_name}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={charge.tax_charge_per_uom}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={charge.inclusive}
                        disabled={charge.tax_type !== "Charge"}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            charges: prev.charges.map((c) =>
                              c.id === charge.id
                                ? { ...c, inclusive: e.target.checked }
                                : c
                            ),
                          }));
                        }}
                      />
                    </td>
                    <td>
                      {charge.tax_type === "Charge" ? (
                        <input
                          type="number"
                          className="form-control"
                          value={charge.amount || ""}
                          onChange={(e) => {
                            const newAmount =
                              e.target.value === ""
                                ? ""
                                : parseFloat(e.target.value);
                            setFormData((prev) => ({
                              ...prev,
                              charges: prev.charges.map((c) =>
                                c.id === charge.id
                                  ? { ...c, amount: newAmount }
                                  : c
                              ),
                            }));
                          }}
                        />
                      ) : (
                        charge.amount || ""
                      )}
                    </td>
                    <td></td>
                  </tr>
                ))}

                <tr>
                  <th>Sub Total A (Addition)</th>
                  <td></td>
                  <td></td>
                  <td>
                    {formData.charges.reduce((acc, curr) => {
                      // Only add non-inclusive charges to the total
                      if (curr.tax_type === "Charge" && curr.inclusive) {
                        return acc;
                      }
                      return acc + (parseFloat(curr.amount) || 0);
                    }, 0)}
                  </td>
                  <td></td>
                </tr>

                {/* Gross Amount Row */}
                <tr>
                  <th>Gross Amount</th>
                  <td></td>
                  <td></td>
                  <td>
                    {(selectedGRN?.base_cost || 0) +
                      formData.charges.reduce((acc, curr) => {
                        // Only add non-inclusive charges to the total
                        if (curr.tax_type === "Charge" && curr.inclusive) {
                          return acc;
                        }
                        return acc + (parseFloat(curr.amount) || 0);
                      }, 0)}
                  </td>
                  <td></td>
                </tr>

                {/* Deduction Tax Section */}
                <tr>
                  <th>Deduction Tax</th>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <button
                      className="btn btn-light p-0 border-0"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          deductions: [
                            ...prev.deductions,
                            {
                              id: Date.now(),
                              tax_name: "",
                              tax_charge_per_uom: "",
                              inclusive: false,
                              amount: "",
                              tax_type: "Charge",
                            },
                          ],
                        }));
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-plus-circle"
                        viewBox="0 0 16 16"
                        style={{ cursor: "pointer" }}
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                    </button>
                  </td>
                </tr>

                {formData.deductions.map((deduction) => (
                  <tr key={deduction.id}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={deduction.tax_name}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={deduction.tax_charge_per_uom}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={deduction.inclusive}
                        disabled={deduction.tax_type !== "Charge"}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            deductions: prev.deductions.map((d) =>
                              d.id === deduction.id
                                ? { ...d, inclusive: e.target.checked }
                                : d
                            ),
                          }));
                        }}
                      />
                    </td>
                    <td>
                      {deduction.tax_type === "Charge" ? (
                        <input
                          type="number"
                          className="form-control"
                          value={deduction.amount || ""}
                          onChange={(e) => {
                            const newAmount =
                              e.target.value === ""
                                ? ""
                                : parseFloat(e.target.value);
                            setFormData((prev) => ({
                              ...prev,
                              deductions: prev.deductions.map((d) =>
                                d.id === deduction.id
                                  ? { ...d, amount: newAmount }
                                  : d
                              ),
                            }));
                          }}
                        />
                      ) : (
                        deduction.amount || ""
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-light p-0 border-0"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            deductions: prev.deductions.filter(
                              (d) => d.id !== deduction.id
                            ),
                          }));
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-dash-circle"
                          viewBox="0 0 16 16"
                          style={{ cursor: "pointer" }}
                        >
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                          <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}

                <tr>
                  <th>Sub Total B (Deductions)</th>
                  <td></td>
                  <td></td>
                  <td>
                    {formData.deductions.reduce((acc, curr) => {
                      // Only add non-inclusive deductions to the total
                      if (curr.tax_type === "Charge" && curr.inclusive) {
                        return acc;
                      }
                      return acc + (parseFloat(curr.amount) || 0);
                    }, 0)}
                  </td>
                  <td></td>
                </tr>

                {/* Payable Amount */}
                <tr>
                  <th>Payable Amount</th>
                  <td></td>
                  <td></td>
                  <td>
                    {(selectedGRN?.base_cost || 0) +
                      formData.charges.reduce((acc, curr) => {
                        // Only add non-inclusive charges to the total
                        if (curr.tax_type === "Charge" && curr.inclusive) {
                          return acc;
                        }
                        return acc + (parseFloat(curr.amount) || 0);
                      }, 0) -
                      formData.deductions.reduce((acc, curr) => {
                        // Only subtract non-inclusive deductions from the total
                        if (curr.tax_type === "Charge" && curr.inclusive) {
                          return acc;
                        }
                        return acc + (parseFloat(curr.amount) || 0);
                      }, 0)}
                  </td>
                  <td></td>
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
