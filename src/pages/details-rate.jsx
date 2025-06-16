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

                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="mt-5 mb-5">
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


                                        {rateDetails?.materials?.length > 0 ? (
                                            rateDetails?.materials?.map((row, index) => (
                                                <tr key={index} >
                                                    <td className="text-start"> {index + 1}</td>
                                                    {/* {console.log("materail type:", row.materialType)} */}
                                                    <td className="text-start">{row.material_type}</td>
                                                    <td className="text-start">{row.material_name}</td>
                                                    <td className="text-start">{row.material_sub_type}</td>
                                                    <td className="text-start">{row.generic_info}</td>
                                                    <td className="text-start">{row.color}</td>
                                                    <td className="text-start">{row.brand }</td>
                                                    <td className="text-start">
                                                        {row.effective_date}
                                                    </td>
                                                    <td className="text-start">{row.rate}</td>
                                                    <td className="text-start">{row.avg_po_rate}</td>
                                                    <td className="text-start">{row.last_po_rate}</td>
                                                    {/* <td>

                                                        <div className="d-flex align-items-center gap-2">
                                                            <input
                                                                className="form-control"
                                                                type="number"
                                                                value={row.rate}
                                                                onChange={(e) => handleRateChange(e, index)}
                                                                disabled={row.avgRateChecked || row.poRateChecked}
                                                                placeholder="Enter Rate"
                                                                style={{ maxWidth: "120px" }}
                                                            />
                                                            <input
                                                                type="checkbox"
                                                                checked={row.rateChecked || false}
                                                                disabled={row.avgRateChecked || row.poRateChecked}
                                                                onChange={() => handleCheckboxChange("rate", index)}
                                                            />
                                                        </div>
                                                    </td> */}
                                                    {/* <td className="text-start">
                                                        
                                                        <span>{row.avgRate || "0"}</span>
                                                        <span className="ms-2 pt-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={row.avgRateChecked || false}
                                                                onChange={() => handleCheckboxChange("avgRate", index)}
                                                                disabled={row.rateChecked || row.poRateChecked}
                                                            />
                                                        </span>
                                                    </td> */}
                                                    {/* <td className="text-start">
                                                       
                                                        <span>{row.poRate || "0"}</span>
                                                        <span className="ms-2 pt-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={row.poRateChecked || false}
                                                                onChange={() => handleCheckboxChange("poRate", index)}
                                                                disabled={row.rateChecked || row.avgRateChecked}
                                                            />
                                                        </span>
                                                    </td> */}
                                                    <td>{row.uom}</td>
                                                    {/* <td className="text-start">
                                                        <button
                                                            className="btn mt-0 pt-0"
                                                            onClick={() => handleDeleteRow(index)} // Use onClick instead of onChange
                                                        >
                                                            <svg
                                                                width="16"
                                                                height="20"
                                                                viewBox="0 0 16 20"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M14.7921 2.44744H10.8778C10.6485 1.0366 9.42966 0 8.00005 0C6.57044 0 5.35166 1.03658 5.12225 2.44744H1.20804C0.505736 2.48655 -0.0338884 3.08663 0.00166019 3.78893V5.26379C0.00166019 5.38914 0.0514441 5.51003 0.140345 5.59895C0.229246 5.68787 0.35015 5.73764 0.475508 5.73764H1.45253V17.2689C1.45253 18.4468 2.40731 19.4025 3.58612 19.4025H12.4139C13.5927 19.4025 14.5475 18.4468 14.5475 17.2689V5.73764H15.5245C15.6498 5.73764 15.7707 5.68785 15.8597 5.59895C15.9486 5.51005 15.9983 5.38914 15.9983 5.26379V3.78893C16.0339 3.08663 15.4944 2.48654 14.7921 2.44744ZM8.00005 0.94948C8.90595 0.94948 9.69537 1.56823 9.91317 2.44744H6.08703C6.30483 1.56821 7.09417 0.94948 8.00005 0.94948ZM13.5998 17.2688C13.5998 17.5835 13.4744 17.8849 13.2522 18.1072C13.0299 18.3294 12.7285 18.4539 12.4138 18.4539H3.58608C2.93089 18.4539 2.40017 17.9231 2.40017 17.2688V5.73762H13.5998L13.5998 17.2688ZM15.0506 4.78996H0.949274V3.78895C0.949274 3.56404 1.08707 3.39512 1.20797 3.39512H14.792C14.9129 3.39512 15.0507 3.56314 15.0507 3.78895L15.0506 4.78996ZM4.91788 16.5533V7.63931C4.91788 7.37706 5.13035 7.16548 5.3926 7.16548C5.65396 7.16548 5.86643 7.37706 5.86643 7.63931V16.5533C5.86643 16.8147 5.65396 17.0271 5.3926 17.0271C5.13035 17.0271 4.91788 16.8147 4.91788 16.5533ZM7.52531 16.5533L7.5262 7.63931C7.5262 7.37706 7.73778 7.16548 8.00003 7.16548C8.26228 7.16548 8.47386 7.37706 8.47386 7.63931V16.5533C8.47386 16.8147 8.26228 17.0271 8.00003 17.0271C7.73778 17.0271 7.5262 16.8147 7.5262 16.5533H7.52531ZM10.1327 16.5533L10.1336 7.63931C10.1336 7.37706 10.3461 7.16548 10.6075 7.16548C10.8697 7.16548 11.0822 7.37706 11.0822 7.63931V16.5533C11.0822 16.8147 10.8697 17.0271 10.6075 17.0271C10.3461 17.0271 10.1336 16.8147 10.1336 16.5533H10.1327Z"
                                                                    fill="#B25657"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </td> */}

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="13" className="text-center">
                                                    No data added yet.
                                                </td>
                                            </tr>
                                        )}


                                    </tbody>
                                </table>
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
                                <button className="purple-btn1 w-100">Cancle</button>
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