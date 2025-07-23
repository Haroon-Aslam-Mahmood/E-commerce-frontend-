import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "./ProductPage.css";
import ProductCard from "./ProductCard";
import NavBar from "./NavBar/NavBar";
import axios from "axios";

const ProductPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasNextPage: false,
    totalProducts: 0,
    totalPages: 0,
  });

  // Ref to store the fetch function
  const fetchProductsRef = useRef(null);

  useEffect(() => {
    const fetchProductsByCategory = async (page = 1, append = false) => {
      try {
        if (!append) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError("");

        // Convert URL category format to database format
        const dbCategory = category.replace(/-/g, " ");

        const response = await axios.get(
          `https://e-commerce-backend-j8ie.onrender.com/api/products/${dbCategory}?page=${page}&limit=4`
        );

        // Handle successful fetch
        console.log("Products fetching successful:", response.data);

        if (append) {
          setProducts((prev) => [...prev, ...response.data.products]);
        } else {
          setProducts(response.data.products);
        }

        setPagination(response.data.pagination);
      } catch (error) {
        // Handle fetch error
        if (error.response && error.response.data) {
          setError(error.response.data.message);
        } else {
          setError(
            "An error occurred while fetching products. Please try again."
          );
        }
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    // Store the function in ref instead of window
    fetchProductsRef.current = fetchProductsByCategory;

    if (category) {
      // Reset products and pagination when category changes
      setProducts([]);
      setPagination({
        currentPage: 1,
        hasNextPage: false,
        totalProducts: 0,
        totalPages: 0,
      });
      fetchProductsByCategory(1, false);
    }
  }, [category]);

  const loadMoreProducts = () => {
    if (pagination.hasNextPage && !loadingMore && fetchProductsRef.current) {
      fetchProductsRef.current(pagination.currentPage + 1, true);
    }
  };

  const formatCategoryName = (category) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="product-page">
          <p>Loading products...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="product-page">
          <h1>{formatCategoryName(category)}</h1>
          <p className="error-message">{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="product-page">
        <h1>{formatCategoryName(category)}</h1>

        {pagination.totalProducts > 0 && (
          <p className="products-count">
            Showing {products.length} of {pagination.totalProducts} products
          </p>
        )}

        <div className="products-grid">
          {products.length > 0
            ? products.map((product) => (
                <ProductCard
                  key={product._id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  product={product}
                />
              ))
            : !loading && <p>No products found in this category.</p>}
        </div>

        {pagination.hasNextPage && (
          <div className="load-more-container">
            <button
              className="load-more-btn"
              onClick={loadMoreProducts}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load More Products"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductPage;
