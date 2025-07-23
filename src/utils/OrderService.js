import axios from "axios";

const API_BASE_URL = `https://e-commerce-backend-j8ie.onrender.com/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post("/orders", orderData);
      return response.data;
    } catch (error) {
      console.error("Order creation failed:", error);
      throw error;
    }
  },

  // Get user's orders
  getUserOrders: async () => {
    try {
      const response = await api.get("/orders");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      throw error;
    }
  },

  // Get specific order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch order:", error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to cancel order"
      );
    }
  },

  // Process payment
  processPayment: async (paymentData) => {
    try {
      const response = await api.post("/orders/payment", paymentData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Payment processing failed"
      );
    }
  },
};

export const handleOrderError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return data.message || "Invalid order data";
      case 401:
        return "Please log in to place an order";
      case 404:
        return "Order not found";
      case 500:
        return "Server error. Please try again later";
      default:
        return data.message || "An error occurred";
    }
  } else if (error.request) {
    return "Network error. Please check your connection";
  } else {
    return error.message || "An unexpected error occurred";
  }
};

export default orderService;
