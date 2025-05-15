import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { DownloadIcon, Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SingleSelector from "../components/base/Select/SingleSelector";
import { baseURL } from "../confi/apiDomain";

const BillBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actionDetails, setactionDetails] = useState(false);
  const [attachOneModal, setattachOneModal] = useState(false);

  const openAttachOneModal = () => setattachOneModal(true);
  const closeAttachOneModal = () => setattachOneModal(false);

  const actionDropdown = () => {
    setactionDetails(!actionDetails);
  };

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
    const newRow = {
      id: new Date().getTime(), // Unique ID
      type: "New Type",
      charges: "0",
      inclusive: false,
      amount: 0.0,
    };
    setRows((prevRows) => [...prevRows, newRow]); // Ensure correct state update
  };

  // Delete Row
  const handleDeleteRow = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  // Toggle Rows
  const toggleRows = () => {
    setShowRows((prev) => !prev);
  };

  const [details, setDetails] = useState(null); // State to store API data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const [selectedGRNs, setSelectedGRNs] = useState([]);
  const [status, setStatus] = useState(""); // Assuming boqDetails.status is initially available

  // Fetch data from the API
  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `${baseURL}bill_bookings/${id}?page=1&per_page=10&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      );
      setDetails(response.data); // Update state with API data
      // console.log("get data detail res",response)
      setStatus(response.data.status);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (details?.bill_purchase_orders) {
      // Extract all GRN material IDs
      const grnMaterialIds = details.bill_purchase_orders.flatMap((order) =>
        order.bill_grn_materials.map((material) => material.grn_material_id)
      );

      // Update the selectedGRNs state
      setSelectedGRNs(grnMaterialIds);
    }

    // if (details?.bill_purchase_orders) {
    //   // Extract all bill_grn_material IDs
    //   const billGrnMaterialIds = details.bill_purchase_orders.flatMap((order) =>
    //     order.bill_grn_materials.map((material) => material.id)
    //   );

    //   // Update the selectedGRNs state
    //   setSelectedGRNs(billGrnMaterialIds);
    // }
  }, [details]);
  // console.log("grn ids:",selectedGRNs)

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
        // console.log("Taxes response:", response.data);
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

  // Add useEffect to fetch tax deduction data when GRNs change
  useEffect(() => {
    const fetchTaxDeductionData = async () => {
      // console.log("selected grn ids :",selectedGRNs)
      if (selectedGRNs.length > 0) {
        try {
          // const grnIds = selectedGRNs.map((grn) => grn.id);
          const response = await axios.get(
            `${baseURL}bill_bookings/deduction_data?grns=${selectedGRNs}&token=653002727bac82324277efbb6279fcf97683048e44a7a839`
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
          // const grnIds = selectedGRNs.map((grn) => grn.id);
          const response = await axios.get(
            `${baseURL}bill_bookings/taxes_data?grns=${selectedGRNs}&token=653002727bac82324277efbb6279fcf97683048e44a7a839`
          );
          setTaxDetailsData(response.data);
        } catch (error) {
          console.error("Error fetching tax details data:", error);
        }
      }
    };

    fetchTaxDetailsData();
  }, [selectedGRNs]);

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

  const [remark, setRemark] = useState("");
  const [comment, setComment] = useState("");
  // console.log("status:",status)
  // Step 2: Handle status change
  const handleStatusChange = (selectedOption) => {
    // setStatus(e.target.value);
    setStatus(selectedOption.value);
    handleStatusChange(selectedOption); // Handle status change
  };

  // Step 3: Handle remark change
  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const payload = {
    status_log: {
      status: status,
      remarks: remark,
      comments: comment,
    },
  };

  console.log("detail status change", payload);

  const handleSubmit = async () => {
    // Prepare the payload for the API
    const payload = {
      status_log: {
        status: status,
        remarks: remark,
        comments: comment,
      },
    };

    console.log("detail status change", payload);
    setLoading(true);

    try {
      const response = await axios.patch(
        `${baseURL}bill_bookings/${id}/update_status.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        payload, // The request body containing status and remarks
        {
          headers: {
            "Content-Type": "application/json", // Set the content type header
          },
        }
      );
      await fetchDetails();

      if (response.status === 200) {
        console.log("Status updated successfully:", response.data);
        setRemark("");
        // alert('Status updated successfully');
        // Handle success (e.g., update the UI, reset fields, etc.)
        toast.success("Status updated successfully!");
      } else {
        console.log("Error updating status:", response.data);
        toast.error("Failed to update status.");
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error("Request failed:", error);
      // Handle network or other errors (e.g., show an error message)
    } finally {
      setLoading(false);
    }
  };

  // Add handleDownload function
  const handleDownload = async (blobId) => {

    try {
      const response = await axios.get(
        `${baseURL}bill_bookings/${id}/download?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&blob_id=${blobId}`,
        {
          responseType: "blob", // Important for handling binary data
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;

      // Get filename from response headers or use a default
      const filename =
        response.headers["content-disposition"]?.split("filename=")[1] ||
        "document.pdf";
      link.setAttribute("download", filename);

      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Failed to download document. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid px-3 mt-4">
          <a href="">
            Home &gt; Billing &amp; Accounts &gt; Bill Booking Details
          </a>
          <h5 className="mt-3">Bill Booking Details</h5>
          <div className="row my-4 align-items-center">
            <div className="col-md-12 ">
              <div className="card p-3">
                <div className="details_page">
                  <div className="row px-3">
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>ID</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.id}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Company</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.company_name}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Project</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.project_name}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Sub Project</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.site_name}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Supplier</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.supplier?.organization_name}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>PO Number</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.po_number}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>PO Type</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          Domestic
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Invoice Number</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.invoice_number}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>E-Invoice</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {/* {details?.einvoice} */}
                          {details?.einvoice ? "Yes" : "No"}
                          {/* {console.log("envoice",details?.einvoice)} */}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Invoice Date</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.inventory_date
                            ? new Date(
                              details.inventory_date
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                            : ""}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Invoice Amount</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.invoice_amount}
                        </label>
                      </div>
                    </div>
                    {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>PO Value</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                         
                        </label>
                      </div>
                    </div> */}
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>GSTIN</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.supplier?.gstin}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>PAN</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.supplier?.pan_number}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Type of Certificate</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.type_of_certificate}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Retention Amount Payable</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {/* {details?.retention_amount} */}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Retention Amount Paid</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Retention Amount Pending</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Department</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">GRN Details</h5>
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
                      {details?.bill_purchase_orders?.flatMap(
                        (order, orderIndex) =>
                          order.bill_grn_materials.map(
                            (material, materialIndex) => (
                              <tr key={material.id}>
                                <td className="text-start">
                                  {materialIndex + 1}
                                </td>
                                <td className="text-start">
                                  {material.material_name || ""}
                                </td>
                                <td className="text-start">
                                  {material.material_grn_amount || ""}
                                </td>
                                <td className="text-start">{""}</td>
                                <td className="text-start">
                                  {material.base_cost || ""}
                                </td>
                                <td className="text-start">
                                  {material.net_taxes || ""}
                                </td>
                                <td className="text-start">
                                  {material.net_charges || ""}
                                </td>
                                <td className="text-start">
                                  {material.qty || ""}
                                </td>
                                <td className="text-start">
                                  {material.all_inc_tax || ""}
                                </td>
                              </tr>
                            )
                          )
                      )}
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
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Tax Deduction</h5>
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
                            taxDeductionData.total_deduction_cost}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Tax Details</h5>
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
                      <tr>
                        <th className="text-start">Total</th>
                        <td className="text-start">
                          {Object.values(taxDetailsData.tax_data).reduce(
                            (sum, value) => sum + (value || 0),
                            0
                          ) + taxDeductionData.total_material_cost}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Advance Adjusted</h5>
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
                </div> */}
                <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Advance Details</h5>
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
                  <h5 className=" ">Advance Deductions</h5>
                </div>
                <div className="details_page">
                  <div className="row px-3">
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Other Deduction</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.other_deductions}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Other Deduction Remark</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.other_deduction_remarks}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Other Addition</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.other_additions}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Other Addition Remark</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.other_addition_remarks}
                        </label>
                      </div>
                    </div>
                    {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Debit Note Adjustment</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                         
                        </label>
                      </div>
                    </div> */}
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Total Amount</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.total_amount}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Retention Percentage</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>{" "}
                          {details?.retention_per}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Retention Amount</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.retention_amount}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Amount Payable</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.payable_amount}
                        </label>
                      </div>
                    </div>
                    {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Round Off Amount</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                        
                        </label>
                      </div>
                    </div> */}
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Favouring / Payee</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.payee_name}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Payment Mode</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.payment_mode}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Payment Due Date</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.payment_due_date
                            ? new Date(
                              details.payment_due_date
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                            : ""}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Total Certified Till Date</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Remark</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.remark}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Expected Payment Date</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Processed Date</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Status</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">
                            <span className="text-dark">:</span>
                          </span>
                          {details?.status}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Advance Adjusted</h5>
                </div> */}
                {/* <div className="tbl-container mx-3 mt-3">
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
                        <td className="text-start"></td>
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
                        <td className="text-start"></td>
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
                {/* <div className="d-flex justify-content-between mt-3 me-2">
                  <h5 className=" ">Debit Note</h5>
                </div> */}
                {/* <div className="tbl-container mx-3 mt-3">
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
                        <td className="text-start"></td>
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
                      {details?.attachments?.map((attachment, index) => (
                        <tr key={attachment.id}>
                          <td className="text-start">{index + 1}</td>
                          <td className="text-start">
                            {attachment.relation || ""}
                          </td>
                          <td className="text-start">
                            {attachment.filename || ""}
                          </td>
                          <td className="text-start">
                            {attachment.content_type || ""}
                          </td>
                          <td className="text-start">
                            {attachment.created_at
                              ? new Date(
                                attachment.created_at
                              ).toLocaleDateString()
                              : ""}
                          </td>
                          <td className="text-start">
                            {/* <button
                              className="btn btn-link p-0 text-decoration-underline"
                              onClick={() => handleDownload(attachment.blob_id)}
                            >
                              <DownloadIcon />
                            </button> */}

                            <a
                              href={
                                // {`${baseURL}rfq/events/${eventId}/download?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&blob_id=${attachment.blob_id}`}
                                `${baseURL}bill_bookings/${id}/download?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&blob_id=${attachment.blob_id}`
                              }
                              download={attachment.filename}
                            >
                              <DownloadIcon />
                            </a>
                          </td>
                        </tr>
                      ))}
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
                      placeholder="Enter Remark ..."
                      defaultValue={""}
                      value={remark}
                      onChange={handleRemarkChange}
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
                      placeholder="Enter Comment ..."
                      defaultValue={""}
                      value={comment}
                      onChange={handleCommentChange}
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
                      onChange={handleStatusChange}
                      // options.find(option => option.value === status)
                      // value={filteredOptions.find(option => option.value === status)}
                      value={statusOptions.find(
                        (option) => option.value === status
                      )}
                      placeholder="Select Status"
                      isClearable={false}
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-2 justify-content-end">
                <div className="col-md-2">
                  <button className="purple-btn2 w-100" onClick={handleSubmit}>
                    Submit
                  </button>
                </div>
                <div className="col-md-2">
                  <button className="purple-btn1 w-100">Cancel</button>
                </div>
              </div>
              <h5 className=" mt-3">Audit Log</h5>
              <div className="mx-0 mb-5 pb-4">
                {/* <Table columns={auditLogColumns} data={auditLogData} /> */}

                <div className="tbl-container mt-1">
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
                      {details?.status_logs?.map((log, index) => (
                        <tr key={log.id}>
                          <td>{index + 1}</td>
                          <td>{""}</td>
                          <td>
                            {log.created_at
                              ? `${new Date(log.created_at).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}      ${new Date(log.created_at).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                // second: "2-digit",
                                hour12: true,
                              })}`
                              : ""}
                          </td>
                          <td>{log.status ? log.status.charAt(0).toUpperCase() + log.status.slice(1) : ""}</td>
                          <td>{log.remarks || ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
              {/* <button className="purple-btn1 w-100" fdprocessedid="af5l5g">
                Close
              </button> */}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BillBookingDetails;
