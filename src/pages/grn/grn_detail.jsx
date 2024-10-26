import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure Bootstrap JS is included


export default function GoodReceiveNoteDetails() {
  const { id } = useParams(); // Extract 'id' from the URL
  const location = useLocation(); // Access the location object
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [materialOneCollapse, setMaterialOneCollapse] = useState(true)
  const [materialTwoCollapse, setMaterialTwoCollapse] = useState(true)

  const handleMaterialOne = () => {
    setMaterialOneCollapse(!materialOneCollapse)
  }
  const handleMaterialTwo = () => {
    setMaterialTwoCollapse(!materialTwoCollapse)
  }


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
                          {data?.company_name}
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
                          {data?.grn_number}
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
                          {data?.grn_date}
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
                          {data?.challan_number}
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
                          {data?.challan_date}
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
                          {data?.remark}
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
                          {data?.description}
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
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card mt-3">
                  <div className="card-header">
                    <h3 className="card-title">Material Details (1/2)</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        onClick={handleMaterialOne}
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
                  {materialOneCollapse && (
                  <div className="card-body mt-1 pt-1">
                    <div className="mt-2">
                      <h5 className=" ">Materials</h5>
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
                          {data.grn_materials.map((item, id) => {
                            return (
                              <tr key={id}>
                                <td>         {item.mor_inventory?.inventory?.material_description}
                                </td>
                                <td></td>
                                <td></td>
                                <td>
                                  {item.mor_inventory?.inventory?.uom_name}
                                </td>
                                <td>{item.mor_inventory?.ordered_quantity}</td>
                                <td></td>
                                <td>{item.received}</td>
                                <td>{item.breakage}</td>
                                <td>{item.defective}</td>
                                <td>{item.accepted}</td>
                                <td></td>
                                <td>{item.tolerence_quantity}</td>
                                <td></td>
                                <td></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="card p-3">
                      <div className="mt-2">
                        <h5 className=" ">MOR Details</h5>
                      </div>
                      <div className="tbl-container me-2 mt-3">
                        <table className="w-100">
                          <thead>
                            <tr>
                              <th>MOR No.</th>
                              <th>MOR Ordered</th>
                              <th>Received Upto GRN</th>
                              <th>Received Upto Date</th>
                              <th>MOR Accepted</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.grn_materials.map((item, id) => {
                                return (
                                  <tr key={id}>
                                    <td>{item.mor_details?.mor_number}</td>
                                    <td>
                                      {item.mor_details?.ordered_qty}
                                    </td>
                                    <td>{item?.received}</td>
                                    <td></td>
                                    <td>{item.mor_details?.accepted_qty}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-2">
                        <h5 className=" ">Delivery Details</h5>
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





                            
                          {data.grn_materials.map((item, id) => {
                                return (
                                   <tr>
                              <td>{item.mor_delivery_details?.po_delivery_date}</td>
                              <td>{item.mor_delivery_details?.po_delivery_qty}</td>
                              <td>{item?.batch_no}</td>
                            </tr>

                                );
                                <tr>
                                <th></th>
                                <th></th>
                                <th />
                              </tr>
                             })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="">
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
                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td />
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="po-fontBold">
                            Defective Material Remark
                          </label>
                          <input
                            className="form-control"
                            placeholder={data?.remark}
                            type="text" disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
                {/* <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Material Details (2/2)</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        onClick={handleMaterialTwo}
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
                  {materialTwoCollapse && (
                  <div className="card-body pt-1 mt-1">
                    <div className="mt-2">
                      <h5 className=" ">Materials</h5>
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
                          {data.grn_materials.map((item, id) => {
                            return (
                              <tr key={id}>
                                <td>{item.description}</td>
                                <td></td>
                                <td></td>
                                <td>
                                  {item.mor_inventory?.inventory?.uom_name}
                                </td>
                                <td>{item.mor_inventory?.ordered_quantity}</td>
                                <td>{item.received_till_date}</td>
                                <td>{item.received}</td>
                                <td>{item.breakage}</td>
                                <td>{item.defective}</td>
                                <td>{item.accepted}</td>
                                <td></td>
                                <td>{item.tolerence_quantity}</td>
                                <td></td>
                                <td />
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="card p-3">
                      <div className="mt-2">
                        <h5 className=" ">MOR Details</h5>
                      </div>
                      <div className="tbl-container me-2 mt-3">
                        <table className="w-100">
                          <thead>
                            <tr>
                              <th>MOR No.</th>
                              <th>MOR Ordered</th>
                              <th>Received Upto GRN</th>
                              <th>Received Upto Date</th>
                              <th>MOR Accepted</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.grn_materials.map((item, id) => {
                                return (
                                  <tr key={id}>
                                    <td>{item.mor_inventory?.mor_id}</td>
                                    <td>
                                      {item.mor_inventory?.ordered_quantity}
                                    </td>
                                    <td>{item?.received}</td>
                                    <td>-</td>
                                    <td>{item?.accepted}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-2">
                        <h5 className=" ">Delivery Details</h5>
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
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <th>Total</th>
                              <th></th>
                              <th />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="">
                      <h5 className=" ">Material Batches</h5>
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
                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td />
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="po-fontBold">
                            Defective Material Remark
                          </label>
                          <input
                            className="form-control"
                            placeholder="Material"
                            type="text" disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  )}
                </div> */}
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
                          <th></th>
                          <td></td>
                          <th></th>
                          <td></td>
                          <th></th>
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
                        type="text"
                        placeholder={data?.comment || 'Null'}
                        defaultValue={""} disabled
                        
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end align-items-center gap-3 mt-2">
                  <p className="">Status</p>
                  <div className="dropdown">
                    <button
                      className="btn purple-btn2 btn-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                    GRN Draft
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
                </div>
                <div className="row mt-2 justify-content-end">
                  <div className="col-md-2">
                    <button className="purple-btn2 w-100">Print</button>
                  </div>
                  <div className="col-md-2">
                    <button className="purple-btn2 w-100">Submit</button>
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
    
      </>  
      
    );
}
