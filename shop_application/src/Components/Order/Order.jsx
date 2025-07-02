import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Order.css';
import { useNavigate } from 'react-router-dom';
import AdminProfileName from '../../admin/pages/AdminProfile/AdminProfileName';

const Spinner = () => (
  <div className="spinner-wrapper">
    <div className="spinner"></div>
    <p>Fetching your orders...</p>
  </div>
);

const Order = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${backendUrl}/order`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sortedOrders = res.data.orders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setTimeout(() => setLoading(false), 1000); // 1 second delay
      }
    };
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    const reason = prompt('Why are you cancelling this order?');
    if (!reason || reason.trim() === '') {
      return alert('Cancellation reason is required.');
    }

    try {
      await axios.patch(
        `${backendUrl}/order/cancel/${orderId}`,
        { cancelReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Order cancelled successfully!');
      navigate('/product');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Try again later.');
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <div>
        <AdminProfileName/>
      </div>
    <div className="orders-page">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders yet. Start shopping!</p>
      ) : (
        <div className="orders-container">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <span>
                  Order ID:{' '}
                  <strong>{order._id}</strong>
                </span>
                <span className={`status-badge ${order.status}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-body">
                {order.products.map(({ productId, quantity }) => (
                  <div className="order-item" key={productId._id}>
                    <img src={productId.image} alt={productId.title} />
                    <div className="item-details">
                      <p className="item-title">{productId.title}</p>
                      <p>Qty: {quantity}</p>
                      <p>₹{productId.price * quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div>
                  <strong>Total:</strong> ₹{order.totalAmount}
                </div>
                <div className="order-time">
                  Ordered on: {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>

              {order.deliveryDate && (
                <div className="delivery-box">
                  <span className="delivery-icon">🚚</span>
                  <div className="delivery-text">
                    <h4>Expected Delivery</h4>
                    <p>
                      {new Date(order.deliveryDate).toLocaleDateString(
                        undefined,
                        {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                </div>
              )}

              {order.status !== 'delivered' &&
                order.status !== 'cancelled' && (
                  <div className="cancel-container">
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(order._id)}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default Order;
