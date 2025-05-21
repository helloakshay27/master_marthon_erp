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

  const [selectGRNModal, setselectGRNModal] = useState(false);

  const [attachThreeModal, setattachThreeModal] = useState(false);
  const navigate = useNavigate();

  // calculation for tax details table
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

  // const closeSelectPOModal = () => setselectPOModal(false);

  const openSelectGRNModal = () => setselectGRNModal(true);
  const closeSelectGRNModal = () => setselectGRNModal(false);

  const closeAttachThreeModal = () => setattachThreeModal(false);

  const [showRows, setShowRows] = useState(true);

  // company project subproject api

  // Add New Row

  // Add new state variables for API data
  const today = new Date().toISOString().split("T")[0];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);
  const [selectedGRN, setSelectedGRN] = useState(null);
  const [selectedGRNs, setSelectedGRNs] = useState([]);

  // Add this array at the top of your component
  const paymentModeOptions = [
    { value: "Bank Advice", label: "Bank Advice" },
    { value: "Cash", label: "Cash" },
    { value: "Cheque Local", label: "Cheque Local" },
    { value: "Cheque OutStation", label: "Cheque OutStation" },
    { value: "CreditCard", label: "CreditCard" },
    { value: "Demand Draft", label: "Demand Draft" },
    { value: "Direct Remittance", label: "Direct Remittance" },
    { value: "Interest Waive off", label: "Interest Waive off" },
    {
      value: "Online Payment from Portal/App",
      label: "Online Payment from Portal/App",
    },
    { value: "Others", label: "Others" },
    { value: "TDS", label: "TDS" },
  ];

  // Add this at the top with other state declarations
  const getFormattedDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Add this useEffect to ensure date is set and maintained
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      invoiceDate: getFormattedDate(),
    }));
  }, []); // Empty dependency array means this runs once on mount

  const [formData, setFormData] = useState({
    poNumber: "",
    poDate: "",
    poValue: "",
    gstin: "",
    pan: "",
    invoiceNumber: "",
    invoiceDate: getFormattedDate(), // Initial date
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

  const [billEntryOptions, setBillEntryOptions] = useState([]);
  const [selectedBillEntry, setSelectedBillEntry] = useState(null);
  // ...existing code...
  const [supplierName, setSupplierName] = useState("");
  const [displayCompany, setDisplayCompany] = useState("");
  const [displayProject, setDisplayProject] = useState("");
  const [displaySite, setDisplaySite] = useState("");
  const [displayCompanyId, setDisplayCompanyId] = useState(null);
  const [displayProjectId, setDisplayProjectId] = useState(null);
  const [displaySiteId, setDisplaySiteId] = useState(null);
  // ...existing code...

  useEffect(() => {
    const fetchBillEntries = async () => {
      try {
        const response = await axios.get(
          "https://marathon.lockated.com/bill_bookings/bill_entry_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        );
        if (response.data && Array.isArray(response.data.be_list)) {
          setBillEntryOptions(
            response.data.be_list.map((item) => ({
              value: item.value,
              label: item.name,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching bill entries:", error);
      }
    };
    fetchBillEntries();
  }, []);

  // ...existing imports...
  // Add this useEffect after your billEntryOptions and selectedBillEntry state

  useEffect(() => {
    if (selectedBillEntry && selectedBillEntry.value) {
      const fetchBillEntryDetails = async () => {
        try {
          const response = await axios.get(
            `https://marathon.lockated.com/bill_entries/${selectedBillEntry.value}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
          );
          const data = response.data;

          setFormData((prev) => ({
            ...prev,
            poNumber: data.po_number || data.purchase_order?.po_number || "",
            poValue: data.purchase_order?.total_value || "",
            gstin: data.gstin || "",
            pan: data.pan_no || "",
            pms_supplier_id: data.pms_supplier_id || null, // <-- Add this line
            invoiceAmount: data.bill_amount || "", // <-- Add this line
            totalAmount: data.bill_amount || "", // <-- Add this line
          }));

          setSupplierName(data.pms_supplier || "");
          setDisplayCompany(data.company_name || "");
          setDisplayProject(data.project_name || "");
          setDisplaySite(data.site_name || "");
          setDisplayCompanyId(data.company_id || null);
          setDisplayProjectId(data.project_id || null);
          setDisplaySiteId(data.site_id || null);

          // Fetch PO GRN details using purchase_order.id
          if (data.purchase_order?.id) {
            const grnResponse = await axios.get(
              `https://marathon.lockated.com/purchase_orders/grn_details.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1&per_page=10&q[id_in]=${data.purchase_order.id}`
            );

            // Set the selected PO with GRN materials
            const poWithGrn = {
              ...data.purchase_order,
              grn_materials:
                grnResponse.data.purchase_orders[0]?.grn_materials || [],
              gstin: data.gstin,
              pan: data.pan_no,
            };
            setSelectedPO(poWithGrn);

            // Reset selected GRNs instead of auto-selecting them
            setSelectedGRNs([]);
          } else {
            setSelectedPO({
              id: data.purchase_order?.id,
              po_number: data.purchase_order?.po_number,
              po_date: data.purchase_order?.po_date,
              total_value: data.purchase_order?.total_value,
              po_type: data.purchase_order?.po_type,
              gstin: data.gstin,
              pan: data.pan_no,
              grn_materials: [],
            });
            setSelectedGRNs([]);
          }
        } catch (error) {
          console.error("Error fetching bill entry or PO GRN details:", error);
        }
      };
      fetchBillEntryDetails();
    }
  }, [selectedBillEntry]);

  useEffect(() => {
    if (!selectedBillEntry) {
      setFormData((prev) => ({
        ...prev,
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
      }));
      setSupplierName("");
      setSelectedPO(null);
      setSelectedGRN(null);
      setSelectedGRNs([]);
      setPendingAdvances([]);
      setCreditNotes([]);
      setDebitNotes([]);
    }
  }, [selectedBillEntry]);

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
  const areAllGRNsSelected =
    selectedPO &&
    Array.isArray(selectedPO.grn_materials) &&
    selectedPO.grn_materials.length > 0 &&
    selectedGRNs.length === selectedPO.grn_materials.length;

  // Handler for header checkbox
  const handleSelectAllGRNs = (e) => {
    if (e.target.checked) {
      setSelectedGRNs(selectedPO.grn_materials);
    } else {
      setSelectedGRNs([]);
    }
  };

  // Handle GRN submission
  const handleGRNSubmit = () => {
    // setSelectedGRN(selectedGRNs[0]); // Set the first selected GRN as the main selected GRN
    closeSelectGRNModal();
  };

  // Render GRN table in modal
  const renderGRNTable = () => {
    if (!selectedPO || !Array.isArray(selectedPO.grn_materials)) return null;

    return (
      <div className="tbl-container mx-3 mt-3">
        <table className="w-100">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={areAllGRNsSelected}
                  onChange={handleSelectAllGRNs}
                />
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
      // !selectedCompany ||
      // !selectedProject ||
      // !selectedSite ||
      !selectedPO ||
      selectedGRNs.length === 0 ||
      !formData.invoiceNumber || // Invoice Number mandatory
      !formData.invoiceAmount // Invoice Amount mandatory
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Invoice amount check
    const baseCost = getSelectedGRNsBaseCost();
    const allInclusiveCost = getSelectedGRNsAllIncTax();
    const otherDeduction = parseFloat(otherDeductions) || 0;
    const otherAddition = parseFloat(otherAdditions) || 0;
    const totalAmount = parseFloat(calculateTotalAmount()) || 0;
    const invoiceAmount = parseFloat(formData.invoiceAmount) || 0;
    const payableAmount = parseFloat(calculateAmountPayable()) || 0;
    const retentionAmount = parseFloat(calculateRetentionAmount()) || 0;

    if (invoiceAmount < payableAmount) {
      alert("Invoice Amount should not be less than Payable Amount.");
      return;
    }

    // Build debit and credit note adjustment arrays
    const debit_note_adjustment = selectedDebitNotes.map((note) => ({
      id: note.id,
      value: parseFloat(note.this_recovery) || 0,
    }));
    const credit_note_adjustment = selectedCreditNotes.map((note) => ({
      id: note.id,
      value: parseFloat(note.this_recovery) || 0,
    }));

    setLoading(true);

    try {
      const payload = {
        bill_booking: {
          // company_id: selectedCompany?.value || null,
          // site_id: selectedSite?.value || null,
          // project_id: selectedProject?.value || null,
          company_id: displayCompanyId,
          site_id: displaySiteId,
          project_id: displayProjectId,
          pms_supplier_id: formData.pms_supplier_id || null,
          invoice_number: formData.invoiceNumber,
          einvoice: selectedEInvoice?.value === "yes",
          inventory_date: formData.invoiceDate,
          invoice_amount: parseFloat(formData.invoiceAmount),
          type_of_certificate: formData.typeOfCertificate,
          department_id: formData.departmentId,
          base_cost: baseCost,
          all_inclusive_cost: allInclusiveCost,
          other_deduction: otherDeduction,
          other_addition: otherAddition,
          total_amount: totalAmount,
          other_deduction_remarks: formData.otherDeductionRemarks,
          other_addition_remarks: formData.otherAdditionRemarks,
          retention_per: parseFloat(formData.retentionPercentage) || 0,
          retention_amount: retentionAmount,
          total_value: taxDeductionData.total_material_cost,
          payable_amount: payableAmount,
          remark: formData.remark || "",
          status: "draft",
          po_type: "domestic",
          payee_name: formData.pms_supplier_id || null,
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
          debit_note_adjustment,
          credit_note_adjustment,
        },
      };

      console.log("Payload for API:", payload);

      const response = await axios.post(
        `${baseURL}bill_bookings?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        payload
      );

      if (response.data) {
        alert("Bill booking created successfully!");
        setLoading(false);
        // navigate("/bill-booking-list"); // Redirect to bill-booking-list
        // Reset form or redirect as needed
      }
    } catch (error) {
      console.error("Error creating bill booking:", error);
      alert("Failed to create bill booking. Please try again.");
    } finally {
      setLoading(false);
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

  // useEffect(() => {
  //   const fetchPendingAdvances = async () => {
  //     if (selectedPO?.id) {
  //       try {
  //         const response = await axios.get(
  //           `${baseURL}advance_notes?q[purchase_order__id_eq]=${selectedPO.id}`
  //         );
  //         setPendingAdvances(response.data.advance_notes || []);
  //       } catch (error) {
  //         console.error("Error fetching pending advances:", error);
  //         setPendingAdvances([]);
  //       }
  //     }
  //   };

  //   fetchPendingAdvances();
  // }, [selectedPO]);

  const [creditNotes, setCreditNotes] = useState([]);
  const [debitNotes, setDebitNotes] = useState([]);
  // Add these state variables at the top
  const [creditNoteModal, setCreditNoteModal] = useState(false);
  const [debitNoteModal, setDebitNoteModal] = useState(false);
  const [selectedCreditNotes, setSelectedCreditNotes] = useState([]);
  const [selectedDebitNotes, setSelectedDebitNotes] = useState([]);

  // Add these handlers
  const handleCreditNoteSelect = (note) => {

    setSelectedCreditNotes((prev) => {
      const isSelected = prev.some((n) => n.id === note.id);
      if (isSelected) {
        return prev.filter((n) => n.id !== note.id);
      } else {
        return [...prev, note];
      }
    });
  };

  const handleDebitNoteSelect = (note) => {
    setSelectedDebitNotes((prev) => {
      const isSelected = prev.some((n) => n.id === note.id);
      if (isSelected) {
        return prev.filter((n) => n.id !== note.id);
      } else {
        return [...prev, note];
      }
    });
  };

  // Add modal toggle handlers
  const openCreditNoteModal = () => setCreditNoteModal(true);
  const closeCreditNoteModal = () => setCreditNoteModal(false);
  const openDebitNoteModal = () => setDebitNoteModal(true);
  const closeDebitNoteModal = () => setDebitNoteModal(false);

  useEffect(() => {
    const fetchCreditAndDebitNotes = async () => {
      if (formData.pms_supplier_id) {
        try {
          // Fetch Credit Notes
          const creditResponse = await axios.get(
            `${baseURL}credit_notes?q[pms_supplier_id_eq]=${formData.pms_supplier_id}&q[status_eq]=proceed&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
          );
          setCreditNotes(creditResponse.data.credit_notes || []);

          // Fetch Debit Notes
          const debitResponse = await axios.get(
            `${baseURL}debit_notes?q[pms_supplier_id_eq]=${formData.pms_supplier_id}&q[status_eq]=proceed&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
          );
          setDebitNotes(debitResponse.data.debit_notes || []);
          console.log("Supplier ID for debit notes:", formData.pms_supplier_id);
        } catch (error) {
          console.error("Error fetching credit or debit notes:", error);
          setCreditNotes([]);
          setDebitNotes([]);
        }
      }
    };

    fetchCreditAndDebitNotes();
  }, [selectedPO, formData.pms_supplier_id]);

  // Add these handler functions if not already present
  

  const handleSelectAllCreditNotes = (e) => {
    if (e.target.checked) {
      setSelectedCreditNotes(creditNotes);
    } else {
      setSelectedCreditNotes([]);
    }
  };

  const handleSelectAllDebitNotes = (e) => {
    if (e.target.checked) {
      setSelectedDebitNotes(debitNotes);
    } else {
      setSelectedDebitNotes([]);
    }
  };

  const validateCreditRecovery = (note, value) => {
    const recovery = parseFloat(value) || 0;
    const creditAmount = parseFloat(note.credit_note_amount) || 0;

    // const outstandingAmount = parseFloat(note.outstanding_current_date) || 0;
    if (recovery > creditAmount) {
      alert("Recovery amount cannot exceed credit amount");
      return false;
    }
    return true;
  };

  const validateDebitRecovery = (note, value) => {
    const recovery = parseFloat(value) || 0;
    const debitAmount = parseFloat(note.debit_note_amount) || 0;
    // const outstandingAmount = parseFloat(note.outstanding_current_date) || 0;
    if (recovery > debitAmount) {
      alert("Recovery amount cannot exceed  debit amount");
      return false;
    }
    return true;
  };

  // Add these helper functions above your return statement

  const calculateTotalAmount = () =>
    selectedGRNs.reduce(
      (acc, grn) => acc + (parseFloat(grn.all_inc_tax) || 0),
      0
    );

  // const calculateAmountPayable = () =>
  //   calculateTotalAmount() +
  //   parseFloat(otherAdditions || 0) -
  //   parseFloat(otherDeductions || 0);
  // ...existing code...

  const calculateAmountPayable = () => {
    const totalAmount = parseFloat(calculateTotalAmount()) || 0;
    const retentionAmount = parseFloat(calculateRetentionAmount()) || 0;
    const otherDed = parseFloat(otherDeductions) || 0;
    const otherAdd = parseFloat(otherAdditions) || 0;
    const creditAdjustment = parseFloat(calculateCreditNoteAdjustment()) || 0;
    const debitAdjustment = parseFloat(calculateDebitNoteAdjustment()) || 0;

    return (
      totalAmount -
      retentionAmount -
      otherDed +
      otherAdd +
      creditAdjustment -
      debitAdjustment
    ).toFixed(2);
  };

  // ...existing code...

  // 1. Add a function to calculate updated values based on rows
  const calculateUpdatedGRNValues = () => {
    let netCharges = 0;
    let netTaxes = 0;
    let baseCost = parseFloat(selectedGRN?.base_cost) || 0;

    rows.forEach((row) => {
      if (["Handling Charges", "Other charges", "Freight"].includes(row.type)) {
        netCharges += parseFloat(row.amount) || 0;
      }
      if (["IGST", "SGST", "CGST"].includes(row.type)) {
        netTaxes += parseFloat(row.amount) || 0;
      }
    });

    // All Inclusive Cost = base cost + net charges + net taxes
    const allIncTax = baseCost + netCharges + netTaxes;

    return {
      net_charges: netCharges.toFixed(2),
      net_taxes: netTaxes.toFixed(2),
      all_inc_tax: allIncTax.toFixed(2),
    };
  };

  // 2. Add a handler for submitting the Tax & Charges modal
  // ...existing code...

  const handleTaxChargesSubmit = () => {
    if (!selectedGRN) return;

    const updatedValues = calculateUpdatedGRNValues();
    const updatedGRN = {
      ...selectedGRN,
      base_cost: selectedGRN.base_cost, // or the new value if edited
      net_charges: updatedValues.net_charges,
      net_taxes: updatedValues.net_taxes,
      all_inc_tax: updatedValues.all_inc_tax,
      tax_charge_rows: rows,
    };
    setSelectedGRNs((prev) =>
      prev.map((grn) => (grn.id === selectedGRN.id ? updatedGRN : grn))
    );
    setSelectedGRN(updatedGRN);

    // Close both modals
    setattachThreeModal(false); // Close Tax & Charges modal
    closeSelectGRNModal(); // Close GRN Information modal
  };

  // ...existing code...

  const getSelectedGRNsBaseCost = () =>
    selectedGRNs.reduce(
      (sum, grn) => sum + (parseFloat(grn.base_cost) || 0),
      0
    );

  const getSelectedGRNsAllIncTax = () =>
    selectedGRNs.reduce(
      (sum, grn) => sum + (parseFloat(grn.all_inc_tax) || 0),
      0
    );

  // ...existing code...

  // Helper to calculate retention amount
  const calculateRetentionAmount = () => {
    const percentage = parseFloat(formData.retentionPercentage) || 0;
    const totalAmount = parseFloat(calculateTotalAmount()) || 0;
    return ((percentage / 100) * totalAmount).toFixed(2);
  };

  // Add these calculation functions after the existing calculation functions
  const calculateCreditNoteAdjustment = () => {
    return selectedCreditNotes
      .reduce((total, note) => {
        return total + (parseFloat(note.this_recovery) || 0);
      }, 0)
      .toFixed(2);
  };

  const calculateDebitNoteAdjustment = () => {
    return selectedDebitNotes
      .reduce((total, note) => {
        return total + (parseFloat(note.this_recovery) || 0);
      }, 0)
      .toFixed(2);
  };

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
                      <span> *</span>
                      <input
                        className="form-control"
                        type="text"
                        value={displayCompany}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="event-no-select">Project</label>
                    <span> *</span>
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        value={displayProject}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="event-no-select"> SubProject</label>
                    <span> *</span>
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        value={displaySite}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mt-2">
                    <label htmlFor="event-no-select">Bill Entries</label>
                    <span> *</span>
                    <div className="form-group">
                      <SingleSelector
                        options={billEntryOptions}
                        onChange={setSelectedBillEntry}
                        value={selectedBillEntry}
                        placeholder="Select Bill Entry"
                      />
                    </div>
                  </div>

                  <div className="col-md-4  mt-2">
                    <div className="form-group">
                      <label>Supplier</label>
                      {/* <SingleSelector
                        options={supplierOptions}
                        className="form-control form-select"
                        // value={selectedSupplier}
                        // onChange={(selected) => setSelectedSupplier(selected)}
                        placeholder="Select Supplier"
                        
                      /> */}
                      <input
                        className="form-control"
                        type="text"
                        value={supplierName}
                        disabled
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
                      <span> *</span>
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

                      <input
                        className="form-control"
                        type="text"
                        value={formData.poNumber}
                        disabled
                      />
                    </div>
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
                      <span> *</span>
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
                        type="text"
                        value={formData.invoiceDate || getFormattedDate()} // Fallback to current date if empty
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-3">
                    <div className="form-group">
                      <label>Invoice Amount</label>
                      <span> *</span>
                      {/* <input
                        className="form-control"
                        type="number"
                        value={formData.invoiceAmount}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            invoiceAmount: e.target.value,
                            // totalAmount: e.target.value, // Keep in sync
                          }))
                        }
                      /> */}
                      <input
                        className="form-control"
                        type="number"
                        value={formData.invoiceAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            invoiceAmount: value,
                          }));
                          // Live validation (optional)
                          const invoice = parseFloat(value) || 0;
                          const payable =
                            parseFloat(calculateAmountPayable()) || 0;
                          if (invoice < payable) {
                            // Optionally show a warning here
                            // e.g. setInvoiceError("Invoice Amount should not be less than Payable Amount.");
                          } else {
                            // setInvoiceError("");
                          }
                        }}
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
                        options={[
                          { value: "Regular", label: "Regular" },
                          { value: "Retention", label: "Retention" },
                        ]}
                        className="form-control form-select"
                        value={
                          formData.typeOfCertificate
                            ? {
                                value: formData.typeOfCertificate,
                                label: formData.typeOfCertificate,
                              }
                            : null
                        }
                        onChange={(selected) =>
                          setFormData((prev) => ({
                            ...prev,
                            typeOfCertificate: selected ? selected.value : "",
                          }))
                        }
                        placeholder="Select Type"
                      />
                    </div>
                  </div>
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
                      {/* <tr>
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
                      </tr> */}
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
                {/* <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Advance Adjusted:</h5>
                </div> */}
                {/* <div className="tbl-container mx-3 mt-3">
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
                </div> */}
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
                      <label>Base Cost</label>
                      <input
                        className="form-control"
                        type="number"
                        // value={formData.currentAdvanceDeduction}
                        // onChange={(e) =>
                        //   setFormData((prev) => ({
                        //     ...prev,
                        //     currentAdvanceDeduction: e.target.value,
                        //   }))
                        // }  base cost should be grn seleted base cost
                        // placeholder="Enter advance deduction amount"
                        value={getSelectedGRNsBaseCost()}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>All Inclusive Cost</label>
                      <input
                        className="form-control"
                        type="number"
                        value={getSelectedGRNsAllIncTax()}
                        // value={formData.currentAdvanceDeduction}
                        // onChange={(e) =>
                        //   setFormData((prev) => ({
                        //     ...prev,
                        //     currentAdvanceDeduction: e.target.value,
                        //   }))
                        // all inclusive cost should be grn seleted all inclusive cost
                        // }
                        placeholder="Enter advance deduction amount"
                        disabled
                      />
                    </div>
                  </div>

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
                        disabled
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
                      <label>Credit Note Adjustment</label>
                      <input
                        className="form-control"
                        type="number"
                        value={calculateCreditNoteAdjustment()}
                        disabled
                        placeholder="Credit note adjustment amount"
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Debit Note Adjustment</label>
                      <input
                        className="form-control"
                        type="number"
                        value={calculateDebitNoteAdjustment()}
                        disabled
                        placeholder="Debit note adjustment amount"
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Total Amount</label>

                      <input
                        className="form-control"
                        type="number"
                        // value={selectedGRNs.reduce(
                        //   (acc, grn) =>
                        //     acc + (parseFloat(grn.all_inc_tax) || 0),
                        //   0
                        // )}
                        value={calculateTotalAmount()}
                        // value={formData.totalAmount}
                        // onChange={(e) =>
                        //   setFormData((prev) => ({
                        //     ...prev,
                        //     totalAmount: e.target.value,
                        //     invoiceAmount: e.target.value, // keep in sync
                        //   }))
                        // }
                        placeholder="Enter other addition amount"
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
                        value={calculateRetentionAmount()}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label> Amount Payable</label>

                      <input
                        className="form-control"
                        type="number"
                        // value={otherAdditions}
                        // onChange={(e) => setOtherAdditions(e.target.value)}
                        value={calculateAmountPayable()}
                        readOnly
                        placeholder="Enter other addition amount"
                        // amount payable should be total amount - retention amount
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Round Of Amount</label>

                      <input
                        className="form-control"
                        type="number"
                        // value={otherAdditions}
                        // onChange={(e) => setOtherAdditions(e.target.value)}
                        placeholder="Enter other addition amount"
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Favouring / Payee</label>
                      <input
                        className="form-control"
                        type="text"
                        // value={formData.payeeName}
                        // onChange={(e) =>
                        //   setFormData((prev) => ({
                        //     ...prev,
                        //     payeeName: e.target.value,
                        //   }))
                        value={supplierName}
                        disabled
                        placeholder="Enter payee name"
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Payment Mode</label>
                      <SingleSelector
                        options={paymentModeOptions}
                        className="form-control form-select"
                        value={
                          paymentModeOptions.find(
                            (opt) => opt.value === formData.paymentMode
                          ) || null
                        }
                        onChange={(selected) =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentMode: selected ? selected.value : "",
                          }))
                        }
                        placeholder="Select Payment Mode"
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

                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Debit Note</h5>
                  <button className="purple-btn2" onClick={openDebitNoteModal}>
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
                    <span>Select Debit Note</span>
                  </button>
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
                    {/* <tbody>
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
                    </tbody> */}
                    <tbody>
                      {selectedDebitNotes.length > 0 ? (
                        selectedDebitNotes.map((note, index) => (
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
                            {/* <td className="text-start">
                              {note.this_recovery || "-"}
                            </td> */}
                            <td className="text-start">
                              <input
                                type="number"
                                className="form-control"
                                value={note.this_recovery || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (validateDebitRecovery(note, value)) {
                                    setSelectedDebitNotes((prev) =>
                                      prev.map((n) =>
                                        n.id === note.id
                                          ? { ...n, this_recovery: value }
                                          : n
                                      )
                                    );
                                  }
                                }}
                                min="0"
                                max={note.debit_note_amount}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-start" colSpan="10">
                            No debit notes selected.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Credit Note</h5>
                  <button className="purple-btn2" onClick={openCreditNoteModal}>
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
                    <span>Select Credit Note</span>
                  </button>
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
                    {/* <tbody>
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
                    </tbody> */}
                    <tbody>
                      {selectedCreditNotes.length > 0 ? (
                        selectedCreditNotes.map((note, index) => (
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
                              <input
                                type="number"
                                className="form-control"
                                value={note.this_recovery || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (validateCreditRecovery(note, value)) {
                                    setSelectedCreditNotes((prev) =>
                                      prev.map((n) =>
                                        n.id === note.id
                                          ? { ...n, this_recovery: value }
                                          : n
                                      )
                                    );
                                  }
                                }}
                                min="0"
                                max={note.credit_note_amount}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-start" colSpan="10">
                            No credit notes selected.
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
                      // { label: "view", key: "view" },
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
                    isAccordion={false}
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
                    // disabled={isSubmitting}
                  >
                    Submit
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
          <p>loading...</p>
        </div>
      )}
      {/* modal */}
      {/* 
      {/*  */}
      <Modal
        centered
        size="xl"
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
      {/*  */}
      <Modal
        centered
        size="xl"
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
                    <input
                      type="number"
                      className="form-control"
                      value={selectedGRN?.base_cost}
                      onChange={(e) => {
                        const newBaseCost = parseFloat(e.target.value) || 0;
                        setSelectedGRN((prev) => ({
                          ...prev,
                          base_cost: newBaseCost,
                        }));
                      }}
                    />
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
            <div className="d-flex justify-content-center mt-3">
              <button
                className="purple-btn2"
                // onClick={handleSubmit}
                // disabled={isSubmitting}
                onClick={handleTaxChargesSubmit}
              >
                {/* {isSubmitting ? "Submitting..." : "Submit"} */}
                Submitt
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* Credit Note Modal */}
      // Update the Credit Note Modal table structure
      <Modal
        centered
        size="xl"
        show={creditNoteModal}
        onHide={closeCreditNoteModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Credit Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="tbl-container">
            <table className="w-100">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        creditNotes.length > 0 &&
                        selectedCreditNotes.length === creditNotes.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCreditNotes(creditNotes);
                        } else {
                          setSelectedCreditNotes([]);
                        }
                      }}
                    />
                  </th>
                  <th className="text-start">Credit Note No.</th>
                  <th className="text-start">PO Display No.</th>
                  <th className="text-start">Project</th>
                  <th className="text-start">Credit Note Amount</th>
                  <th className="text-start">Recovery Till Date</th>
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
                  creditNotes.map((note) => (
                    <tr key={note.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedCreditNotes.some(
                            (n) => n.id === note.id
                          )}
                          onChange={() => handleCreditNoteSelect(note)}
                        />
                      </td>
                      <td className="text-start">
                        {note.credit_note_no || "-"}
                      </td>
                      <td className="text-start">{note.po_number || "-"}</td>
                      <td className="text-start">{note.project_name || "-"}</td>
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
                      <td className="text-start">{note.reason_type || "-"}</td>
                      <td className="text-start">
                        {note.this_recovery || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center">
                      No credit notes available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-3">
              <button
                className="purple-btn2 w-100"
                onClick={closeCreditNoteModal}
                disabled={selectedCreditNotes.length === 0}
              >
                Submit
              </button>
            </div>
            <div className="col-md-3">
              <button
                className="purple-btn1 w-100"
                onClick={closeCreditNoteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* Update the Debit Note Modal with similar structure */}
      <Modal
        centered
        size="xl"
        show={debitNoteModal}
        onHide={closeDebitNoteModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Debit Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="tbl-container">
            <table className="w-100">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        debitNotes.length > 0 &&
                        selectedDebitNotes.length === debitNotes.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDebitNotes(debitNotes);
                        } else {
                          setSelectedDebitNotes([]);
                        }
                      }}
                    />
                  </th>
                  <th className="text-start">Debit Note No.</th>
                  <th className="text-start">PO Display No.</th>
                  <th className="text-start">Project</th>
                  <th className="text-start">Debit Note Amount</th>
                  <th className="text-start">Recovery Till Date</th>
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
                  debitNotes.map((note) => (
                    <tr key={note.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedDebitNotes.some(
                            (n) => n.id === note.id
                          )}
                          onChange={() => handleDebitNoteSelect(note)}
                        />
                      </td>
                      <td className="text-start">
                        {note.debit_note_no || "-"}
                      </td>
                      <td className="text-start">{note.po_number || "-"}</td>
                      <td className="text-start">{note.project_name || "-"}</td>
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
                      <td className="text-start">{note.reason_type || "-"}</td>
                      <td className="text-start">
                        {note.this_recovery || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center">
                      No debit notes available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-3">
              <button
                className="purple-btn2 w-100"
                onClick={closeDebitNoteModal}
                disabled={selectedDebitNotes.length === 0}
              >
                Submit
              </button>
            </div>
            <div className="col-md-3">
              <button
                className="purple-btn1 w-100"
                onClick={closeDebitNoteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BillBookingCreate;
