import React from "react";
import Table from "../base/Table/Table";
import {
  freightData,
  resposneVendorColumns,
  resposneVendorData,
} from "../../constant/data";
import ShortTable from "../base/Table/ShortTable";

export default function ResponseVendor() {
  return (
    <div>
      <div className="p-3 border-bottom">
        <h5 style={{textTransform:'uppercase'}}>Sumangal</h5>
        <div className="d-flex">
          <p>{`Submitted : 04:49 pm, 26th Nov 2024`}</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          padding: "1rem 1.5rem",
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div
          style={{
            flex: 1,
            paddingRight: "1rem",
            borderRight: "1px solid #e0e0e0",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              color: "#333",
              marginBottom: "0.5rem",
            }}
          >
            Supplier Location
          </p>
          <p style={{ color: "#555", fontSize: "0.9rem" }}>-</p>
        </div>
        <div
          style={{
            flex: 1,
            paddingRight: "1rem",
            borderRight: "none", 
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              color: "#333",
              marginBottom: "0.5rem",
            }}
          >
            Bid Placed By
          </p>
          <p style={{ color: "#555", fontSize: "0.9rem" }}>-</p>
        </div>
      </div>

      <div className="p-3">
        <Table columns={resposneVendorColumns} data={resposneVendorData} />

        <div className="text-center">
          <div className="d-flex justify-content-end">
            <ShortTable data={freightData} />
          </div>
          <div className="d-flex align-items-center justify-content-end mt-2">
            <p>Gross Total</p>
            <p
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginLeft: "10px",
              }}
            >
              ₹5,69,350.66
            </p>
          </div>
          <div className="d-flex justify-content-center">
            <button className="btn viewBy-bid-main-left">
              <i className="bi bi-chevron-left"></i>
            </button>
            <p className="m-0 viewBy-bid-main-p">Current Bid 1</p>
            <button className=" btn viewBy-bid-main-right">
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
