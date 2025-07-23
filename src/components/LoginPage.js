import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./LoginPage.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get the backend port from environment variables
  const SERVER_PORT = process.env.SERVER_PORT || "3001";

  // Check for session expiration message
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const expired = urlParams.get("expired");

    if (expired === "true") {
      setError("Your session has expired. Please log in again.");
    }
  }, [location]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `https://e-commerce-backend-j8ie.onrender.com/api/accounts/login`,
        {
          username: username,
          password: password,
        }
      );

      // Handle successful login
      console.log("Login successful:", response.data);

      // Use context login function
      const loginSuccess = login(response.data.user, response.data.token);

      if (loginSuccess) {
        alert("Login successful!");

        // Check user category and redirect accordingly
        const userCategory = response.data.user.category;

        if (userCategory === "admin") {
          // Redirect admin users to admin dashboard
          navigate("/admin");
        } else {
          // Redirect regular users to homepage or the page they were trying to access
          const redirectTo = location.state?.from?.pathname || "/";
          navigate(redirectTo);
        }
      } else {
        setError("Login failed due to invalid token");
      }
    } catch (error) {
      // Handle login error
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Sign in to your account</p>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?
            <Link to="/signup" className="register-link">
              {" "}
              Sign up
            </Link>
          </p>
          <Link to="/" className="home-link">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
