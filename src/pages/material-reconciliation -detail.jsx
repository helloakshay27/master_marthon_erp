import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import SingleSelector from "../components/base/Select/SingleSelector";
import { baseURL } from "../confi/apiDomain";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import { useParams } from 'react-router-dom';


const MaterialReconciliationDetail = () => {
  const { id } = useParams()
  const [details, setDetails] = useState(null); // Store API data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  // Fetch data from API
  useEffect(() => {
    axios
      .get(
        `${baseURL}material_reconciliations/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((response) => {
        setDetails(response.data); // Set API data
        setLoading(false); // Set loading to false
      })
      .catch((err) => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, [id]);

  // Filter out the current selected value (boqDetails.status) from the options list
  const options = [
    {
      label: 'Select Status',
      value: '',
      // isDisabled: false,
    },
    {
      label: 'Draft',
      value: 'draft',
      // isDisabled: boqDetails.status === 'draft',
    },
    {
      label: 'Submitted',
      value: 'submitted',
      // isDisabled: boqDetails.status === 'submitted',
    },
    {
      label: 'Approved',
      value: 'approved',
      // isDisabled: boqDetails.status === 'approved',
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-3 pt-2 ">
          {/* <a href="">
            Home &gt; Store &gt; Store Operations &gt; Material Reconciliation
          </a> */}
          {/* <div className="card"> */}
              {/* <h5 className="mt-2">Material Reconciliation</h5> */}
              <CollapsibleCard title="Material Reconciliation">
              <div className="card-body ">
              <div className="row mt-3">
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                  <div className="col-6">
                    <label>Company </label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3" style={{color:"black"}}>:</span>
                     <span>{details.company.name}</span> 
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                  <div className="col-6">
                    <label>Project</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3" style={{color:"black"}}>:</span>
                      <span>{details.project.name}</span> 
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                  <div className="col-6">
                    <label>Sub-Project</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3" style={{color:"black"}}>:</span>
                      <span>{details.sub_project.name}</span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                  <div className="col-6">
                    <label>Store</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3" style={{color:"black"}}>:</span>
                      <span>{details.store.name}</span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                  <div className="col-6">
                    <label>Material Reco. No.</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3" style={{color:"black"}}>:</span>
                      <span>{details.reco_number}</span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                  <div className="col-6">
                    <label>Date</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3" style={{color:"black"}}>:</span>
                      <span>{details.reco_date.split("-").reverse().join("-")}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className=" d-flex justify-content-between align-items-end px-2  mt-3">
                <h5 className=" ">Material</h5>
              </div>
              <div className="tbl-container mx-2 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>Sr.No.</th>
                      <th>Material</th>
                      
                      <th>
                        Stock As on 
                      </th>
                      <th>Rate (Weighted Average)(INR)</th>
                      <th>Deadstock Qty</th>
                      <th>Theft / Missing Qty</th>
                      <th>Adjustment Quantity</th>
                      <th>Adjustment Rate(INR)</th>
                      <th>Adjustment Value(INR)</th>
                      <th>Net Quantity</th>
                      <th>Remarks</th>
                      <th>Reason</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  
                    {details.material_reconciliation_items.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.material}</td>
                        <td> {item.stock_as_on}</td>
                        <td> {item.rate}</td>
                        <td>{item.deadstock_qty}</td>
                        <td> 
                        <input
                          className="form-control"
                          type="text"
                          value={item.theft_or_missing_qty}
                          // placeholder="Default input"
                        />
                        </td>
                        <td> 
                        <input
                          className="form-control"
                          type="text"
                          value={item.adjustment_qty}
                          // placeholder="Default input"
                        />
                        </td>
                        <td> 
                        <input
                          className="form-control"
                          type="text"
                          value={item.adjustment_rate}
                          // placeholder="Default input"
                        />
                        </td>
                        <td>
                        <input
                          className="form-control"
                          type="text"
                          value={item.adjustment_value}
                          // placeholder="Default input"
                        />
                        </td>
                        <td>{item.net_quantity}</td>
                        <td>{item.remarks}</td>
                        <td>{item.reason}</td>
                        <td>
                        <button className="btn">
                          <svg
                            width={18}
                            height={18}
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.76 6L6 11.76M6 6L11.76 11.76"
                              stroke="#8B0203"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                              stroke="#8B0203"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                 
                 
                  {/* {item.deadstock_qty} */}
                  {/* {item.theft_or_missing_qty} */}
                  {/* {item.adjustment_qty} */}
                  {/* {item.adjustment_rate}
                  <td>{item.net_quantity}</td>
                        <td>{item.remarks}</td>
                        <td>{item.reason}</td> */}
                </table>
              </div>
              </div>
              </CollapsibleCard>
          <div className="row mx-1 mt-3">
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
        
          <div className="row mt-4 justify-content-end align-items-center mx-2">
                        <div className="col-md-3">
                          <div className="form-group d-flex gap-3 align-items-center mx-3">
                            <label style={{ fontSize: '1.1rem', color: 'black' }}>Status</label>
          
                            {/* <select className="form-control form-select" style={{ width: '100%' }} value={status} onChange={handleStatusChange} >
          
                              <option disabled={boqDetails.status} selected >{boqDetails.status}</option>
                              <option value="" >Select Status</option>
                              <option value="draft" disabled={boqDetails.status === 'draft'} >Draft</option>
                              <option value="submitted" disabled={boqDetails.status === 'submitted'}>Submitted</option>
                              <option value="approved" disabled={boqDetails.status === 'approved'}>Approved</option>
                            </select> */}
          
          
                            <SingleSelector
                              options={options}
                              // onChange={handleStatusChange}
                              placeholder={`Select Status`} // Dynamic placeholder
                              classNamePrefix="react-select"
                            />
                          </div>
                        </div>
                      </div>
          <div className="row mt-2 justify-content-end">
           
            <div className="col-md-2">
              <button className="purple-btn2 w-100">Submit</button>
            </div>
            <div className="col-md-2">
              <button className="purple-btn1 w-100">Cancel</button>
            </div>
          </div>
          <div className=" ">
            <h5 className=" ">Audit Log</h5>
          </div>
          <div className="tbl-container px-0">
            <table className="w-100">
              <thead>
                <tr>
                  <th>Sr.No.</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Remark</th>
                  {/* <th>Comments</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>Pratham Shastri</td>
                  <td>15-02-2024</td>
                  <td>Verified</td>
                  <td>  
                  </td>
                  {/* <td>
                  </td> */}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default MaterialReconciliationDetail;
