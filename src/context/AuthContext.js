import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { isTokenExpired, setupAutoLogout } from "../utils/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Logout function that clears state and localStorage
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page if not already there
    if (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/"
    ) {
      window.location.href = "/login";
    }
  }, []);

  // Check if user is logged in on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      // Check if token is expired
      if (isTokenExpired(storedToken)) {
        // Token is expired, clear everything
        logout();
      } else {
        // Token is valid, restore auth state
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, [logout]);

  // Set up automatic logout on token expiration
  useEffect(() => {
    let cleanup;

    if (token) {
      cleanup = setupAutoLogout(() => {
        console.log("Token expired, logging out automatically");
        logout();
      });
    }

    return cleanup;
  }, [token, logout]);

  // Listen for auth-logout events from other parts of the app
  useEffect(() => {
    const handleAuthLogout = () => {
      logout();
    };

    window.addEventListener("auth-logout", handleAuthLogout);

    return () => {
      window.removeEventListener("auth-logout", handleAuthLogout);
    };
  }, [logout]);

  const login = (userData, authToken) => {
    // Validate token before setting
    if (isTokenExpired(authToken)) {
      console.error("Attempted to login with expired token");
      return false;
    }

    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    return true;
  };

  const isAuthenticated = () => {
    return !!token && !!user && !isTokenExpired(token);
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
