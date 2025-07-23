import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
    sizes: "",
    colors: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://e-commerce-backend-j8ie.onrender.com/api/products`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        sizes: productForm.sizes
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        colors: productForm.colors
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c),
      };

      if (editingProduct) {
        await axios.put(
          `https://e-commerce-backend-j8ie.onrender.com/api/products/${editingProduct._id}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("Product updated successfully");
      } else {
        await axios.post(
          `https://e-commerce-backend-j8ie.onrender.com/api/products`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("Product added successfully");
      }

      setProductForm({
        name: "",
        price: "",
        category: "",
        description: "",
        image: "",
        sizes: "",
        colors: "",
      });
      setShowAddForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description || "",
      image: product.image || "",
      sizes: product.sizes?.join(", ") || "",
      colors: product.colors?.join(", ") || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `https://e-commerce-backend-j8ie.onrender.com//api/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="manage-section">
      <div className="section-header">
        <h2>Manage Products</h2>
        <div className="section-actions">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button
            className="add-btn"
            onClick={() => {
              setShowAddForm(true);
              setEditingProduct(null);
              setProductForm({
                name: "",
                price: "",
                category: "",
                description: "",
                image: "",
                sizes: "",
                colors: "",
              });
            }}
          >
            Add Product
          </button>
          <button className="refresh-btn" onClick={fetchProducts}>
            Refresh
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="form-modal">
          <div className="form-content">
            <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Product Name"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm({ ...productForm, price: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={productForm.category}
                onChange={(e) =>
                  setProductForm({ ...productForm, category: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Description"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    description: e.target.value,
                  })
                }
              />
              <input
                type="url"
                placeholder="Image URL"
                value={productForm.image}
                onChange={(e) =>
                  setProductForm({ ...productForm, image: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Sizes (comma separated)"
                value={productForm.sizes}
                onChange={(e) =>
                  setProductForm({ ...productForm, sizes: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Colors (comma separated)"
                value={productForm.colors}
                onChange={(e) =>
                  setProductForm({ ...productForm, colors: e.target.value })
                }
              />
              <div className="form-actions">
                <button type="submit">
                  {editingProduct ? "Update" : "Add"} Product
                </button>
                <button type="button" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>Rs {product.price.toLocaleString()}</td>
                <td className="actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
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

export default ManageProducts;
