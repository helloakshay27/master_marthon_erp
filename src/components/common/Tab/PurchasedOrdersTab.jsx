import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

    const columns = [
        { label: "PO Number", key: "po_number" },
        { label: "PO Date", key: "po_date" },
        { label: "PO Type", key: "po_type" },
        { label: "Consumption", key: "consumption" },
        { label: "Company Name", key: "company_name" },
        { label: "Project Name", key: "project_name" },
        { label: "PMS Site Name", key: "pms_site_name" },
        { label: "Material Type", key: "material_type" },
        { label: "MOR Number", key: "mor_number" },
        { label: "Supplier Advance", key: "supplier_advance" },
        { label: "Supplier Advance Amount", key: "supplier_advance_amount" },
        { label: "Supplier Name", key: "supplier_name" },
        { label: "Department Name", key: "department_name" },
        { label: "Tax Applicable Cost", key: "tax_applicable_cost" },
        { label: "Total Value", key: "total_value" },
        { label: "Status", key: "status" },
    ];

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
                    <table className="tbl-container">
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.key}>{col.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseOrders.map((order) => (
                                <tr key={order.id}>
                                    {columns.map((col) => (
                                        <td key={col.key}>
                                            {col.key === "po_number" ? (
                                                <a
                                                    href={`${baseURL}/purchase_orders/${order.id}?layout=true`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ textDecoration: "underline" }}
                                                >
                                                    {order[col.key]}
                                                </a>
                                            ) : Array.isArray(order[col.key]) ? (
                                                order[col.key].join(", ")
                                            ) : (
                                                order[col.key] || "N/A"
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
