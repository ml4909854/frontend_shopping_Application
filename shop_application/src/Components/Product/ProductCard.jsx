import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const handleAddToCart = async () => {
    if (!token) {
      navigate("/login");
    } else {
      try {
        await axios.post(
          `${backendUrl}/cart/add`,
          { productId: product._id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Item added successfully!");
        navigate("/cart");
      } catch (error) {
        alert("Error adding item to cart.");
        console.error(error);
      }
    }
  };

  const handleBuyNow = () => {
    if (!token) {
      navigate("/login");
    }
    localStorage.setItem("buyNowProduct", JSON.stringify(product));
    navigate("/checkout?mode=buyNow"); // redirects to checkout with Buy Now mode
  };

  return (
    <div className="product-card">
      <div
        className="product-img"
        onClick={() => navigate(`/productDetail/${product._id}`)}
      >
        <img src={product.image} alt={product.title} />
      </div>

      <div className="product-info">
        <div className="product-details">
          <h3>{product.title}</h3>
          <p className="brand">{product.brand}</p>
          <p className="price">₹{product.price}</p>
          <p className="category">
            {product.category} / {product.subCategory}
          </p>
          <p className="color">Color: {product.color}</p>
        </div>

        <div className="info-buttons">
          <button className="add-to-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className="buy-now" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
