import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import AddToCartPage from "../Cart/AddToCartPage";
import ProfileIcon from "../ProfileIcon/ProfileIcon";

function NavBar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const searchInputRef = useRef(null);

  const handleCartClick = (e) => {
    e.preventDefault();
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchValue = searchInputRef.current?.value;
    // Handle search logic here
    console.log("Search value:", searchValue);
  };

  return (
    <>
      <div>
        <nav
          className="navbar navbar-expand-lg navbar-responsive"
          style={{ backgroundColor: "#c1ae3eff" }}
        >
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              onClick={toggleNav}
              aria-controls="navbarSupportedContent"
              aria-expanded={isNavOpen}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    to="/"
                    className="nav-link active"
                    aria-current="page"
                    onClick={closeNav}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/products/suits"
                    className="nav-link active"
                    onClick={closeNav}
                  >
                    Suits
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/products/waistcoat"
                    className="nav-link active"
                    onClick={closeNav}
                  >
                    Waistcoat
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/products/shalwar-kameez"
                    className="nav-link active"
                    onClick={closeNav}
                  >
                    Shalwar Kameez
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/products/kurta"
                    className="nav-link active"
                    onClick={closeNav}
                  >
                    Kurta
                  </Link>
                </li>
              </ul>

              <form
                className="d-flex me-3 search-form"
                role="search"
                onSubmit={handleSearchSubmit}
              >
                <input
                  ref={searchInputRef}
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button className="btn btn-outline-success" type="submit">
                  Search
                </button>
              </form>

              <ul className="navbar-nav mb-2 mb-lg-0 nav-actions">
                <li className="nav-item">
                  <Link
                    to="#"
                    className="nav-link active cart-link"
                    onClick={handleCartClick}
                  >
                    <img
                      src="/assets/images/cart.png"
                      alt="cart"
                      className="me-1"
                      style={{ width: "20px", height: "20px" }}
                    />
                    Cart
                  </Link>
                </li>
                <li className="nav-item">
                  <ProfileIcon />
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <AddToCartPage isOpen={isCartOpen} onClose={closeCart} />
      </div>
    </>
  );
}

export default NavBar;
