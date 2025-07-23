import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="text-white py-2 mt-5"
      style={{ backgroundColor: "#000000ff" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>About Us</h5>
            <p>
              Premium clothing brand offering the latest fashion trends and
              high-quality apparel.
            </p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-white-50">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products/suits" className="text-white-50">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white-50">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white-50">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact Info</h5>
            <p className="text-white-50">
              Email: info@clothingbrand.com
              <br />
              Phone: (555) 123-4567
              <br />
              Address: 123 Fashion St, Style City
            </p>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0 ">
              &copy; 2024 Clothing Brand. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
