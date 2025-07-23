import axios from "axios";
import { getToken, logout, isTokenExpired } from "./auth";

// Get the backend port from environment variables
const API_BASE_URL = `https://e-commerce-backend-j8ie.onrender.com/api`;

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const data = error.response.data;

      // Check if the error indicates token expiration
      if (data?.expired || data?.message?.toLowerCase().includes("expired")) {
        console.log("Token expired, logging out");
        logout();

        // Redirect to login page if not already there
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

// Validation functions
export const validateUsername = (username) => {
  if (!username.trim()) {
    return "Username is required";
  }
  if (username.length < 3) {
    return "Username must be at least 3 characters";
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email.trim()) {
    return "Email is required";
  }
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return "Email is invalid";
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return null;
};

export const validatePhoneNumber = (phoneNo) => {
  if (!phoneNo.trim()) {
    return "Phone number is required";
  }
  // Basic phone number validation (you can make this more sophisticated)
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phoneNo.replace(/\s/g, ""))) {
    return "Please enter a valid phone number";
  }
  return null;
};

// Main validation function
export const validateSignupForm = (formData) => {
  const errors = {};

  const usernameError = validateUsername(formData.username);
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validateConfirmPassword(
    formData.password,
    formData.confirmPassword
  );
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  const phoneError = validatePhoneNumber(formData.phoneNo);
  if (phoneError) errors.phoneNo = phoneError;

  return errors;
};

// API service functions using the axios instance with interceptors
export const createAccount = async (accountData) => {
  try {
    console.log("Creating account with data:", accountData);

    const response = await api.post("/accounts/", accountData);
    return response;
  } catch (error) {
    console.error("Account creation error:", error);
    throw error;
  }
};

export const checkEmailExists = async (email) => {
  try {
    const response = await api.post("/accounts/check-email", { email });
    return response.data.exists;
  } catch (error) {
    console.error("Email check error:", error);
    throw error;
  }
};

// Error handling utility
export const handleSignupError = (error) => {
  // Handle network errors (server not running)
  if (
    error.code === "ERR_NETWORK" ||
    error.code === "ECONNREFUSED" ||
    !error.response
  ) {
    return "Unable to connect to server. Please make sure the server is running.";
  }
  // Handle HTTP errors with response
  else if (error.response) {
    if (error.response.data?.message) {
      return error.response.data.message;
    } else if (error.response.status === 400) {
      return "Please check your input data";
    } else if (error.response.status === 500) {
      return "Server error. Please try again later.";
    } else {
      return `Server returned error: ${error.response.status}`;
    }
  }
  // Handle timeout errors
  else if (error.code === "ECONNABORTED") {
    return "Request timeout. Please check your connection and try again.";
  }
  // Handle other errors
  else {
    return "An unexpected error occurred. Please try again.";
  }
};
