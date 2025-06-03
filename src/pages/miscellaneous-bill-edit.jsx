import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Table } from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import axios from "axios";
import { useParams } from "react-router-dom";
import SingleSelector from "../components/base/Select/SingleSelector";
import { baseURL } from "../confi/apiDomain";
import { DownloadIcon } from "../components";
import CreditNoteDetails from "./credit-note-details";
const MiscellaneousBillEdit = () => {
  const { id } = useParams();
  const [showRows, setShowRows] = useState(false);
  const [creditNoteData, setCreditNoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(""); // Assuming boqDetails.status is initially available

  // Fetch credit note data
  const fetchCreditNoteData = async () => {
    try {
      const response = await axios.get(
        `${baseURL}miscellaneous_bills/${id}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      );
      setCreditNoteData(response.data);
      setStatus(response.data.status)
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  useEffect(() => {


    fetchCreditNoteData(id);
  }, [id]);

  // tax table functionality
//   const [rows, setRows] = useState([
//     {
//       id: 1,
//       type: "TDS 1",
//       charges: "100",
//       inclusive: false,
//       amount: 50.0,
//     },
//   ]);

  // Toggle visibility of rows
  const toggleRows = () => {
    setShowRows((prev) => !prev);
  };

//   // Delete a specific row
//   const deleteRow = (id) => {
//     setRows((prevRows) => prevRows.filter((row) => row.id !== id));
//   };

//   // Calculate Sub Total (Addition)
//   const calculateSubTotal = () => {
//     return rows.reduce((total, row) => total + row.amount, 0).toFixed(2);
//   };

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Function to handle the next step
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Function to handle the previous step
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };


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
      label: "Submitted",
      value: "submitted",
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
        `${baseURL}credit_notes/${id}/update_status.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        payload, // The request body containing status and remarks
        {
          headers: {
            "Content-Type": "application/json", // Set the content type header
          },
        }
      );
      await fetchCreditNoteData();

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

   const [rows, setRows] = useState([
      { id: 1, type: "Handling Charges", percentage: "", inclusive: false, amount: '', isEditable: false, addition: true, resource_id: 2, resource_type: "TaxCharge" },
      { id: 2, type: "Other charges", percentage: "", inclusive: false, amount: '', isEditable: false, addition: true, resource_id: 4, resource_type: "TaxCharge" },
      { id: 3, type: "Freight", percentage: "", inclusive: false, amount: ' ', isEditable: false, addition: true, resource_id: 5, resource_type: "TaxCharge" },
    ]);
    const [taxTypes, setTaxTypes] = useState([]); // State to store tax types
  
    // Fetch tax types from API
    useEffect(() => {
      const fetchTaxTypes = async () => {
        try {
          const response = await axios.get(
            `${baseURL}rfq/events/taxes_dropdown?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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
        .filter((row) => !row.inclusive)
        .reduce((total, row) => total + (parseFloat(row.amount) || 0), 0).toFixed(2);
    };
  
    // Delete a row
    const deleteRow = (id) => {
      // setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      setRows((prevRows) =>
        prevRows.filter((row, index) => {
          // Prevent deletion of the first three rows
          if (index < 3) {
            return true;
          }
          return row.id !== id;
        })
      );
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
            `${baseURL}rfq/events/deduction_tax_details?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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
          { id: 1, type: "", percentage: "", inclusive: false, amount: "", addition: false, },
        ]);
      }
    };
    // Function to calculate the subtotal of deduction rows
    const calculateDeductionSubTotal = () => {
      return deductionRows
        .filter((row) => !row.inclusive)
        .reduce((total, row) => total + (parseFloat(row.amount) || 0), 0).toFixed(2);
    };
    // Function to calculate the payable amount
    const calculatePayableAmount = () => {
      const grossAmount = parseFloat(calculateSubTotal()) + (parseFloat(creditNoteData.amount) || 0);
      const deductionSubTotal = parseFloat(calculateDeductionSubTotal()) || 0;
      return (grossAmount - deductionSubTotal).toFixed(2);
    };
  
    const deleteDeductionRow = (id) => {
      setDeductionRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!creditNoteData) return <div>No data found</div>;

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section  ms-2">
          <a href="">Home &gt; Billing &amp; Accounts &gt; Miscellaneous Bill</a>
          <h5 className="mt-3">Miscellaneous Bill Edit </h5>
          <div className="row container-fluid my-4 align-items-center">
         
            <div className="col-md-12 px-2">
              <div
                className="tab-content mor-content active"
                id="pills-tabContent"
              >
                <div
                  className="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  <section className="mor p-2 pt-2">
                    {/* <div className="row justify-content-center my-4">
                      <div className="col-md-10">
                        <div className="progress-steps">
                          <div className="top">
                            <div className="progress">
                              <span
                                style={{
                                  width: `${((currentStep - 1) / (totalSteps - 1)) * 100
                                    }%`,
                                }}
                              ></span>
                            </div>
                            <div className="steps">
                              {[...Array(totalSteps)].map((_, index) => (
                                <div className="layer1" key={index}>
                                  <div
                                    className={`step ${currentStep > index + 1 ? "active" : ""
                                      }`}
                                    data-step={index + 1}
                                  >
                                    <span></span>
                                  </div>
                                  <p>Layer {index + 1}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="buttons d-m">
                            <button
                              className={`btn btn-prev ${currentStep === 1 ? "disabled" : ""
                                }`}
                              onClick={handlePrev}
                              disabled={currentStep === 1}
                            >
                              Prev
                            </button>
                            <button
                              className={`btn btn-next ${currentStep === totalSteps ? "disabled" : ""
                                }`}
                              onClick={handleNext}
                              disabled={currentStep === totalSteps}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </div> */}

                    <div
                      className="card card-default"
                      id="mor-material-details"
                    >
                      <div className="card-body">
                        <div className="details_page">
                          <div className="row px-3">
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Company</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.company_name || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Project</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.project_name || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Sub-Project</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.site_name || "-"}
                                </label>
                              </div>
                            </div>
                           
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Created On</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.created_at
                                    ? new Date(
                                      creditNoteData.created_at
                                    ).toLocaleDateString()
                                    : "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Bill Number</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.bill_no || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Bill Date</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.bill_date
                                    ? new Date(
                                      creditNoteData.bill_date
                                    ).toLocaleDateString()
                                    : "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Bill Amount</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.amount || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Supplier Name</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {/* {creditNoteData.supplier.organization_name || "-"} */}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>GSTN No.</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.gstin || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>PAN Number</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.pan_no || "-"}
                                </label>
                              </div>
                            </div>
                           
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Status</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.status || "-"}
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                              <div className="col-6">
                                <label>Remark</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">:</span>
                                  </span>
                                  {creditNoteData.remark || "-"}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between mt-3 me-2">
                          <h5 className=" ">Tax Details</h5>
                        </div>

  <div className="tbl-container  mt-3">
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
                                  <td className="text-start"> {creditNoteData.amount || ""}</td>
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
                                          id: type.id,
                                          tax: type.type,
                                          isDisabled:
                                            // Disable "Handling Charges", "Other charges", "Freight" for all rows
                                            ["Handling Charges", "Other charges", "Freight"].includes(type.name) ||

                                            // Disable "IGST" if "SGST" or "CGST" is selected in any row
                                            (type.name === "IGST" &&
                                              rows.some((r) => ["SGST", "CGST"].includes(r.type) && r.id !== row.id)) ||
                                            // Disable "SGST" and "CGST" if "IGST" is selected in any row
                                            (["SGST", "CGST"].includes(type.name) &&
                                              rows.some((r) => r.type === "IGST" && r.id !== row.id)),

                                        }))}
                                        value={{ value: row.type, label: row.type }}
                                        // onChange={(selectedOption) =>
                                        //   setRows((prevRows) =>
                                        //     prevRows.map((r) =>
                                        //       r.id === row.id ? { ...r, 
                                        //         type: selectedOption.value,
                                        //         resource_id: selectedOption.value, // Set the selected tax ID
                                        //         resource_type: taxTypes.find((t) => t.id === selectedOption.value)?.type || "", // Set the tax type
                                        //        } : r
                                        //     )
                                        //   )
                                        // }

                                        // onChange={(selectedOption) =>
                                        //   setRows((prevRows) =>
                                        //     prevRows.map((r) =>
                                        //       r.id === row.id
                                        //         ? {
                                        //             ...r,
                                        //             type: selectedOption?.value || "", // Handle null or undefined
                                        //             resource_id: selectedOption?.value || null, // Handle null or undefined
                                        //             resource_type: taxTypes.find((t) => t.id === selectedOption?.value)?.type || "", // Handle null or undefined
                                        //           }
                                        //         : r
                                        //     )
                                        //   )
                                        // }

                                        onChange={(selectedOption) => {
                                          console.log("Selected Option:", selectedOption); // Log the selected option
                                          setRows((prevRows) =>
                                            prevRows.map((r) =>
                                              r.id === row.id
                                                ? {
                                                  ...r,
                                                  type: selectedOption?.value || "", // Handle null or undefined
                                                  resource_id: selectedOption?.id || null, // Handle null or undefined
                                                  resource_type: selectedOption?.tax || "", // Handle null or undefined
                                                }
                                                : r
                                            )
                                          );
                                          console.log("Updated Rows:", rows); // Log the updated rows
                                        }}
                                        placeholder="Select Type"
                                        isDisabled={!row.isEditable} // Disable if not editable
                                      />
                                    </td>
                                    <td className="text-start">
                                      {row.isEditable ? (
                                        //                             <select
                                        //                               className="form-control form-select"
                                        //                               value={row.percentage}
                                        //                               onChange={(e) =>
                                        //                                 const percentage = parseFloat(e.target.value) || 0;
                                        // const amount = ((selectedPO?.total_value || 0) * percentage) / 100;
                                        //                                 setRows((prevRows) =>
                                        //                                   prevRows.map((r) =>
                                        //                                     r.id === row.id ? { ...r, percentage: e.target.value } : r
                                        //                                   )
                                        //                                 )
                                        //                               }
                                        //                             >

                                        <select
                                          className="form-control form-select"
                                          value={row.percentage}
                                          onChange={(e) => {
                                            const percentage = parseFloat(e.target.value) || 0;
                                            const amount = ((creditNoteData.amount || 0) * percentage) / 100;

                                            setRows((prevRows) =>
                                              prevRows.map((r) =>
                                                r.id === row.id
                                                  ? { ...r, percentage: e.target.value, amount: amount.toFixed(2) }
                                                  : r
                                              )
                                            );
                                          }}
                                        >
                                          <option value="">Select Tax</option>
                                          <option value="5%">5%</option>
                                          <option value="12%">12%</option>
                                          <option value="18%">18%</option>
                                          <option value="28%">28%</option>
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
                                                ? { ...r, amount: parseFloat(e.target.value) || 0 }
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
                                  <td className="text-start">  {(parseFloat(calculateSubTotal()) + (parseFloat(creditNoteData.amount) || 0)).toFixed(2)}</td>
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
                                          id: type.id,
                                          tax: type.type,
                                        }))}
                                        value={{ value: row.type, label: row.type }}
                                        onChange={(selectedOption) =>
                                          setDeductionRows((prevRows) =>
                                            prevRows.map((r) =>
                                              r.id === row.id ? {
                                                ...r,
                                                type: selectedOption?.value || "", // Handle null or undefined
                                                resource_id: selectedOption?.id || null, // Handle null or undefined
                                                resource_type: selectedOption?.tax || "", // Handle null or undefined
                                              } : r
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
                                          const percentage = parseFloat(e.target.value) || 0;
                                          const amount = ((creditNoteData.amount || 0) * percentage) / 100;

                                          setDeductionRows((prevRows) =>
                                            prevRows.map((r) =>
                                              r.id === row.id
                                                ? { ...r, percentage: e.target.value, amount: amount.toFixed(2) }
                                                : r
                                            )
                                          );
                                        }}
                                      >
                                        {console.log("percent deduction", row.percentage)}
                                        <option value="">Select Tax</option>
                                        <option value="1%">1%</option>
                                        <option value="2%">2%</option>
                                        <option value="10%">10%</option>
                                        {/* <option value="28%">28%</option> */}
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
                                                ? { ...r, amount: parseFloat(e.target.value) || 0 }
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

                       
                        <div className="d-flex justify-content-between mt-3 me-2">
                          <h5 className=" ">Document Attachment</h5>
                        </div>
                        <div className="tbl-container  mt-3">
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
                              {creditNoteData.attachments &&
                                creditNoteData.attachments.length > 0 ? (
                                creditNoteData.attachments.map(
                                  (attachment, index) => (
                                    <tr key={attachment.id}>
                                      <td className="text-start">
                                        {index + 1}
                                      </td>
                                      <td className="text-start">
                                        {attachment.relation}
                                      </td>
                                      <td className="text-start">
                                        {attachment.filename}
                                      </td>
                                      <td className="text-start">
                                        {attachment.content_type}
                                      </td>
                                      <td className="text-start">
                                        {new Date(
                                          attachment.created_at
                                        ).toLocaleDateString()}
                                      </td>
                                      <td className="text-decoration-underline cursor-pointer">
                                        {/* <a
                                          href={`https://marathon.lockated.com/attachments/${attachment.id}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          View
                                        </a> */}
                                        <a
                                          href={
                                            // {`${baseURL}rfq/events/${eventId}/download?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&blob_id=${attachment.blob_id}`}
                                            `${baseURL}credit_notes/${id}/download?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&blob_id=${attachment.blob_id}`
                                          }
                                          download={attachment.filename}
                                        >
                                          <DownloadIcon />
                                        </a>
                                      </td>
                                    </tr>
                                  )
                                )
                              ) : (
                                <tr>
                                  <td colSpan="6" className="text-center">
                                    No attachments found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                <div className="row w-100 ">
                  <div className="col-md-12 mx-2">
                    <div className="form-group">
                      <label>Remark</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Enter ..."
                        defaultValue={""}
                        value={remark}
                        onChange={handleRemarkChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row w-100">
                  <div className="col-md-12 mx-2 mt-2">
                    <div className="form-group">
                      <label>Comments</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Enter ..."
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
                <div className="row mt-2 justify-content-end w-100">
                  {/* <div className="col-md-2">
                    <button className="purple-btn2 w-100">Print</button>
                  </div> */}
                  <div className="col-md-2">
                    <button className="purple-btn2 w-100" onClick={handleSubmit}>Submit</button>
                  </div>
                  <div className="col-md-2">
                    <button className="purple-btn1 w-100">Cancel</button>
                  </div>
                </div>
                <div className="row mt-2 w-100">
                  <div className="col-12 px-4">
                    <h5>Audit Log</h5>
                    <div className="mx-0">

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
                            {creditNoteData?.status_logs?.map((log, index) => (
                              <tr key={log.id}>
                                <td className="text-start">{index + 1}</td>
                                <td className="text-start">{""}</td>
                                <td className="text-start">
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
                                <td className="text-start">{log.status ? log.status.charAt(0).toUpperCase() + log.status.slice(1) : ""}</td>
                                <td className="text-start">{log.remarks || ""}</td>
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
          </div>
          <div
            className="tab-pane fade"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            ...
          </div>
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
          <p>Loading...</p>
        </div>
      )}
    </>
  );
};

export default MiscellaneousBillEdit;
