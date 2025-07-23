import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./ProfileDashboard.css";

const ProfileDashboard = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, logout } = useCart();
  const navigate = useNavigate();

  const handleOrderHistory = () => {
    navigate("/orders");
    onClose();
  };

  const handleAdminDashboard = () => {
    navigate("/admin");
    onClose();
  };

  const handleLogin = () => {
    navigate("/login");
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="profile-dashboard-overlay" onClick={onClose}>
      <div className="profile-dashboard" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <h3>Profile</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {isAuthenticated ? (
          <div className="profile-content">
            <div className="user-info">
              <div className="user-avatar">
                <span>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
              </div>
              <div className="user-details">
                <h4>{user?.name || "User"}</h4>
                <p>{user?.email || "user@example.com"}</p>
                {user?.category === "admin" && (
                  <span className="admin-badge">Admin</span>
                )}
              </div>
            </div>

            <div className="profile-menu">
              {user?.category === "admin" && (
                <button
                  className="menu-item admin-item"
                  onClick={handleAdminDashboard}
                >
                  <span className="menu-icon">⚡</span>
                  Admin Dashboard
                </button>
              )}
              <button className="menu-item" onClick={handleOrderHistory}>
                <span className="menu-icon">📦</span>
                Order History
              </button>
              <button className="menu-item">
                <span className="menu-icon">⚙️</span>
                Settings
              </button>
              <button className="menu-item">
                <span className="menu-icon">👤</span>
                Edit Profile
              </button>
            </div>

            <div className="profile-footer">
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-content">
            <div className="login-prompt">
              <h4>Welcome to Seasons Fabrics</h4>
              <p>Please login to access your profile and order history.</p>
              <button className="login-btn" onClick={handleLogin}>
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDashboard;
