import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ManageAccounts from "./ManageAccounts";
import ManageOrders from "./ManageOrders";
import ManageProducts from "./ManageProducts";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeCategory, setActiveCategory] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    // Check if user is admin (assuming admin has category 'admin')
    if (user?.category !== "admin") {
      alert("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }

    setIsLoading(false);
  }, [user, isAuthenticated, navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  const categories = [
    {
      id: "accounts",
      title: "Manage Accounts",
      icon: "👥",
      description:
        "View, edit, and manage customer accounts and user permissions",
      count: "150+ Users",
    },
    {
      id: "orders",
      title: "Manage Orders",
      icon: "📦",
      description: "Track orders, update status, and handle customer purchases",
      count: "50+ Orders",
    },
    {
      id: "products",
      title: "Manage Products",
      icon: "👕",
      description: "Add, edit, delete products and manage inventory",
      count: "100+ Products",
    },
  ];

  if (isLoading) {
    return (
      <div className="admin-loading">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeCategory) {
      case "accounts":
        return <ManageAccounts />;
      case "orders":
        return <ManageOrders />;
      case "products":
        return <ManageProducts />;
      default:
        return (
          <div className="dashboard-overview">
            <h2>Admin Dashboard Overview</h2>
            <p>Welcome back, {user?.username}! Select a category to manage.</p>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <span>150+</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>Active Orders</h3>
                  <span>50+</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👕</div>
                <div className="stat-info">
                  <h3>Products</h3>
                  <span>100+</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>Revenue</h3>
                  <span>$10,000+</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <span className="admin-info">Welcome, {user?.username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <button
              className={`nav-item ${
                activeCategory === "dashboard" ? "active" : ""
              }`}
              onClick={() => setActiveCategory("dashboard")}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-label">Dashboard</span>
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                className={`nav-item ${
                  activeCategory === category.id ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="nav-icon">{category.icon}</span>
                <span className="nav-label">{category.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="admin-main">
          {activeCategory === "dashboard" && (
            <div className="category-selection">
              <h2>Management Categories</h2>
              <div className="category-grid">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="category-card"
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <div className="category-icon">{category.icon}</div>
                    <h3>{category.title}</h3>
                    <p>{category.description}</p>
                    <div className="category-count">{category.count}</div>
                    <button className="manage-btn">Manage</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
