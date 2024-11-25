import React from "react";
import Table from "../../base/Table/Table";
import { orderSummaryColumns, orderSummaryData } from "../../../constant/data";

export default function OrderSummaryTable() {
  return (
    <Table
      columns={orderSummaryColumns}
      data={orderSummaryData}
      showCheckbox={true}
    />
  );
}
