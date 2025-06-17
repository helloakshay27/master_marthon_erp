import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector"; // Adjust path as needed
import { Modal, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import { useParams } from "react-router-dom";
// import Modal from "react-bootstrap/Modal";

const RateDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [showModal, setShowModal] = useState(false);

    const [rateDetails, setRateDetails] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [status, setStatus] = useState('');
    const [remark, setRemark] = useState('');
    const [loading2, setLoading2] = useState(false);  // State for loading indicator


    const fetchRateDetails = async (id) => {
        try {
            const response = await axios.get(
                `https://marathon.lockated.com/rate_details/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
            );
            setRateDetails(response.data);
            setStatus(response.data.selected_status || "");
            if (response.data.materials) {
                //   setTableData(
                //     response.data.materials.map((mat) => ({
                //       ...mat,
                //       rateChecked: mat.rate_type === "manual",
                //       avgRateChecked: mat.rate_type === "average",
                //       poRateChecked: mat.rate_type === "last",
                //     }))
                //   );


                setTableData(
                    response.data.materials.map((mat) => {
                        let rate = "";
                        let avgRate = "";
                        let poRate = "";

                        if (mat.rate_type === "manual") {
                            rate = mat.rate || "";
                        } else if (mat.rate_type === "average") {
                            avgRate = mat.rate;
                            console.log("avg rate:", avgRate)
                        } else if (mat.rate_type === "last") {
                            poRate = mat.rate;
                        }

                        return {
                            ...mat,
                            rate,
                            avgRate,
                            poRate,
                            rateChecked: mat.rate_type === "manual",
                            avgRateChecked: mat.rate_type === "average",
                            poRateChecked: mat.rate_type === "last",
                        };
                    })
                );

            }
        } catch (error) {
            console.error("Error fetching rate details:", error);
        }
    };
    useEffect(() => {
        fetchRateDetails(id);
    }, [id]);

    const statusOptions = [
        {
            label: "Select Status",
            value: "",
        },
        ...(rateDetails?.status_list || []).map((status) => ({
            label: status,
            value: status.toLowerCase(),
        })),
    ];

    // Step 2: Handle status change
    const handleStatusChange = (selectedOption) => {
        // setStatus(e.target.value);
        setStatus(selectedOption.value);
        console.log("Selected Status:", selectedOption.value); // Optional: Log the selected status for debugging
        // handleStatusChange(selectedOption); // Handle status change
    };

    // Step 3: Handle remark change
    const handleRemarkChange = (e) => {
        setRemark(e.target.value);
    };

    const payload = {
        status_log: {
            status: status,
            remarks: remark
        }
    };

    console.log("detail status change", payload);
    const handleSubmit = async () => {
        // Prepare the payload for the API
        const payload = {
            status_log: {
                status: status,
                remarks: remark
            }
        };

        console.log("detail status change", payload);
        setLoading2(true);

        try {
            const response = await axios.patch(
                `${baseURL}rate_details/${id}/update_status.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
                payload,  // The request body containing status and remarks
                {
                    headers: {
                        'Content-Type': 'application/json', // Set the content type header
                    },
                }

            );
            await fetchRateDetails(id);


            if (response.status === 200) {
                console.log('Status updated successfully:', response.data);
                setRemark("")
                setLoading2(false);
                alert('Status updated successfully');
                // Handle success (e.g., update the UI, reset fields, etc.)
                // toast.success("Status updated successfully!");
            } else {
                console.log('Error updating status:', response.data);
                // toast.error("Failed to update status.");
                // Handle error (e.g., show an error message)
            }
        } catch (error) {
            console.error('Request failed:', error);
            // Handle network or other errors (e.g., show an error message)
        } finally {
            setLoading2(false);
        }
    };


    const handleCancel = () => {
        // setStatus(initialStatus); // Reset status to the initial value
        // setRemark(''); // Optionally reset the remark as well
        navigate("/view-BOQ"); // 🔥 Redirect to the /view-BOQ page
    };
    return (
        <>
            <div className="website-content overflow-auto">
                <div className="module-data-section p-4">
                    <a href="">
                        <a href="">Setup &gt; Engineering Setup &gt; Rate</a>
                    </a>
                    <h5 class="mt-4">Rate Details</h5>
                    {status && status.toLowerCase() === "draft" && (
                        <div className="d-flex justify-content-end m-2">

                            <Link
                                to={`/edit-rate/${id}`}
                                className="d-flex align-items-center" style={{ borderColor: '#8b0203' }}>

                                <button class="purple-btn1" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#8b0203" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25Z" fill="#8b0203" />
                                        <path d="M20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#8b0203" />
                                    </svg>
                                </button>

                            </Link>

                        </div>
                    )}
                    <div className="mb-5">

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
                                                    {rateDetails?.company_name || "-"}
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
                                                    {rateDetails?.project_name || "-"}
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
                                                    {rateDetails?.site_name || "-"}
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                            <div className="col-6">
                                                <label>Wing</label>
                                            </div>
                                            <div className="col-6">
                                                <label className="text">
                                                    <span className="me-3">
                                                        <span className="text-dark">:</span>
                                                    </span>
                                                    {rateDetails?.wing_name || "-"}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

 <div className="mt-5 mb-4 mx-3">
     {/* <h5 className="mb-3">Materials</h5> */}
                            <div className="tbl-container  mt-1">
                                <table className="w-100">
                                    <thead>
                                        <tr>
                                            <th className="text-start">Sr.No.</th>
                                            <th className="text-start">Material Type</th>
                                            <th className="text-start">Material</th>
                                            <th className="text-start">Material Sub-Type</th>
                                            <th className="text-start">Generic Specification</th>
                                            <th className="text-start">Colour</th>
                                            <th className="text-start">Brand</th>

                                            <th className="text-start">Effective Date</th>
                                            <th className="text-start">Rate (INR)
                                                {/* <span className="ms-2 pt-2">
                                                    <input type="checkbox" />
                                                </span> */}
                                            </th>
                                            <th className="text-start">AVG Rate
                                                {/* <span className="ms-2 pt-2">
                                                    <input type="checkbox" />
                                                </span> */}
                                                {/* <span className="ms-2 pt-2" onClick={() => setShowDateModal(true)} style={{ cursor: "pointer" }}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-calendar"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1zm2-3v1h8V1H3z" />
                                                    </svg>
                                                </span> */}
                                            </th>
                                            <th className="text-start">PO Rate
                                                {/* <span className="ms-2 pt-2">
                                                    <input type="checkbox" />
                                                </span> */}
                                            </th>
                                            <th className="text-start">UOM</th>
                                            {/* <th className="text-start">Action</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>


                                        {/* {rateDetails?.materials?.length > 0 ? (
                                            rateDetails?.materials?.map((row, index) => (
                                                <tr key={index} >
                                                    <td className="text-start"> {index + 1}</td>
                                                   
                                                    <td className="text-start">{row.material_type}</td>
                                                    <td className="text-start">{row.material_name}</td>
                                                    <td className="text-start">{row.material_sub_type}</td>
                                                    <td className="text-start">{row.generic_info}</td>
                                                    <td className="text-start">{row.color}</td>
                                                    <td className="text-start">{row.brand}</td>
                                                    <td className="text-start">
                                                        {row.effective_date}
                                                    </td>
                                                    <td className="text-start">{row.rate}</td>
                                                    <td className="text-start">{row.avg_po_rate}</td>
                                                    <td className="text-start">{row.last_po_rate}</td>
                                                   
                                                    <td>{row.uom}</td>


                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="13" className="text-center">
                                                    No data added yet.
                                                </td>
                                            </tr>
                                        )} */}


                                        {tableData.length > 0 ? (
                                            tableData.map((row, index) => (
                                                <tr key={index}>
                                                    <td className="text-start">{index + 1}</td>
                                                    <td className="text-start">{row.material_type}</td>
                                                    <td className="text-start">{row.material_name}</td>
                                                    <td className="text-start">{row.material_sub_type}</td>
                                                    <td className="text-start">{row.generic_info}</td>
                                                    <td className="text-start">{row.color}</td>
                                                    <td className="text-start">{row.brand}</td>
                                                    <td className="text-start">{row.effective_date}</td>
                                                    <td className="text-start">
                                                        {row.rate}
                                                        <input
                                                            type="checkbox"
                                                            checked={row.rateChecked || false}
                                                            disabled
                                                            style={{ marginLeft: 8 }}
                                                        />
                                                    </td>
                                                    <td className="text-start">
                                                        {row.avgRate || "0"}
                                                        <input
                                                            type="checkbox"
                                                            checked={row.avgRateChecked || false}
                                                            disabled
                                                            style={{ marginLeft: 8 }}
                                                        />
                                                    </td>
                                                    <td className="text-start">
                                                        {row.poRate || "0"}
                                                        <input
                                                            type="checkbox"
                                                            checked={row.poRateChecked || false}
                                                            disabled
                                                            style={{ marginLeft: 8 }}
                                                        />
                                                    </td>
                                                    <td className="text-start">{row.uom}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="12" className="text-center">
                                                    No data found.
                                                </td>
                                            </tr>
                                        )}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                            </div>
                        </div>
                       

                        <div className="row w-100 ">
                            <div className="col-md-12 ">
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
                        {/* <div className="row w-100">
                        <div className="col-md-12  mt-2">
                            <div className="form-group">
                                <label>Comments</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    placeholder="Enter ..."
                                    defaultValue={""}
                                // value={comment}
                                // onChange={handleCommentChange}
                                />
                            </div>
                        </div>
                    </div> */}
                        <div className="row mt-4 justify-content-end align-items-center mx-2 mb-5">
                            <div className="col-md-3">
                                <div className="form-group d-flex gap-3 align-items-center mx-3">
                                    <label style={{ fontSize: "0.95rem", color: "black" }}>
                                        Status
                                    </label>

                                    <SingleSelector
                                        options={statusOptions}
                                        // options={filteredOptions}
                                        onChange={handleStatusChange}
                                        // options.find(option => option.value === status)
                                        // value={filteredOptions.find(option => option.value === status)}
                                        value={statusOptions.find(option => option.value === status.toLowerCase())}
                                        // value={selectedSite}
                                        placeholder={`Select Status`} // Dynamic placeholder
                                        // isDisabled={boqDetails.disabled}
                                        classNamePrefix="react-select"
                                    />
                                    {console.log("status", status)}
                                </div>
                            </div>
                        </div>
                        <div className="row mt-2 justify-content-end mb-5 pb-5">
                            <div className="col-md-2 mt-2">
                                <button className="purple-btn2 w-100" onClick={handleSubmit}>Submit</button>
                            </div>
                            <div className="col-md-2">
                                <button className="purple-btn1 w-100" onClick={() => navigate("/view-rate")}>Cancle</button>
                            </div>
                        </div>

                        <div className="row mt-2 w-100">
                            <div className="col-12 " >
                                <h5>Audit Log</h5>
                                <div className="mx-0" >
                                    <div className="tbl-container mt-1" style={{ maxHeight: "450px" }} >
                                        <table className="w-100"  >
                                            <thead>
                                                <tr>
                                                    <th>Sr.No.</th>
                                                    <th>Created By</th>
                                                    <th>Created At</th>
                                                    <th>Status</th>
                                                    <th>Remark</th>
                                                    {/* <th>Comment</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(rateDetails?.audit_logs || [])
                                                    .slice(0, 10)
                                                    .map((log, index) => (
                                                        <tr key={log.id}>
                                                            <td className="text-start">{index + 1}</td>
                                                            <td className="text-start">{log.user}</td>
                                                            <td className="text-start">
                                                                {log.date}
                                                            </td>
                                                            <td className="text-start">
                                                                {log.status
                                                                    ? log.status.charAt(0).toUpperCase() + log.status.slice(1)
                                                                    : ""}
                                                            </td>
                                                            <td className="text-start">{log.remarks || ""}</td>
                                                            {/* <td className="text-start">{log.comments || ""}</td> */}
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                        {/* Show "Show More" link if more than 10 records */}
                                        {rateDetails?.status_logs?.length > 10 && (
                                            <div className="mt-2 text-start">
                                                <span
                                                    className="boq-id-link"
                                                    style={{ fontWeight: "bold", cursor: "pointer" }}
                                                //   onClick={() => setShowAuditModal(true)}
                                                >
                                                    Show More
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loading2 && (
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
                    <p>Submitting Status...</p>
                </div>

            )}

        </>
    )
}

export default RateDetails;