import "./ProductCard.css";
import { useState } from "react";
import AddToCartPage from "./Cart/AddToCartPage";
import { cartService } from "../utils/CartService";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({
  name = "Product Name",
  price = 3500,
  image,
  product,
  onAddToCart,
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      alert("Please login to add items to cart");
      return;
    }

    setLoading(true);
    try {
      await cartService.addToCart(product._id, 1);
      setIsCartOpen(true);
      if (onAddToCart) {
        onAddToCart({ name, price, image });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || "Error adding to cart");
    } finally {
      setLoading(false);
    }
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  return (
    <>
      <div className="product-card">
        {image && (
          <div className="product-image-container">
            <img src={image} alt={name} className="product-image" />
          </div>
        )}
        <div className="product-info">
          <h3 className="product-name">{name}</h3>
          <p className="product-price">PKR {price.toLocaleString()}</p>
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

      <AddToCartPage isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default ProductCard;
