import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ErpStockRegisterCreationDetail13C = () => {
  const { id } = useParams(); // Extract the 'id' from the route

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(
        `https://marathon.lockated.com/pms/inventories/${id}.json?token=4ad0c1cd2506a717ae19ed050c28d7f078b0210991571e47`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      console.log(result);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid details_page">
          <a href="">
            Home &gt; Store &gt; Store Operation &gt; Stock Register{" "}
          </a>
          <h5 className="mt-3">Stock Register</h5>
          <section className="mor  m-0" style={{ border: "none" }}>
            <div className="">
              <div className="row my-4 align-items-center">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body ">
                      <div>
                        <h5>Material Details</h5>
                      </div>
                      <div className="row mt-4">
                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                          <div className="col-6 ">
                            <label>Store </label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3">:</span>Null
                             
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                          <div className="col-6 ">
                            <label>Material Category </label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3">:</span>
                              {data?.category}
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                          <div className="col-6 ">
                            <label>Material Code </label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3">:</span>
                              {data?.material_code}
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                          <div className="col-6 ">
                            <label>Material Type </label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3">:</span>
                              {data?.material_type}
                            </label>
                          </div>
                        </div>
                        {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                          <div className="col-6 ">
                            <label>Material Sub-Type</label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3">:</span>
                              PO/SRPL/NXZPh2/18254
                            </label>
                          </div>
                        </div> */}
                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                          <div className="col-6 ">
                            <label>Material </label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3">:</span>
                              {data?.name}
                            </label>
                          </div>
                        </div>
                        {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                          <div className="col-6 ">
                            <label>Material Description </label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3">:</span>
                              {data?.material_description}
                            </label>
                          </div>
                        </div> */}
                        {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                          <div className="col-6 ">
                            <label>Specification</label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3">:</span>LANDMARK REALTY
                            </label>
                          </div>
                        </div> */}
                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                          <div className="col-6 ">
                            <label>UOM</label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3">:</span>
                              {data?.uom_name}
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                          <div className="col-6 ">
                            <label>Stock Type</label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3">:</span>Null
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                          <div className="col-6 ">
                            <label>Material Threshold</label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3">:</span>Null
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                          <div className="col-6 ">
                            <label>Deadstock Qty</label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3">:</span>Null
                            </label>
                          </div>
                        </div>
                      </div>
                      <section className="mor mt-4">
                        <div className="">
                          <nav>
                            <div
                              className="nav nav-tabs"
                              id="nav-tab"
                              role="tablist"
                            >
                              <button
                                className="nav-link active"
                                id="nav-home-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#Available-Details
                                    "
                                type="button"
                                role="tab"
                                aria-controls="nav-home"
                                aria-selected="true"
                              >
                                Available Material Details
                              </button>
                              <button
                                className="nav-link"
                                id="nav-profile-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#Rejected-Details
                                    "
                                type="button"
                                role="tab"
                                aria-controls="nav-profile"
                                aria-selected="false"
                              >
                                Rejected Material Details
                              </button>
                            </div>
                          </nav>
                          <div className="tab-content" id="nav-tabContent">
                            <div
                              className="tab-pane fade show active"
                              id="Available-Details"
                              role="tabpanel"
                              aria-labelledby="nav-home-tab"
                              tabIndex={0}
                            >
                              <div className="tbl-container me-2 mt-3">
                                <table className="w-100">
                                  <thead>
                                    <tr>
                                      <th>Sr. No.</th>
                                      <th>Date</th>
                                      <th>MOR</th>
                                      <th>Supplier/Contractor/Store</th>
                                      <th>GRN / Issue / Return / MTO No.</th>
                                      <th>Status</th>
                                      <th>UOM</th>
                                      <th>Received Qty</th>
                                      <th>Issued Qty</th>
                                      <th>Requested Qty</th>
                                      <th>Remark</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {data?.stock_details.map((item, id) => {
                                      return (
                                        <tr key={id}>
                                          <td>{id + 1}</td>
                                          <td>{item?.created_at}</td>
                                          <td>{item?.mor}</td>
                                          <td />
                                          <td>{item?.resource_number}</td>
                                          <td>{item?.status}</td>
                                          <td></td>
                                          <td>{item?.received_qty}</td>
                                          <td>{item?.issued_qty}</td>
                                          <td></td>
                                          <td />
                                        </tr>
                                      );
                                    })}
                                    <tr>
                                      <td></td>
                                      <td>Balanced Qty</td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td>{data?.stock_as_on}</td>{" "}
                                      {/* Display stock_as_on only once */}
                                      <td></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div
                              className="tab-pane fade"
                              id="Rejected-Details"
                              role="tabpanel"
                              aria-labelledby="nav-profile-tab"
                              tabIndex={0}
                            >
                              <div className="tbl-container me-2 mt-3">
                                <table className="w-100">
                                  <thead>
                                    <tr>
                                      <th>Sr. No.</th>
                                      <th>Description of Material</th>
                                      <th>Date</th>
                                      <th>MOR</th>
                                      <th>GRN</th>
                                      <th>UOM</th>
                                      <th>Rejected Qty</th>
                                      <th>Remark</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>1</td>
                                      <td>Defective Material from Vendor</td>
                                      <td />
                                      <td>MOR/MAR/MAX/101/02/2024</td>
                                      <td />
                                      <td>
                                        <select
                                          className="form-control form-select"
                                          style={{ width: "100%" }}
                                          fdprocessedid="622i99"
                                        >
                                          <option selected="selected">
                                            NOS
                                          </option>
                                          <option>Alaska</option>
                                          <option>California</option>
                                          <option>Delaware</option>
                                          <option>Tennessee</option>
                                          <option>Texas</option>
                                          <option>Washington</option>
                                        </select>
                                      </td>
                                      <td>+50</td>
                                      <td />
                                    </tr>
                                    <tr>
                                      <td />
                                      <th>Total Rejected Qty</th>
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
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ErpStockRegisterCreationDetail13C;
