// VendorModal.js
import React from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";// Assuming this is a separate modal component you're using

const VendorModal = ({ show, onHide }) => {
  return (
    <DynamicModalBox
      show={show}
      onHide={onHide}
      size="lg"
      title="Select Vendors"
      footerButtons={[
        {
          label: "Save",
          onClick: onHide,
          props: {
            className: "purple-btn2",
          },
        },
      ]}
    >
      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label className="po-fontBold">Supplier Type</label>
            <input className="form-control" type="text" placeholder="Steel" />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label className="po-fontBold">Vendor Name</label>
            <input className="form-control" type="text" placeholder="All" />
          </div>
        </div>
        <div>
          <div className="d-flex justify-content-end my-2 mt-3">
            <form>
              <div className="input-group">
                <input
                  type="search"
                  id="searchInput"
                  className="form-control tbl-search"
                  placeholder="Type your keywords here"
                />
                <div className="input-group-append">
                  <button type="button" className="btn btn-md btn-default">
                    {/* SVG for search icon */}
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z"
                        fill="#8B0203"
                      />
                      <path
                        d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z"
                        fill="#8B0203"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="tbl-container px-0 mt-3">
            <table className="w-100">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Supplier Type</th>
                  <th>Vendor Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>Cement, Waterproofing</td>
                  <td>Sharda Chemical Pvt Ltd</td>
                  <td>Delivery Pending</td>
                </tr>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>Tiles, Granites, Cement, Sand</td>
                  <td>Ashirvad Ceramics</td>
                  <td>Not submitted Bid / Quotation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DynamicModalBox>
  );
};

export default VendorModal;
