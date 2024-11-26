import React from "react";
import Table from "../../base/Table/Table";

export default function ComparisonTab() {
  const columns = [
    { label: 'Material', key: 'material' },
    { label: 'Vendor Name', key: 'vendorname' },
    { label: 'Awarded Qty', key: 'awardedqty' },
    { label: 'Remark', key: 'remark' }
  ];

  const data = [
    {
      material:"Material 1",
      vendorname: '',
      awardedqty: '',
      remark: ''
    },
    {
      material:"Material 2",
      vendorname: '',
      awardedqty: '',
      remark: ''
    },
    {
      material:"Total",
      vendorname: '',
      awardedqty: '',
      remark: ''
    }
  ]
  return (
    <div
      className="tab-pane fade show "
      id="comparison"
      role="tabpanel"
      aria-labelledby="responses-tab"
      tabIndex={0}
    >
      <h5 className="mt-3">Comparison Summary</h5>
      <div className="tbl-container">
        <table className="table">
          <thead>
            <tr>
              <th style={{ verticalAlign: "middle" }} rowSpan={2}>
                Material
              </th>
              <th className="text-center" colSpan={4}>
                Budget
              </th>
              <th colSpan={1}></th>
              <th style={{ verticalAlign: "middle" }} rowSpan={2}>
                Order Qty
              </th>
              <th className="text-center" colSpan={5}>
                Vendor 1
              </th>
              <th className="text-center" colSpan={5}>
                {" "}
                Vendor 2
              </th>
              <th className="text-center" colSpan={5}>
                Vendor 3
              </th>
              <th style={{ verticalAlign: "middle" }} rowSpan={2}>
                Total Awarded Qty
              </th>
              <th style={{ verticalAlign: "middle" }} rowSpan={2}>
                Pending to Award Qty
              </th>
            </tr>
            <tr>
              <th>Rate</th>
              <th>Qty</th>
              <th>Remaining Qty</th>
              <th>Cost</th>
              <th>Remaining Cost</th>
              <th>Available Qty</th>
              <th>Rate</th>
              <th>Discount %</th>
              <th>Discounted Rate</th>
              <th>Bid Amount</th>
              <th>Available Qty</th>
              <th>Rate</th>
              <th>Discount %</th>
              <th>Discounted Rate</th>
              <th>Bid Amount</th>
              <th>Available Qty</th>
              <th>Rate</th>
              <th>Discount %</th>
              <th>Discounted Rate</th>
              <th>Bid Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Material 1</td>
              <td>35.00</td>
              <td>100000</td>
              <td>50000</td>
              <td>3500000.00</td>
              <td>1750000.00</td>
              <td>10000</td>
              <td>10000</td>
              <td>30.00</td>
              <td>05.00 %</td>
              <td>28.50</td>
              <td
                data-bs-toggle="modal"
                data-bs-target="#award"
                style={{
                  color: "var(--red)",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                300000.00
              </td>{" "}
              <td>10000</td>
              <td>30.00</td>
              <td>05.00 %</td>
              <td>28.50</td>
              <td
                data-bs-toggle="modal"
                data-bs-target="#award"
                style={{
                  color: "var(--red)",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                300000.00
              </td>{" "}
              <td>10000</td>
              <td>30.00</td>
              <td>05.00 %</td>
              <td>28.50</td>
              <td
                data-bs-toggle="modal"
                data-bs-target="#award"
                style={{
                  color: "var(--red)",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                300000.00
              </td>
              <td>10000</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Material 2</td>
              <td>35.00</td>
              <td>100000</td>
              <td>50000</td>
              <td>3500000.00</td>
              <td>1750000.00</td>
              <td>10000</td>
              <td>10000</td>
              <td>30.00</td>
              <td>05.00 %</td>
              <td>28.50</td>
              <td
                data-bs-toggle="modal"
                data-bs-target="#award"
                style={{
                  color: "var(--red)",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                300000.00
              </td>{" "}
              <td>10000</td>
              <td>30.00</td>
              <td>05.00 %</td>
              <td>28.50</td>
              <td
                data-bs-toggle="modal"
                data-bs-target="#award"
                style={{
                  color: "var(--red)",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                300000.00
              </td>{" "}
              <td>10000</td>
              <td>30.00</td>
              <td>05.00 %</td>
              <td>28.50</td>
              <td
                data-bs-toggle="modal"
                data-bs-target="#award"
                style={{
                  color: "var(--red)",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                300000.00
              </td>
              <td>10000</td>
              <td>0</td>
            </tr>
            <tr>
              <th>Total Quoted</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th>22000</th>
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th>22000</th>
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th>22000</th>
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <td />
              <td />
            </tr>
            <tr>
              <th>Total Discount %</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <th />
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <td />
              <td />
            </tr>
            <tr>
              <th>Quoted Average Rate</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <th />
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <td />
              <td />
            </tr>
            <tr>
              <th>Quoted Rate Difference</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <th />
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <td />
              <td />
            </tr>
            <tr>
              <th>Level Against Quoted Rate</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <th />
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <td />
              <td />
            </tr>
            <tr>
              <th>Discounted Average Rate</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <th />
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <td />
              <td />
            </tr>
            <tr>
              <th>Discounted Rate Difference</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <th />
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <td />
              <td />
            </tr>
            <tr>
              <th>Level Against Discounted Rate</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <th />
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <td />
              <td />
            </tr>
            <tr>
              <th>Other Charges</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <th />
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <td />
              <td />
            </tr>
            <tr>
              <th>Sub Total</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <th />
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <td />
              <td />
            </tr>
            <tr>
              <th>GST</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <th />
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <td />
              <td />
            </tr>
            <tr>
              <th>Grand Total</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <th />
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <td />
              <td />
            </tr>
            <tr>
              <th>Payment Terms</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <th />
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <th />
              <td></td>
              <td></td>
              <td></td>
              <th>22000</th>
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </div>
      <h5>Awarded Material summary</h5>
      <Table columns={columns} data={data} style={{margin:'0 !important'}} />
      {/* <div className="tbl-container">
        <table className="table w-100">
          <thead>
            <tr>
              <th>Material</th>
              <th>Vendor Name</th>
              <th>Awarded Qty</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Material 1</td>
              <td />
              <td />
              <td />
            </tr>
            <tr>
              <td>Material 2</td>
              <td />
              <td />
              <td />
            </tr>
            <tr>
              <td>Total</td>
              <td />
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </div> */}
    </div>
  );
}
