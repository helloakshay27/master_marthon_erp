import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Ensure Bootstrap JS is included
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import baseURL from "../../confi/apiDomain";
import Select from "react-select"; // Importing the react-select component
import FormattedDate from "../../components/FormattedDate";

const GoodReceiveNoteDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loadStatus, setloadStatus] = useState("");

  const [remarks, setRemarks] = useState("");
  const [comments, setComments] = useState("");
  const [collapsed, setCollapsed] = useState({});

  // Toggle collapse state for the card
  const toggleCollapse = (index) => {
    setCollapsed((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the state of the clicked card
    }));
  };

  useEffect(() => {
    const fetchData = () => {
      const statusData = {
        status_logs: [
          {
            status_log: {
              remarks: "Draft created",
              comments: "Draft status is now active",
              status: "draft",
            },
          },
          {
            status_log: {
              remarks: "Status updated",
              comments: "Changed status to submitted",
              status: "submitted",
            },
          },
          {
            status_log: {
              remarks: "Status updated",
              comments: "Changed status to approved",
              status: "approved",
            },
          },
        ],
      };

      // Extracting statuses
      const extractedStatuses = statusData.status_logs.map(
        (log) => log.status_log.status
      );

      // Creating options array for react-select
      const options = extractedStatuses.map((status) => ({
        value: status,
        label: status.charAt(0).toUpperCase() + status.slice(1), // Capitalizing the first letter
      }));

      // Set statuses options
      setStatuses(options);

      // Only set selected status if data is available
      if (data && data?.status) {
        const selectedStatusOption = options.find(
          (status) => status.value === data.status
        );
        if (selectedStatusOption) {
          setSelectedStatus(selectedStatusOption);
        }
      }
    };

    fetchData();
  }, [data?.status]); // Re-run when data.status changes

  const handleStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption); // Set the value (not the full object)
    console.log(selectedOption.value);
    setloadStatus(selectedOption.value);
  };

  const handleRemarksChange = (event) => setRemarks(event.target.value);
  const handleCommentsChange = (event) => setComments(event.target.value);

  const handleUpdateStatus = async () => {
    const payload = {
      status_log: {
        remarks: remarks,
        comments: comments,
        status: loadStatus,
      },
    };

    console.log(JSON.stringify(payload));

    try {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      const response = await fetch(
        `${baseURL}//good_receive_notes/${id}/update_status.json?token=${token}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to update status.");
      await response.json();
      toast.success("Status updated successfully!");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update status. Please try another status.");
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const apiUrl = `${baseURL}/good_receive_notes/${id}.json?token=${token}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch details.");
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, location.search]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <ToastContainer />

      <div className="website-content overflow-auto details_page">
        <div className="module-data-section container-fluid details_page p-3">
          <a href="">Home &gt; Store &gt; Store Operations &gt; GRN</a>
          <h5 className="mt-3">Create Goods Received Note</h5>
          <div className="row my-4 align-items-center">
            <div className="col-md-12 px-2">
              <div className="head-material text-center">
                <h4>GRN For Purchase Order</h4>
              </div>
              <div className="mor-tabs mt-4">
                <ul
                  className="nav nav-pills mb-3 justify-content-center"
                  id="pills-tab"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      data-bs-toggle="pill"
                      data-bs-target="#create-mor"
                      type="button"
                      role="tab"
                      aria-controls="create-mor"
                      aria-selected="false"
                    >
                      MOR
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      data-bs-toggle="pill"
                      data-bs-target="#mor-approval-create"
                      type="button"
                      role="tab"
                      aria-controls="mor-approval-create"
                      aria-selected="true"
                    >
                      MTO Creation
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-contact"
                      type="button"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="false"
                    >
                      MTO Approval
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link "
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-contact"
                      type="button"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="false"
                    >
                      PO
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-contact"
                      type="button"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="false"
                    >
                      Material Received
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-contact"
                      type="button"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="false"
                    >
                      Material Issued
                    </button>
                  </li>
                  <li className="nav-item" role="presentation"></li>
                </ul>
              </div>
              <div
                className="tab-pane fade show active"
                id="nav-home"
                role="tabpanel"
                aria-labelledby="nav-home-tab"
                tabIndex={0}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Company </label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">: </span>
                          {data?.company_name ?? "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                      <div className="col-6 ">
                        <label>Project </label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:</span>
                          {data?.project ?? "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                      <div className="col-6 ">
                        <label>Sub Project</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:</span>
                          {data?.sub_project ?? "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                      <div className="col-6 ">
                        <label>Wing</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:</span>
                          {data?.wing ?? "-"}
                        </label>
                      </div>
                    </div>
                    {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                      <div className="col-6 ">
                        <label>GRN ID </label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">: </span>
                          {data?.id ?? "-"}
                        </label>
                      </div>
                    </div> */}
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                      <div className="col-6 ">
                        <label>GRN NO</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:</span>
                          {data?.grn_number ?? "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                      <div className="col-6 ">
                        <label>GRN Date</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:</span>
                          <FormattedDate date={data?.grn_date ?? "-"} />
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                      <div className="col-6 ">
                        <label>To Store </label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:</span>
                          {data?.to_store ?? "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                      <div className="col-6 ">
                        <label>Supplier</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:</span>
                          {data?.supplier ?? "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                      <div className="col-6 ">
                        <label>Delivery Chalan No.</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:</span>
                          {data?.challan_number ?? "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                      <div className="col-6 ">
                        <label>Gate Entry No.</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:</span>

                          {data?.gate_entry_no ?? "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                      <div className="col-6 ">
                        <label>Delivery Challan Date</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:</span>
                          <FormattedDate date={data?.challan_date ?? "-"} />
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                      <div className="col-6 ">
                        <label>Remark</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:</span>
                          {data?.remark ?? "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                      <div className="col-6 ">
                        <label>Vehicle No.</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:</span>
                          {data?.vehicle_no ?? "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                      <div className="col-6 ">
                        <label>Description</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:</span>
                          {data?.description ?? "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                      <div className="col-6 ">
                        <label>PO No.</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:</span>
                          {data?.po_number ?? "-"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                      <div className="col-6 ">
                        <label>Gate No.</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:</span>
                          {data?.gate_number ?? "-"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {data?.grn_materials?.map((item, index) => (
                  <div
                    className="card mt-3"
                    key={item.id || item.mor_inventory?.id}
                  >
                    <div className="card-header">
                      <h3 className="card-title">
                        Material Details ({index + 1}/
                        {data.grn_materials.length})
                      </h3>
                      <div className="card-tools">
                        <button
                          type="button"
                          className="btn btn-tool"
                          onClick={() => toggleCollapse(index)}
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
                              d="M16 24L9.0718 12L22.9282 12L16 24Z"
                              fill="white"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div
                      className={`card-body mt-1 pt-1 ${
                        collapsed[index] ? "d-none" : ""
                      }`}
                    >
                      <div className="mt-2">
                        <h5>Materials</h5>
                      </div>
                      <div className="tbl-container me-2 mt-3">
                        <table className="w-100">
                          <thead>
                            <tr>
                              <th rowSpan={2}>Material Description</th>
                              <th rowSpan={2}>Is QC Required</th>
                              <th rowSpan={2}>Is MTC Received</th>
                              <th rowSpan={2}>UOM</th>
                              <th colSpan={9}>Quantity</th>
                              <th />
                              <th />
                            </tr>
                            <tr>
                              <th>Ordered</th>
                              <th>Received</th>
                              <th>Breakage</th>
                              <th>Defective</th>
                              <th>Accepted</th>
                              <th>Received Up to</th>

                              <th>Cumulative</th>
                              <th>Tolerance Qty</th>
                              <th>Billing Quantity</th>
                              <th>Inspection Date</th>
                              <th>Warranty Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr key={item.id || item.mor_inventory?.id}>
                              <td>
                                {item.mor_inventory?.inventory
                                  ?.material_description || "-"}
                              </td>
                              <td>
                                {item.mor_inventory?.inventory?.is_qc
                                  ? "Yes"
                                  : "No"}
                              </td>
                              <td>
                                {item.mor_inventory?.inventory?.mtc_required
                                  ? "Yes"
                                  : "No"}
                              </td>
                              <td>
                                {item.mor_inventory?.inventory?.uom_name || "-"}
                              </td>
                              <td>
                                {item.mor_inventory?.ordered_quantity || "0"}
                              </td>
                              <td>{item.received || "0"}</td>
                              <td>{item.breakage || "0"}</td>
                              <td>{item.defective || "0"}</td>
                              <td>{item.accepted || "0"}</td>
                              <td>{item.received_till_date || "0"}</td>

                              <td>{item.cumulative || "0"}</td>
                              <td>{item.tolerence_quantity || "0"}</td>
                              <td>{item.billing_quantity || "0"}</td>

                              <td>
                                {item.mor_inventory?.inventory
                                  ?.inspection_date || "-"}
                              </td>
                              <td>
                                {item.mor_inventory?.inventory
                                  ?.warranty_period || "-"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* MOR Details Section */}
                      <div className="card p-3 mt-3">
                        <div className="mt-2">
                          <h5>MOR Details</h5>
                        </div>
                        <div className="tbl-container me-2 mt-3">
                          <table className="w-100">
                            <thead>
                              <tr>
                                <th>MOR No.</th>
                                <th>MOR Ordered</th>
                                <th>Received Upto GRN</th>
                                <th>MOR Accepted</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.mor_details.length > 0 ? (
                                item.mor_details.map((detail, detailIndex) => (
                                  <tr key={detail.mor_number + detailIndex}>
                                    <td>{detail.mor_number ?? "-"}</td>
                                    <td>{detail.ordered_qty ?? "-"}</td>
                                    <td>-</td>
                                    <td>{detail.accepted_qty ?? "-"}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr key={item.id}>
                                  <td colSpan={4}>No MOR Details Available</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Delivery Details Section */}
                        <div className="mt-2">
                          <h5>Delivery Details</h5>
                        </div>
                        <div className="tbl-container me-2 mt-3">
                          <table className="w-100">
                            <thead>
                              <tr>
                                <th className="fw-bold">Delivery Date</th>
                                <th className="fw-bold">Delivery Qty</th>
                                <th className="fw-bold">Batch No.</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.mor_delivery_details.length > 0 ? (
                                item.mor_delivery_details.map(
                                  (delivery, deliveryIndex) => (
                                    <tr key={deliveryIndex}>
                                      <td>
                                        {/* <FormattedDate date= {batch.mfg_date || "-"} /> */}

                                        {delivery.po_delivery_date || "-"}
                                      </td>
                                      <td>{delivery.po_delivery_qty || "-"}</td>
                                      <td>{item.batch_no || "-"}</td>{" "}
                                      {/* Using batch_no from the outer item object */}
                                    </tr>
                                  )
                                )
                              ) : (
                                <tr>
                                  <td colSpan={3}>
                                    No Delivery Details Available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Material Batches Section */}
                      <div className="mt-2">
                        <h5>Material Batches</h5>
                      </div>
                      <div className="tbl-container me-2 mt-3">
                        <table className="w-100">
                          <thead>
                            <tr>
                              <th>Material Batch No.</th>
                              <th>Qty</th>
                              <th>Mfg. Date</th>
                              <th>Expiry Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.material_batches.length > 0 ? (
                              item.material_batches.map((batch, batchIndex) => (
                                <tr key={batch.batch_no + batchIndex}>
                                  <td>{batch.batch_no || "-"}</td>
                                  <td>{batch.quantity || "-"}</td>
                                  <td>
                                    <FormattedDate
                                      date={batch.mfg_date || "-"}
                                    />
                                  </td>
                                  <td>
                                    <FormattedDate
                                      date={batch.expiry_date || "-"}
                                    />
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4}>
                                  No Material Batches Available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Defective Material Remark Section */}
                      <div className="row mt-3">
                        <div className="col-md-4">
                          <div className="form-group">
                            <label className="po-fontBold">
                              Defective Material Remark
                            </label>
                            <input
                              className="form-control"
                              placeholder={"-"}
                              type="text"
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className=" d-flex justify-content-between align-items-center">
                  <h5 className=" mt-3">Document Attachment</h5>
                </div>
                <div className="  mt-2">
                  <div className="tbl-container px-0  m-0">
                    <table className="w-100">
                      <thead className="w-100">
                        <tr>
                          <th className="main2-th">Sr. No.</th>
                          <th className="main2-th">Document Name</th>
                          <th className="main2-th">File Name</th>
                          <th className="main2-th">File Type</th>
                          <th className="main2-th">Upload Date</th>
                          <th className="main2-th">Attachment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.attachments?.map((item, index) => (
                          <tr>
                            <td>{index+1}</td>
                            <td>{item.document_file_name || "-"}</td>
                            <td>{item.file_name || "-"}</td>
                            <td>{item.document_content_type || "-"}</td>
                            <td>
                              <FormattedDate date={item.created_at || "-"} />
                            </td>
                            <td></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Comments</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder={data?.comment || "-"}
                        defaultValue={""}
                        value={comments}
                        onChange={handleCommentsChange}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Remark</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder={data?.remark || "-"}
                        defaultValue={""}
                        value={remarks}
                        onChange={handleRemarksChange}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Comments</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        defaultValue={""}
                        value={comments}
                        onChange={handleCommentsChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row justify-content-end align-items-center  mt-3 pb-3">
                  <div className=" " style={{ width: 300 }}>
                    <div className="d-flex gap-3 align-items-end w-100">
                      <label className="">Status</label>
                      <Select
                        className="w-100"
                        options={statuses}
                        value={
                          selectedStatus ||
                          statuses.find(
                            (status) => status.value === data?.status
                          )
                        } // Ensures value is an object with { value, label }
                        onChange={handleStatusChange}
                        isClearable // Allows clearing the selection
                        placeholder="Select a status"
                        classNamePrefix="react-select" // Apply custom classes using the prefix
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-2 justify-content-end">
                  <div className="col-md-2">
                    <button className="purple-btn2 w-100">Print</button>
                  </div>
                  <div className="col-md-2">
                    <button
                      onClick={handleUpdateStatus}
                      className="purple-btn2 w-100"
                    >
                      Submit
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button
                      className="purple-btn1 w-100"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </button>{" "}
                  </div>
                </div>

                <section className=" mb-3">
                  <h5 className=" mt-3">Audit Log</h5>
                  <div className="">
                    <div className="tbl-container px-0">
                      <table
                        className="w-100"
                        style={{ width: "100% !important" }}
                      >
                        <thead>
                          <tr>
                            <th style={{ width: "66px !important" }}>Sr.No.</th>
                            <th>User</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Remark</th>
                            <th>Comments</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.audit_logs?.map((item, index) => (
                            <tr>
                              <th>{index+1}</th>
                              <td>{item.user || "-"}</td>
                              <td>
                                {item.date || "-"} 
                              </td>
                              <td>{item.status || "-"}</td>

                              <td>{item.remark || "-"}</td>
                              <td>{item.comment || "-"}</td>
                            </tr>
                          ))}
                        </tbody>{" "}
                      </table>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default GoodReceiveNoteDetails;
