import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Ensure Bootstrap JS is included
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL1 } from "../../confi/apiDomain";
import Select from "react-select"; // Importing the react-select component
import FormattedDate from "../../components/FormattedDate";

const GoodReceiveNoteDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [loadStatus, setLoadStatus] = useState("");

  const [remarks, setRemarks] = useState("");
  const [comments, setComments] = useState("");
  const [collapsed, setCollapsed] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Toggle collapse state for the card
  const toggleCollapse = (index) => {
    setCollapsed((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the state of the clicked card
    }));
  };
  const approvalLogs = [
    {
      id: 1,
      approvalLevel: 'L 1',
      approvedBy: 'Sachind Kale',
      date: '13-02-2025 12:22:28',
      status: 'Approved',
      remark: 'Approved By Sachin',
      users: 'Sachind Kale',
    },
    {
      id: 2,
      approvalLevel: 'L 2',
      approvedBy: 'Jitendra Kale',
      date: '13-02-2025 12:24:24',
      status: 'Approved',
      remark: 'Approved by Jitendra',
      users: 'Jitendra Kale',
    },
    // Add more entries as needed
  ];








  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const apiUrl = `${baseURL1}/good_receive_notes/${id}.json?token=${token}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch details.");

        const data = await response.json();
        const { status_list, selected_status, disabled } = data; // ✅ Correct structure

        // Format statuses for react-select
        const formattedStatuses = status_list.map((status) => ({
          label: status,
          value: status.toLowerCase(),
        }));

        setStatuses(formattedStatuses);

        // Preselect the matching status
        const preselectedStatus = formattedStatuses.find(
          (status) => status.value === selected_status.toLowerCase()
        );
        setSelectedOption(preselectedStatus);
        setLoadStatus(selected_status.toLowerCase());
        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [id, baseURL1]);

  const handleStatusChange = (selectedOption) => {
    if (data?.disabled) {
      toast.error("Status change is not allowed.");
      return;
    }
    setSelectedOption(selectedOption);
    setLoadStatus(selectedOption.value);
  };

  const handleUpdateStatus = async () => {
    if (data?.disabled) {
      toast.error("Status update is not allowed.");
      return;
    }

    const payload = {
      status_log: {
        remarks: remarks,
        comment: comments,
        status: loadStatus,
      },
    };
    setLoading(true);

    console.log(JSON.stringify(payload));

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const response = await fetch(
        `${baseURL1}/good_receive_notes/${id}/update_status.json?token=${token}`,
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
    finally {
      setLoading(false);
    }

  };



  return (
    <>
      <ToastContainer />

      <div className="website-content overflow-auto details_page">
        <div className="module-data-section container-fluid details_page p-4">
          <a href="">Home &gt; Store &gt; Store Operations &gt; GRN</a>
          <div className="row my-4 align-items-center">
            <div className="col-md-12 px-2">

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

              <div className="col-md-12 mb-3 row">
                <div className="col-md-9">
                  <h5 style={{ fontWeight: "bold" }}>GRN Details</h5>
                </div>
                <div className="col-md-2 nav-item">
                  <button
                    className="purple-btn2"
                    onClick={openModal}

                  >
                    <span>Approval Logs</span>
                  </button>
                </div>
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
                      className={`card-body mt-1 pt-1 ${collapsed[index] ? "d-none" : ""
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
                                      <td>{delivery.batch_no || "-"}</td>{" "}
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
                              placeholder={item.defective_reason || "-"}
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
                            <td>{index + 1}</td>
                            <td>{item.document_file_name || "-"}</td>
                            <td>{item.file_name || "-"}</td>
                            <td>{item.document_content_type || "-"}</td>
                            <td>
                              <FormattedDate date={item.created_at || "-"} />
                            </td>
                            <td>
                              {item.doc_path ? (
                                <a
                                  href={item.doc_path}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <button className="btn btn-md">
                                    <svg
                                      width={15}
                                      height={16}
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
                                </a>
                              ) : (
                                "-"
                              )}
                            </td>
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
                        onChange={(e) => setRemarks(e.target.value)}
                        disabled={data?.disabled}
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
                        onChange={(e) => setComments(e.target.value)}
                        disabled={data?.disabled}
                      />
                    </div>
                  </div>
                </div>
                <div className="row justify-content-end align-items-center mt-3 pb-3">
                  <div className="" style={{ width: 300 }}>
                    <div className="d-flex gap-3 align-items-end w-100">
                      <label className="">Status</label>
                      {statuses.length > 0 ? (
                        <Select
                          className="w-100"
                          options={statuses}
                          value={selectedOption}
                          onChange={handleStatusChange}
                          isClearable
                          isDisabled={data?.disabled} // Disable dropdown if `disabled: true`
                          placeholder="Select a status"
                          classNamePrefix="react-select"
                        />
                      ) : (
                        <p className="text-muted">Loading statuses...</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row mt-2 justify-content-end">
                  {/* <div className="col-md-2">
                    <button className="purple-btn2 w-100">Print</button>
                  </div> */}

                  {/* </div> */}

                  <div className="col-md-2">
                    <div >
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
                          <p>Submitting ...</p>
                        </div>
                      )}
                      <button
                        onClick={handleUpdateStatus}
                        className="purple-btn2 w-100"
                        disabled={data?.disabled}
                      >
                        Update
                      </button>
                    </div>
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
                              <th>{index + 1}</th>
                              <td>{item.user || "-"}</td>
                              <td>{item.date || "-"}</td>
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



      {isModalOpen && (
        <div
          className="modal fade show"
          id="log"
          tabIndex={-1}
          aria-labelledby="amendModalLabel"
          style={{ display: "block", paddingLeft: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fs-5" id="exampleModalLabel">
                  Approval Log
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="row mt-2 px-2">
                  <div className="col-12">
                    <div className="tbl-container me-2 mt-3">
                      {/* Check if approval_logs is empty or undefined */}
                      {!data?.approval_logs || data.approval_logs.length === 0 ? (
                        // Display a message if no logs are available
                        <div className="text-center py-4">
                          <p className="text-muted">No approval logs available.</p>
                        </div>
                      ) : (
                        // Render the table if logs are available
                        <table className="w-100" style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th style={{ width: "66px !important" }}>Sr.No.</th>
                              <th>Approval Level</th>
                              <th>Approved By</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Remark</th>
                              <th>Users</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.approval_logs.map((log, id) => (
                              <tr key={id}>
                                <td>{id + 1}</td>
                                <td>{log.approval_level}</td>
                                <td>{log.approved_by}</td>
                                <td>{log.date}</td>
                                <td>
                                  <span
                                    className="px-2 py-1 rounded text-white"
                                    style={{
                                      backgroundColor: log.status === "Pending" ? "red" : "green"
                                    }}
                                  >
                                    {log.status}
                                  </span>
                                </td>

                                <td>
                                  <p>{log.remark}</p>
                                </td>
                                <td>{log.users}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};
export default GoodReceiveNoteDetails;
