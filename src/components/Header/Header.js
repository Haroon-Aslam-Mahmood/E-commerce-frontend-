import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className="text-white py-1"
      style={{ backgroundColor: "#000000ff" }}
    >
      <div className="custom-container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="d-flex align-items-center">
              <img
                src="/assets/images/logo.jpg"
                alt="logo"
                className="header-logo me-3"
              />
              <div>
                <h3 className="mb-0" style={{ fontSize: "1.5rem" }}>
                  Seasons Fabrics by Haris Rajput
                </h3>
                <p className="mb-0" style={{ fontSize: "0.9rem" }}>
                  Premium Fashion Collection
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 text-md-end">
            {isAuthenticated() ? (
              <div className="d-flex align-items-center justify-content-end">
                <span className="me-3 text-light">
                  Welcome, {user?.username}!
                </span>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light me-2 btn-sm">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-light btn-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
