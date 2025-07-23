import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const SERVER_PORT = process.env.SERVER_PORT || "3001";

  const orderStatuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://e-commerce-backend-j8ie.onrender.com/api/orders/admin`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `https://e-commerce-backend-j8ie.onrender.com/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const formatPrice = (price) => {
    return `Rs ${price.toLocaleString()}`;
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderId?.toString().includes(searchTerm) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="manage-section">
      <div className="section-header">
        <h2>Manage Orders</h2>
        <div className="section-actions">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="refresh-btn" onClick={fetchOrders}>
            Refresh
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>#{order.orderId}</td>
                <td>{order.customerEmail}</td>
                <td>{order.items?.length || 0} items</td>
                <td>{formatPrice(order.total)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusUpdate(order._id, e.target.value)
                    }
                    className={`status-select ${order.orderStatus}`}
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="actions">
                  <button
                    className="action-btn view-btn"
                    onClick={() => alert("View order details coming soon")}
                  >
                    View
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => alert("Edit order coming soon")}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
