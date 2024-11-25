import React from "react";
import DropdownCollapseIcon from "../Icon/DropdownCollapseIcon";
import AttachmentIcon from "../Icon/AttachmentIcon";
import DocumentAttachmentTable from "../Table/DocumentAttachmentTable";
import DeliveryScheduleTable from "../Table/DeliveryScheduleTable";

export default function OrderDetails({
  orderDropdown,
  orderDetails,
  materialOneDropdown,
  materialOne,
  handleAttachmentModalShow,
  handleDocumentModalShow,
  materialTwoDropdown,
  materialTwo,
  handleVendorModalShow,
}) {
  return (
    <div className="card pb-3 rounded-4 mt-4">
      <div className="card-header bg-white border-0 rounded-0 ">
        <h3 className="card-title">Order Details</h3>
        <div className="card-tools">
          <button
            type="button"
            className="btn btn-tool mt-0"
            data-card-widget="collapse"
            onClick={orderDropdown}
          >
            <DropdownCollapseIcon isCollapsed={orderDetails} />
          </button>
        </div>
      </div>
      {orderDetails && (
        <div className="card-body">
          <div className="card card-default" id="mor-material-details">
            <div className="card-header bg-white border-0">
              <h3 className="card-title">Material Details (1/2)</h3>
              <div className="card-tools">
                <button
                  type="button"
                  className="btn btn-tool mt-0"
                  data-card-widget="collapse"
                  onClick={materialOneDropdown}
                >
                  <DropdownCollapseIcon isCollapsed={materialOne} />
                </button>
              </div>
            </div>
            <div className="card-body1 p-3" style={{ display: "none" }}>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="po-fontBold">MOR No</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="MOR/MAR/101/02/2024"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="po-fontBold">Material</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Plain grey tiles"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="po-fontBold">Order Qty</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder={"12000"}
                    />
                  </div>
                </div>
              </div>
            </div>

            {materialOne && (
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Company</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                      >
                        <option selected>MNRL</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Delaware</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Washington</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Project</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                      >
                        <option selected>Neo-valley</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Delaware</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Washington</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Sub-Project</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                      >
                        <option selected>NeoValley- Building</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Delaware</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Washington</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>MOR Number</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="MOR/MAR/101/02/2024"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Material Sub Type</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Tiles"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Material</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Plain white tiles"
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>UOM</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Nos"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Order Qty</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={"10000"}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Minimum Tick Size</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Price Cap</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Nos"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Tick Size %age</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={"10000"}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Vendor Enable Fields</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                      >
                        <option selected>5 Fields Selected</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Delaware</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Washington</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 mt-2">
                    <div className="form-group">
                      <label>Material Specification</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mt-2">
                    <div className="form-group">
                      <label>Material Description</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className=" d-flex justify-content-between align-items-center mt-2">
                    <h5 className=" mt-3">Document Attachment</h5>
                    <button
                      className="purple-btn2 m-0"
                      data-bs-toggle="modal"
                      data-bs-target="#file_attachement"
                      onClick={handleAttachmentModalShow}
                    >
                      <AttachmentIcon />
                      <span className="ms-2">Attachment File </span>
                    </button>
                  </div>
                  <div className="mt-2">
                    <DocumentAttachmentTable
                      handleDocumentModalShow={handleDocumentModalShow}
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <h5 className=" ">Delivery Schedule</h5>
                    <div className="card-tools">
                      <button className="purple-btn2">
                        <span className="material-symbols-outlined align-text-top me-2">
                          add{" "}
                        </span>
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <DeliveryScheduleTable />
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <h5 className=" ">Special Terms &amp; Conditions</h5>
                  </div>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      rows={5}
                      placeholder=""
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="card card-default mt-4" id="mor-material-details">
            <div className="card-header bg-white border-0">
              <h3 className="card-title">Material Details (2/2)</h3>
              <div className="card-tools">
                <button
                  type="button"
                  className="btn btn-tool mt-0"
                  data-bs-toggle="modal"
                  data-bs-target="#"
                  data-card-widget="collapse"
                  onClick={materialTwoDropdown}
                >
                  <DropdownCollapseIcon isCollapsed={materialTwo} />
                </button>
              </div>
            </div>
            <div className="card-body1 p-3" style={{ display: "none" }}>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="po-fontBold">MOR No</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="MOR/MAR/101/02/2024"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="po-fontBold">Material</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Plain grey tiles"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="po-fontBold">Order Qty</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder={"12000"}
                    />
                  </div>
                </div>
              </div>
            </div>
            {materialTwo && (
              <div className="card-body">
                {/* /.card-header */}
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Company</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                      >
                        <option selected>MNRL</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Delaware</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Washington</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Project</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                      >
                        <option selected>Neo-valley</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Delaware</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Washington</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Sub-Project</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                      >
                        <option selected>NeoValley- Building</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Delaware</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Washington</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>MOR Number</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="MOR/MAR/101/02/2024"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Material Sub Type</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Tiles"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Material</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Plain white tiles"
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>UOM</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Nos"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Order Qty</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={"10000"}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Minimum Tick Size</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Price Cap</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Nos"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Tick Size %age</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={"10000"}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Vendor Enable Fields</label>
                      <select
                        className="form-control form-select"
                        style={{ width: "100%" }}
                      >
                        <option selected>5 Fields Selected</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Delaware</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Washington</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 mt-2">
                    <div className="form-group">
                      <label>Material Specification</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mt-2">
                    <div className="form-group">
                      <label>Material Description</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className=" d-flex justify-content-between align-items-center mt-2">
                    <h5 className=" mt-3">Document Attachment</h5>
                    <button
                      className="purple-btn2 m-0"
                      data-bs-toggle="modal"
                      data-bs-target="#file_attachement"
                      onClick={handleAttachmentModalShow}
                    >
                      <AttachmentIcon />
                      <span className="ms-2">Attachment File </span>
                    </button>
                  </div>
                  <div className="mt-2">
                    <DocumentAttachmentTable
                      handleDocumentModalShow={handleDocumentModalShow}
                    />
                  </div>
                  <div className="d-flex justify-content-between mt-2 align-items-center">
                    <h5 className=" ">Delivery Schedule</h5>
                    <div className="card-tools">
                      <button className="purple-btn2">
                        <span className="material-symbols-outlined align-text-top me-2">
                          add{" "}
                        </span>
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <DeliveryScheduleTable />
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <h5 className=" ">Special Terms &amp; Conditions</h5>
                  </div>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      rows={5}
                      placeholder=""
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="d-flex justify-content-between align-items-end">
              <h5 className=" ">Select Vendors</h5>
              <div className="card-tools">
                <button
                  className="purple-btn2"
                  data-bs-toggle="modal"
                  data-bs-target="#venderModal"
                  onClick={handleVendorModalShow}
                >
                  <span className="material-symbols-outlined align-text-top me-2">
                    add{" "}
                  </span>
                  <span>Add</span>
                </button>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="tbl-container px-0 mx-3  mt-3 ">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>Vendor Name</th>
                      <th>Mob No.</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Vendor 1</td>
                      <td>99999999</td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <h5 className=" ">General Terms &amp; Conditions</h5>
            </div>
            <div className="form-group">
              <textarea
                className="form-control"
                rows={5}
                placeholder=""
                defaultValue={""}
              />
            </div>
          </div>
          <div className="row mt-4 justify-content-end">
            <div className="col-md-3">
              <div className="form-group d-flex gap-3 align-items-center">
                <label style={{ fontSize: "1.1rem" }}>status</label>
                <select
                  className="form-control form-select"
                  style={{ width: "100%" }}
                >
                  <option selected>Alabama</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-end">
            <div className="col-md-2">
              <button className="purple-btn2 w-100">Preview</button>
            </div>
            <div className="col-md-2">
              <button className="purple-btn2 w-100">Submit</button>
            </div>
            <div className="col-md-2">
              <button className="purple-btn1 w-100">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
