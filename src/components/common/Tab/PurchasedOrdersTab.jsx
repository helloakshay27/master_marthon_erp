import axios from "axios";
import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { useParams } from "react-router-dom";
import { baseURL } from "../../../confi/apiDomain";

const PurchasedOrdersTab = forwardRef((props, ref) => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [purchaseOrdersLoading, setPurchaseOrdersLoading] = useState(false);
    const [error, setError] = useState(null);

    const { eventId } = useParams();

    const fetchPurchaseOrders = async () => {
        setPurchaseOrdersLoading(true);
        setError(null);
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get("token");
        try {
            const response = await axios.get(
                `${baseURL}rfq/events/${eventId}/purchase_orders?token=${token}`
            );
            console.log("Purchase Orders:", response.data);
            setPurchaseOrders(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setPurchaseOrdersLoading(false);
        }
    };

    // Expose refresh function to parent component
    useImperativeHandle(ref, () => ({
        refreshData: fetchPurchaseOrders
    }));

    useEffect(() => {
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
            <div className="mt-4">
                <h4>Purchased Orders</h4>
                {purchaseOrdersLoading && (
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p>Loading purchase orders...</p>
                    </div>
                )}
                {error && (
                    <div className="alert alert-danger">
                        Error loading purchase orders: {error}
                    </div>
                )}
                {!purchaseOrdersLoading && !error && purchaseOrders.length === 0 && (
                    <div className="alert alert-info">
                        No purchase orders found.
                    </div>
                )}
                {!purchaseOrdersLoading && !error && purchaseOrders.length > 0 && (
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
                                                    href={`https://procurement.lockated.com/purchase_orders/${order.id}?layout=true`}
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
                )}
            </div>
        </div>
    );
});

PurchasedOrdersTab.displayName = 'PurchasedOrdersTab';

export default PurchasedOrdersTab;
