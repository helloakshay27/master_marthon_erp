import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseURL } from "../confi/apiDomain";
import SingleSelector from "../components/base/Select/SingleSelector";
// const dummyData = {
//   id: 23,
//   material_name: "CEMENT-CEMENT-OPC-53 GRADE-BIRLA-",
//   category: "Material",
//   stock_as_on: 1000.0,
//   total_received: 1000.0,
//   total_issued: 0.0,
//   last_received_on: "12/12/2024",
//   uom: "BAGS",
//   deadstock_qty: "",
//   missing_qty: "",
//   store: "",
//   stores: [
//     {
//       id: 1,
//       store_name: "Antilia",
//       balanced_qty: 1000.0,
//       stock_details: [
//         {
//           id: 41,
//           created_at: "2024-12-12T22:43:35.197+05:30",
//           mor: "MOR/974/10/2024",
//           grn_number: "GRN6518",
//           resource_number: "GRN6518",
//           status: "received",
//           uom: "BAGS",
//           supplier: null,
//           received_qty: 1000.0,
//           issued_qty: null,
//           returned_qty: null,
//           balanced_qty: 1000.0,
//         },
//       ],
//     },
//   ],
// };


const ErpStockRegisterCreationDetail13C = () => {
  const { id } = useParams(); // Extract the 'id' from the route

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedStoreDetails, setSelectedStoreDetails] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");

      const response = await fetch(
        `${baseURL}/stock_details/${id}.json?token=${token}`
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

  // When data or selectedStore changes, update selectedStoreDetails
  // useEffect(() => {
  //   // if (data && selectedStore) {
  //   //   const store = data.stores?.find((s) => s.id === selectedStore.value);
  //   //   setSelectedStoreDetails(store || null);
  //   // }


  //   if (data) {
  //   // Get store_id from URL (handle both ?store_id= and &store_id=)
  //   const urlParams = new URLSearchParams(window.location.search);
  //   let storeId = urlParams.get("store_id");
  //   if (!storeId) {
  //     // fallback for /:id&store_id=... style
  //     const match = window.location.pathname.match(/stock_register_detail\/\d+&store_id=(\d+)/);
  //     if (match) storeId = match[1];
  //   }
  //   // If storeId exists and no store is selected, preselect it
  //   if (storeId && !selectedStore) {
  //     const found = data.stores?.find((s) => String(s.store_id) === String(storeId));
  //     if (found) {
  //       setSelectedStore({ value: found.store_id, label: found.store_name });
  //       setSelectedStoreDetails(found);
  //       return;
  //     }
  //   }
  //   // If store is selected, update details as usual
  //   if (selectedStore) {
  //     const store = data.stores?.find((s) => s.store_id === selectedStore.value);
  //     setSelectedStoreDetails(store || null);
  //   }
  // }

  // }, [data, selectedStore]);

  useEffect(() => {
    if (data) {
      // Get store_id from URL (handle both ?store_id= and &store_id=)
      const urlParams = new URLSearchParams(window.location.search);
      let storeId = urlParams.get("store_id");
      if (!storeId) {
        // fallback for /:id&store_id=... style
        const match = window.location.pathname.match(/stock_register_detail\/\d+&store_id=(\d+)/);
        if (match) storeId = match[1];
      }
      // If storeId exists and no store is selected, preselect it
      if (storeId && !selectedStore) {
        const found = data.stores?.find((s) => String(s.store_id) === String(storeId));
        if (found) {
          setSelectedStore({ value: found.store_id, label: found.store_name });
          setSelectedStoreDetails(found);
          return;
        }
      }
      // If no storeId in URL and no store is selected, select the first store by default
      if (!storeId && !selectedStore && data.stores && data.stores.length > 0) {
        const first = data.stores[0];
        setSelectedStore({ value: first.store_id, label: first.store_name });
        setSelectedStoreDetails(first);
        return;
      }
      // If store is selected, update details as usual
      if (selectedStore) {
        const store = data.stores?.find((s) => s.store_id === selectedStore.value);
        setSelectedStoreDetails(store || null);
      }
    }
  }, [data, selectedStore]);

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section  details_page mx-3">
          <a href="">
            Home &gt; Store &gt; Store Operation &gt; Stock Register{" "}
          </a>
          <h5 className="mt-3">Stock Register</h5>
          <section className="mor  m-0" style={{ border: "none" }}>
            <div className="container-fluid">
              <div className="row my-4 align-items-center">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body ">
                      {/* <div>
                        <h5>Material Details</h5>
                      </div>
                      
                      <div className="row mb-3">
                        <div className="col-md-4">
                          <label>Select Store</label>
                          <SingleSelector
                            options={
                              data?.stores?.map((store) => ({
                                value: store.id,
                                label: store.store_name,
                              })) || []
                            }
                            
                            value={selectedStore}
                            onChange={setSelectedStore}
                            placeholder="Select Store"
                          />
                          {console.log("data:",data)}
                        </div>
                      </div> */}

                      <div className="d-flex align-items-center mb-3">
                        <h5 className="mb-0 me-4">Material Details</h5>
                        <label className="mb-0 ms-5 me-4">Store </label>
                        <div style={{ minWidth: 250 }}>
                          <SingleSelector
                            options={
                              data?.stores?.map((store) => ({
                                value: store.store_id,
                                label: store.store_name,
                              })) || []
                            }
                            value={selectedStore}
                            onChange={setSelectedStore}
                            placeholder="Select Store"
                          />
                        </div>
                        {console.log("data:", data)}
                      </div>
                      {/* Show selected store details */}
                      {/* {selectedStoreDetails && (
                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label>Store Name:</label>
                            <span className="ms-2">{selectedStoreDetails.store_name}</span>
                          </div>
                          <div className="col-md-4">
                            <label>Balanced Qty:</label>
                            <span className="ms-2">{selectedStoreDetails.balanced_qty}</span>
                          </div>
                        </div>
                      )} */}
                      <div className="row mt-5">
                        <div className="col-lg-12 col-md-6 col-sm-12 row px-2 mt-1">
                          <div className="col-3 ms-2">
                            <label>Material </label>
                          </div>
                          <div className="col-8 ps-0">
                            <label className="text">
                              <span className="me-3">:</span>
                              {data?.material_name}
                            </label>
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                          <div className="col-6 ">
                            <label>Material / Asset </label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3">:</span>
                              {data?.category}
                            </label>
                          </div>
                        </div>
                        {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                          <div className="col-6 ">
                            <label>Store </label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3">:</span>
                              {data?.store || "-"}
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
                              {data?.uom || "-"}
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                          <div className="col-6 ">
                            <label>Stock Type</label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3">:</span>-
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                          <div className="col-6 ">
                            <label>Material Threshold</label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3">:</span>-
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                          <div className="col-6 ">
                            <label>Deadstock Qty</label>
                          </div>
                          <div className="col-6">
                            <label className="text">
                              <span className="me-3">:</span>
                              {data?.deadstock_qty || "-"}
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
                                data-bs-target="#Available-Details"
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
                                data-bs-target="#Rejected-Details"
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
                              <div className="tbl-container me-2 mt-3" style={{ maxHeight: "500px" }}>
                                <table className="w-100">
                                  <thead>
                                    <tr>
                                      <th>Sr. No.</th>
                                      <th>Date</th>
                                      <th>MOR</th>
                                      <th>Supplier/Contractor</th>
                                      <th>GRN / Issue / Return / MTO No.</th>
                                      <th>Status</th>
                                      <th>UOM</th>
                                      <th>Received Qty</th>
                                      <th>Issued Qty</th>
                                      <th>Return Qty</th>
                                      <th>Current Stock</th>
                                      {/* <th>Remark</th> */}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(!selectedStoreDetails || !selectedStoreDetails.stock_details || selectedStoreDetails.stock_details.length === 0) ? (
                                      <tr>
                                        <td colSpan={11} className="text-center text-muted">
                                          Please select a store to view material details.
                                        </td>
                                      </tr>
                                    ) : (
                                      <>
                                        {selectedStoreDetails.stock_details.map((item, id) => (
                                          <tr key={id}>
                                            <td>{id + 1}</td>
                                            <td>{new Date(item?.created_at).toLocaleDateString("en-GB")}</td>
                                            <td>{item?.mor}</td>
                                            <td>{item?.supplier || "-"}</td>
                                            <td>{item?.resource_number}</td>
                                            <td>{item?.status}</td>
                                            <td>{item?.uom || "-"}</td>
                                            <td>{item?.received_qty || "-"}</td>
                                            <td>{item?.issued_qty || "-"}</td>
                                            <td>{item?.returned_qty || "-"}</td>
                                            <td></td>
                                          </tr>
                                        ))}
                                        {/* {data?.stores.map((item, id) => (
                                          <tr key={`balance-${id}`}>
                                            <td></td>
                                            <td><strong>Balanced Qty</strong></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><strong>{item?.balanced_qty}</strong></td>
                                          </tr>
                                        ))} */}

                                        {data?.stores
                                          .filter((item) => String(item.store_id) === String(selectedStore?.value))
                                          .map((item, id) => (
                                            <tr key={`balance-${id}`}>
                                              <td></td>
                                              <td><strong>Balanced Qty</strong></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td><strong>{item?.balanced_qty}</strong></td>
                                            </tr>
                                          ))}
                                      </>
                                    )}
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
                                      <td>-</td>
                                      <td />
                                      <td></td>
                                      <td />
                                      <td>
                                        <select
                                          className="form-control form-select"
                                          style={{ width: "100%" }}
                                          fdprocessedid="622i99"
                                        >
                                          <option selected="selected"></option>
                                        </select>
                                      </td>
                                      <td></td>
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
      {/* <Footer /> */}
    </>
  );
};

export default ErpStockRegisterCreationDetail13C;
