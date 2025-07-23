import React from "react";
import { Link } from "react-router-dom";
import "../HomePage.css";
const CategoryPage = () => {
  return (
    <div className="category-container">
      <h2>Select a Category</h2>
      <div className="categories-img-container">
        <Link to="/products/suits" className="category-item">
          <img
            src="https://content.moss.co.uk/images/extraextralarge/966843671_02.jpg"
            alt="Suits"
          />
          <div className="category-label">Suits</div>
        </Link>
        <Link to="/products/waistcoat" className="category-item">
          <img
            src="https://www.bargello.com/images/thumbs/0017195_beige-linen-waistcoat_800.jpeg"
            alt="Waistcoat"
          />
          <div className="category-label">Waistcoat</div>
        </Link>
        <Link to="/products/shalwar-kameez" className="category-item">
          <img
            src="https://hbindustries.pk/cdn/shop/files/enchanted-jade-evergreen-shalwar-kameez-for-men-546267.webp?v=1722346501&width=1200"
            alt="Shalwar Kameez"
          />
          <div className="category-label">Shalwar Kameez</div>
        </Link>
        <Link to="/products/kurta" className="category-item">
          <img
            src="https://mtjonline.com/cdn/shop/files/MK-9656_2.jpg?v=1722628481"
            alt="Kurta"
          />
          <div className="category-label">Kurta</div>
        </Link>
      </div>
    </div>
  );
};

export default CategoryPage;
