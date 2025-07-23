import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { cartService } from "../utils/CartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();

  // Fetch cart data when authentication changes
  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const cartData = await cartService.getCart();
      setCartItems(cartData.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to load cart");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since it doesn't depend on any props or state

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      if (newQuantity === 0) {
        await cartService.removeFromCart(itemId);
      } else {
        await cartService.updateCartItem(itemId, newQuantity);
      }
      await fetchCart();
    } catch (error) {
      console.error("Error updating cart:", error);
      throw error;
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartService.removeFromCart(itemId);
      await fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  const addToCart = async (item) => {
    try {
      await cartService.addToCart(item);
      await fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    error,
    fetchCart,
    updateQuantity,
    removeItem,
    clearCart,
    addToCart,
    getTotalPrice,
    getTotalItems,
    isAuthenticated: isAuthenticated(),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartContext };
