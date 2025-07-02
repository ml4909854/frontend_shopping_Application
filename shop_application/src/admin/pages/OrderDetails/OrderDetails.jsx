import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data.order);
      } catch (err) {
        console.error('Error fetching order:', err);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading Order Details...</p>;

  return (
    <div className="order-details-page">
      <Link className="back-link" to="/admin/orders">← Back to Orders</Link>
      <h2>Order Details</h2>

      <div className="section">
        <strong>User:</strong> {order.userId?.name} <br />
        <strong>Phone:</strong> {order.address?.phone}
      </div>

      <div className="section">
        <strong>Address:</strong><br />
        {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
      </div>

      <div className="section">
        <strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}<br />
        <strong>Payment Method:</strong> {order.paymentMethod}<br />
        <strong>Status:</strong>{' '}
        <span className={`status-badge ${order.status}`}>{order.status}</span><br />
        <strong>Total Amount:</strong> ₹{order.totalAmount}
      </div>

      <h3>Products</h3>
      <div className="products">
        {order.products.map((p, i) => (
          <div className="order-product-box" key={i}>
            <img src={p.productId?.image} alt={p.productId?.title} />
            <div className="product-info">
              <h4>{p.productId?.title}</h4>
              <p>Price: ₹{p.productId?.price}</p>
              <p>Quantity: {p.quantity}</p>
              <p><strong>Total:</strong> ₹{p.productId?.price * p.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;
