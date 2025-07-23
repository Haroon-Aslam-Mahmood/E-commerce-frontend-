import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { orderService } from "../utils/OrderService";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Try to get order from location state first
        if (location.state?.orderData) {
          setOrder(location.state.orderData.order || location.state.orderData);
          setLoading(false);
          return;
        }

        // If no state data, fetch from API
        if (orderId) {
          const orderData = await orderService.getOrderById(orderId);
          setOrder(orderData);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Could not load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, location.state]);

  const formatPrice = (price) => {
    return `Rs ${price.toLocaleString()}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="order-confirmation-container">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-confirmation-container">
        <div className="error-message">
          <h2>Order Not Found</h2>
          <p>{error || "We could not find your order details."}</p>
          <button onClick={() => navigate("/")} className="btn-home">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-container">
      <div className="confirmation-header">
        <div className="success-icon">✓</div>
        <h1>Order Confirmed!</h1>
        <p>
          Thank you for your purchase. Your order has been received and is being
          processed.
        </p>
      </div>

      <div className="order-details">
        <div className="order-info">
          <h2>Order Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Order ID:</label>
              <span>{order.orderId || order._id}</span>
            </div>
            <div className="info-item">
              <label>Order Date:</label>
              <span>{formatDate(order.orderDate || order.createdAt)}</span>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <span className={`status ${order.orderStatus}`}>
                {order.orderStatus}
              </span>
            </div>
            <div className="info-item">
              <label>Payment Method:</label>
              <span>
                {order.paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : "Credit Card"}
              </span>
            </div>
          </div>
        </div>

        <div className="order-items">
          <h2>Order Items</h2>
          <div className="items-list">
            {order.items?.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-details">
                  <h4>{item.name}</h4>
                  {item.size && <p>Size: {item.size}</p>}
                  {item.color && <p>Color: {item.color}</p>}
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="item-price">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>
                {order.shipping > 0 ? formatPrice(order.shipping) : "Free"}
              </span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="shipping-info">
          <h2>Shipping Address</h2>
          <div className="address">
            <p>
              {order.shippingAddress?.firstName}{" "}
              {order.shippingAddress?.lastName}
            </p>
            <p>{order.shippingAddress?.address}</p>
            {order.shippingAddress?.apartment && (
              <p>{order.shippingAddress.apartment}</p>
            )}
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
              {order.shippingAddress?.zipCode}
            </p>
            <p>{order.shippingAddress?.country}</p>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <button onClick={() => navigate("/orders")} className="btn-view-orders">
          View All Orders
        </button>
        <button onClick={() => navigate("/")} className="btn-continue-shopping">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
