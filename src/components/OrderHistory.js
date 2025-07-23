import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService, handleOrderError } from "../utils/OrderService";
import { useCart } from "../context/CartContext";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await orderService.getUserOrders();
        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(handleOrderError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const formatPrice = (price) => {
    return `Rs ${price.toLocaleString()}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ffc107",
      confirmed: "#28a745",
      processing: "#007bff",
      shipped: "#17a2b8",
      delivered: "#28a745",
      cancelled: "#dc3545",
    };
    return colors[status] || "#6c757d";
  };

  const viewOrderDetails = (orderId) => {
    navigate(`/order-confirmation/${orderId}`);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="order-history-container">
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history-container">
        <div className="error-message">
          <h2>Error Loading Orders</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-retry"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <div className="order-history-header">
        <h1>Order History</h1>
        <p>View and track all your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <h2>No Orders Yet</h2>
          <p>
            You haven't placed any orders. Start shopping to see your orders
            here!
          </p>
          <button onClick={() => navigate("/")} className="btn-start-shopping">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderId}</h3>
                  <p className="order-date">
                    {formatDate(order.orderDate || order.createdAt)}
                  </p>
                </div>
                <div className="order-status">
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusColor(order.orderStatus),
                    }}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <div className="order-items">
                {order.items?.slice(0, 3).map((item, index) => (
                  <div key={index} className="order-item">
                    {item.productId?.image && (
                      <img
                        src={item.productId.image}
                        alt={item.name}
                        className="item-image"
                      />
                    )}
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      {item.size && (
                        <span className="item-size">Size: {item.size}</span>
                      )}
                      <span className="item-quantity">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <div className="more-items">
                    +{order.items.length - 3} more items
                  </div>
                )}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span className="total-label">Total: </span>
                  <span className="total-amount">
                    {formatPrice(order.total)}
                  </span>
                </div>
                <button
                  onClick={() => viewOrderDetails(order.orderId)}
                  className="btn-view-details"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
