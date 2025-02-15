import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Table from "../../base/Table/Table";
import { purchaseOrderColumns } from "../../../constant/data";
import { baseURL } from "../../../confi/apiDomain";

export default function PurchasedOrdersTab() {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [purchaseOrdersLoading, setPurchaseOrdersLoading] = useState(false);
    const [error, setError] = useState(null);

    const { eventId } = useParams();
    

  useEffect(() => {
    const fetchPurchaseOrders = async () => {

      setPurchaseOrdersLoading(true);
      try {
        const response = await axios.get(
          `${baseURL}rfq/events/${eventId}/purchase_orders?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        console.log("Purchase Orders:", response.data);

        setPurchaseOrders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setPurchaseOrdersLoading(false);
      }
    };

    fetchPurchaseOrders();
  }, [eventId]);

  return (
    <div
      className="tab-pane fade"
      id="purchasedOrders"
      role="tabpanel"
      aria-labelledby="purchasedOrders-tab"
      tabIndex={0}
    >
      {purchaseOrders.length > 0 && (
        <div className="mt-4">
          <h4>Purchased Orders</h4>
          <Table
            columns={purchaseOrderColumns}
            data={purchaseOrders}
            isHorizontal={false}
          />
        </div>
      )}
    </div>
  );
}
