import axios from "axios";
import { getAuthHeaders } from "./auth";

const API_BASE_URL = `https://e-commerce-backend-j8ie.onrender.com/api/cart`;

export const cartService = {
  // Get user's cart
  getCart: async () => {
    const response = await axios.get(API_BASE_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1, size, color) => {
    const response = await axios.post(
      `${API_BASE_URL}/add`,
      {
        productId,
        quantity,
        size,
        color,
      },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  // Update item quantity
  updateCartItem: async (itemId, quantity) => {
    const response = await axios.put(
      `${API_BASE_URL}/update/${itemId}`,
      {
        quantity,
      },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    const response = await axios.delete(`${API_BASE_URL}/remove/${itemId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await axios.delete(`${API_BASE_URL}/clear`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};
