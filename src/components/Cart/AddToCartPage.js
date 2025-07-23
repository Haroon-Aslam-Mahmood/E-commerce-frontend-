import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./CartPopup.css";
import { useCart } from "../../context/CartContext";

const AddToCartPage = ({ isOpen, onClose }) => {
  const {
    cartItems,
    loading,
    error,
    fetchCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isAuthenticated,
  } = useCart();

  // Fetch cart data when component opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchCart();
    }
  }, [isOpen, isAuthenticated]); // Removed fetchCart from dependencies

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      alert(error.response?.data?.message || "Error updating cart");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      alert(error.response?.data?.message || "Error removing item");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      alert(error.response?.data?.message || "Error clearing cart");
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        {isOpen && <div className="cart-overlay" onClick={onClose}></div>}
        <div className={`cart-popup ${isOpen ? "cart-popup-open" : ""}`}>
          <div className="cart-header">
            <h3>Shopping Cart</h3>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="cart-content">
            <div className="empty-cart">
              <p>Please login to view your cart</p>
              <button className="continue-shopping-btn" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={onClose}></div>}
      <div className={`cart-popup ${isOpen ? "cart-popup-open" : ""}`}>
        <div className="cart-header">
          <h3>Shopping Cart ({getTotalItems()})</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cart-content">
          {loading ? (
            <div className="empty-cart">
              <p>Loading cart...</p>
            </div>
          ) : error ? (
            <div className="empty-cart">
              <p>{error}</p>
              <button className="continue-shopping-btn" onClick={fetchCart}>
                Retry
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="empty-cart">
              <img
                src="/assets/images/emptyCart.png"
                alt="Empty cart"
                className="empty-cart-icon"
              />
              <p>Your cart is empty</p>
              <button className="continue-shopping-btn" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-specs">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && " | "}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <div className="item-price">
                        PKR {item.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="quantity-controls">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          handleUpdateQuantity(item._id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() =>
                          handleUpdateQuantity(item._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="item-total">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item._id)}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="subtotal">
                    <span>
                      Subtotal: PKR {getTotalPrice().toLocaleString()}
                    </span>
                  </div>
                  <div className="shipping">
                    <span>Shipping: Free</span>
                  </div>
                  <div className="total">
                    <strong>
                      Total: PKR {getTotalPrice().toLocaleString()}
                    </strong>
                  </div>
                </div>

                <div className="cart-actions">
                  <button className="view-cart-btn" onClick={handleClearCart}>
                    Clear Cart
                  </button>
                  <Link
                    className="checkout-btn"
                    to="/checkout"
                    onClick={onClose}
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AddToCartPage;
