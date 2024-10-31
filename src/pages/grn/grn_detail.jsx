import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure Bootstrap JS is included
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function GoodReceiveNoteDetails() {
  const { id } = useParams(); // Extract 'id' from the URL
  const location = useLocation(); // Access the location object
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    // Simulating fetching data from an API
    const fetchData = () => {
      // Assuming the status data is received here
      const statusData = {
        "status_logs": [
          {
            "status_log": {
              "remarks": "Status updated",
              "comments": "Changed status to submitted",
              "status": "submitted"
            }
          },
          {
            "status_log": {
              "remarks": "Draft created",
              "comments": "Draft status is now active",
              "status": "draft"
            }
          },
          {
            "status_log": {
              "remarks": "Status updated",
              "comments": "Changed status to approved",
              "status": "approved"
            }
          }
        ]
      };

      // Extracting statuses
      const extractedStatuses = statusData.status_logs.map(log => log.status_log.status);
      setStatuses(extractedStatuses);
      setSelectedStatus(extractedStatuses[0]); // Default to the first status
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (data?.status) {
      setSelectedStatus(data.status);
    }
  }, [data?.status]);

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

 



  const handleRemarksChange = (event) => {
    setRemarks(event.target.value); // Update remarks dynamically
  };
  const handleCommentsChange = (event) => {
    setComments(event.target.value); // Update remarks dynamically
  };

  const handleUpdateStatus = async () => {
    const payload = {
      status_log: {
        remarks: remarks,
        comments: comments,
        status: selectedStatus,
      }
    };

    console.log(JSON.stringify(payload));

    try {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');

      const response = await fetch(`https://marathon.lockated.com/good_receive_notes/${id}/update_status.json?token=${token}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

     

      const data = await response.json();
      toast.success('Status updated successfully!');

    } catch (error) {
      toast.error('Failed to update status. Please try again.');
    }
  };




  useEffect(() => {
    // Get the token from the query parameters
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    // Check if the token is present


    // Construct the API URL using the id and token
    const apiUrl = `https://marathon.lockated.com/good_receive_notes/${id}.json?token=${token}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch details.');
        }
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
  }, [id, location.search, navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


  console.log(data);


  return (
  
  
  <>      
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
                          {data?.company_name ?? "NULL"}
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
                          {data?.project ?? "NULL"}

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
                          {data?.sub_project ?? "NULL"}

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
                          {data?.wing ?? "NULL"}

                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                      <div className="col-6 ">
                        <label>GRN ID </label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">: </span>
                          {data?.id ?? "NULL"}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                      <div className="col-6 ">
                        <label>GRN NO</label>
                      </div>
                      <div className="col-6">
                        <label className="text">
                          <span className="me-3">:</span>
                          {data?.grn_number ?? "NULL"}
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
                          {data?.grn_date ?? "NULL"}
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
                          {data?.to_store ?? "NULL"}

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
                          {data?.supplier ?? "NULL"}

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
                          {data?.challan_number ?? "NULL"}
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

                          {data?.gate_entry_no ?? "NULL"}

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
                          {data?.challan_date ?? "NULL"}
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
                          {data?.remark ?? "NULL"}
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
                          {data?.vehicle_no ?? "NULL"}

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
                          {data?.description ?? "NULL"}
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
                          {data?.po_number ?? "NULL"}


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
                          {data?.gate_number ?? "NULL"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {data?.grn_materials?.map((item, index) => (
  <div className="card mt-3" key={item.id || item.mor_inventory?.id}>
    <div className="card-header">
      <h3 className="card-title">Material Details ({index + 1}/{data.grn_materials.length})</h3>
      <div className="card-tools">
        <button type="button" className="btn btn-tool">
          <svg width={32} height={32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx={16} cy={16} r={16} fill="#8B0203" />
            <path d="M16 24L9.0718 12L22.9282 12L16 24Z" fill="white" />
          </svg>
        </button>
      </div>
    </div>
    <div className="card-body mt-1 pt-1">
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
            </tr>
            <tr>
              <th>Ordered</th>
              <th>Received Up to</th>
              <th>Received</th>
              <th>Breakage</th>
              <th>Defective</th>
              <th>Accepted</th>
              <th>Cumulative</th>
              <th>Tolerance Qty</th>
              <th>Inspection Date</th>
              <th>Warranty Date</th>
            </tr>
          </thead>
          <tbody>
            <tr key={item.id || item.mor_inventory?.id}>
              <td>{item.mor_inventory?.inventory?.material_description || "NULL"}</td>
              <td>{item.mor_inventory?.inventory?.is_qc ? "Yes" : "No"}</td>
              <td>{item.mor_inventory?.inventory?.mtc_required ? "Yes" : "No"}</td>
              <td>{item.mor_inventory?.inventory?.uom_name || "NULL"}</td>
              <td>{item.mor_inventory?.ordered_quantity || "NULL"}</td>
              <td>{item.received_till_date || "NULL"}</td>
              <td>{item.received || "NULL"}</td>
              <td>{item.breakage || "NULL"}</td>
              <td>{item.defective || "NULL"}</td>
              <td>{item.accepted || "NULL"}</td>
              <td>{item.cumulative || "NULL"}</td>
              <td>{item.tolerence_quantity || "NULL"}</td>
              <td>{item.mor_inventory?.inventory?.inspection_date || "NULL"}</td>
              <td>{item.mor_inventory?.inventory?.warranty_period || "NULL"}</td>
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
                    <td>{detail.mor_number ?? "NULL"}</td>
                    <td>{detail.ordered_qty ?? "NULL"}</td>
                    <td>-</td>
                    <td>{detail.accepted_qty ?? "NULL"}</td>
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
                item.mor_delivery_details.map((delivery, deliveryIndex) => (
                  <tr key={deliveryIndex}>
                    <td>{delivery.po_delivery_date || "NULL"}</td>
                    <td>{delivery.po_delivery_qty || "NULL"}</td>
                    <td>{item.batch_no || "NULL"}</td> {/* Using batch_no from the outer item object */}
                    </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No Delivery Details Available</td>
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
                  <td>{batch.batch_no || "NULL"}</td>
                  <td>{batch.quantity || "NULL"}</td>
                  <td>{batch.mfg_date || "NULL"}</td>
                  <td>{batch.expiry_date || "NULL"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No Material Batches Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Defective Material Remark Section */}
      <div className="row mt-3">
        <div className="col-md-4">
          <div className="form-group">
            <label className="po-fontBold">Defective Material Remark</label>
            <input
              className="form-control"
              placeholder={ "NULL"}
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
                          <th className="main2-th">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>-</th>
                          <td>-</td>
                          <th>-</th>
                          <td>-</td>
                          <th>-</th>
                          <td>
                            <i
                              className="fa-regular fa-eye"
                              data-bs-toggle="modal"
                              data-bs-target="#document_attchment"
                              style={{ fontSize: 18 }}
                            />
                          </td>
                        </tr>
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
                        placeholder={data?.comment || "NULL"}
                        defaultValue={""}
                        value={comments}
                        onChange={handleCommentsChange}
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
                        placeholder={data?.remark || "NULL"}
                        defaultValue={""}
                        value={remarks}
                        onChange={handleRemarksChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row justify-content-end align-items-center  mt-2">
                  <div className="col-md-3 ">
                  <label className="">Status</label>
                  <select className="form-select" id="status" value={selectedStatus} onChange={handleStatusChange} placeholder={data?.status}>
                  <option value="" disabled> {/* Placeholder option */}
                  {data?.status || "Select Status"}
                </option>
                   
                    {statuses.map((status, index) => (
                      <option key={index} value={status}>{status}</option>
                    ))}
                  </select>
                  </div>
                 
                </div>
                <div className="row mt-2 justify-content-end">
                  <div className="col-md-2">
                    <button className="purple-btn2 w-100">Print</button>
                  </div>
                  <div className="col-md-2">
                    <button onClick={handleUpdateStatus} className="purple-btn2 w-100">Submit</button>
                  </div>
                  <div className="col-md-2">
                    <button className="purple-btn1 w-100">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
        </div>
      </div>
      <ToastContainer />

      </>  
      
    );
}
