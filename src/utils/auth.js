// Authentication utility functions

// Helper function to decode JWT without verification (for expiration check)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;

  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

// Get time until token expires (in seconds)
export const getTokenExpirationTime = (token) => {
  if (!token) return 0;

  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return 0;

  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, decoded.exp - currentTime);
};

export const getToken = () => {
  const token = localStorage.getItem("token");

  // Check if token is expired and remove it if so
  if (token && isTokenExpired(token)) {
    logout();
    return null;
  }

  return token;
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  const token = getToken(); // This will also check expiration

  // If no valid token, clear user data
  if (!token) {
    localStorage.removeItem("user");
    return null;
  }

  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Dispatch a custom event to notify other parts of the app
  window.dispatchEvent(new Event("auth-logout"));
};

export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auto-logout setup function to be called on app initialization
export const setupAutoLogout = (logoutCallback) => {
  const checkTokenExpiration = () => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      logout();
      if (logoutCallback) {
        logoutCallback();
      }
    }
  };

  // Check token expiration every minute
  const intervalId = setInterval(checkTokenExpiration, 60000);

  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
};
