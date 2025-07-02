import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import AdminProfileName from "../../admin/pages/AdminProfile/AdminProfileName";

const Cart = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${backendUrl}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTimeout(() => {
          setCartData(res.data);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (productId, action) => {
    try {
      await axios.patch(
        `${backendUrl}/cart/update`,
        { productId, action },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res = await axios.get(`${backendUrl}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartData(res.data);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`${backendUrl}/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await axios.get(`${backendUrl}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Item removed from cart");
      setCartData(res.data);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  if (loading) return <Spinner />;
  if (!cartData || cartData.cart.products.length === 0) {
    return (
      <>
        <AdminProfileName />
        <div className="cart-container">
          <h2>Your cart is empty.</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminProfileName />

      <div className="cart-container">
        <div className="cart-left">
          <h2>My Cart ({cartData.cart.products.length})</h2>

          {cartData.cart.products.map(({ productId, quantity }) => (
            <div className="cart-item" key={productId._id}>
              <img src={productId.image} alt={productId.title} />
              <div className="cart-details">
                <h4>{productId.title}</h4>
                <p>Brand: {productId.brand}</p>
                <p>Category: {productId.category}</p>
                <div className="qty-buttons">
                  <button onClick={() => updateQuantity(productId._id, "dec")}>
                    -
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => updateQuantity(productId._id, "inc")}>
                    +
                  </button>
                </div>
                <button onClick={() => removeItem(productId._id)}>
                  Remove
                </button>
              </div>
              <div className="price">₹{productId.price * quantity}</div>
            </div>
          ))}
        </div>

        <div className="cart-right">
          <h3>PRICE DETAILS</h3>
          <p>Total Items: {cartData.cart.products.length}</p>
          <p>Total Amount: ₹{cartData.totalAmount}</p>
          <hr />
          <h3>Total: ₹{cartData.totalAmount}</h3>
          <button
            className="place-order-btn"
            onClick={() => navigate("/checkout")}
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
