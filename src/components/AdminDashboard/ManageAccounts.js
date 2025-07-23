import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://e-commerce-backend-j8ie.onrender.com/api/accounts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        await axios.delete(
          `https://e-commerce-backend-j8ie.onrender.com/api/accounts/${accountId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("Account deleted successfully");
        fetchAccounts();
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account");
      }
    }
  };

  const handleToggleStatus = async (accountId, currentStatus) => {
    try {
      await axios.patch(
        `https://e-commerce-backend-j8ie.onrender.com/api/accounts/${accountId}/status`,
        { active: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Account status updated");
      fetchAccounts();
    } catch (error) {
      console.error("Error updating account status:", error);
      alert("Failed to update account status");
    }
  };

  const filteredAccounts = accounts.filter(
    (account) =>
      account.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading accounts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="manage-section">
      <div className="section-header">
        <h2>Manage Accounts</h2>
        <div className="section-actions">
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="refresh-btn" onClick={fetchAccounts}>
            Refresh
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Category</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account) => (
              <tr key={account._id}>
                <td>{account.username}</td>
                <td>{account.email}</td>
                <td>{account.phoneNo || "N/A"}</td>
                <td>
                  <span className={`category-badge ${account.category}`}>
                    {account.category}
                  </span>
                </td>
                <td>{new Date(account.createdAt).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`status-badge ${
                      account.active ? "active" : "inactive"
                    }`}
                  >
                    {account.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => alert("Edit functionality coming soon")}
                  >
                    Edit
                  </button>
                  <button
                    className={`action-btn ${
                      account.active ? "block-btn" : "activate-btn"
                    }`}
                    onClick={() =>
                      handleToggleStatus(account._id, account.active)
                    }
                  >
                    {account.active ? "Block" : "Activate"}
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteAccount(account._id)}
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

export default ManageAccounts;
