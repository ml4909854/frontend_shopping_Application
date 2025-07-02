import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Checkout.css';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminProfileName from '../../admin/pages/AdminProfile/AdminProfileName';

const Spinner = () => (
  <div className="spinner-wrapper">
    <div className="spinner"></div>
    <p>Preparing your checkout...</p>
  </div>
);

const Checkout = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');
  const location = useLocation();
  const navigate = useNavigate();
  const isBuyNow = new URLSearchParams(location.search).get('mode') === 'buyNow';

  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', pincode: '', phone: '' });
  const [showForm, setShowForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState(null);
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const platformFee = 40;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isBuyNow) {
          const product = JSON.parse(localStorage.getItem('buyNowProduct'));
          if (!product) return alert('No product selected.');
          setBuyNowProduct(product);
        } else {
          const res = await axios.get(`${backendUrl}/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCart(res.data.cart);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };
    fetchData();
  }, []);

  const subtotal = isBuyNow
    ? buyNowProduct?.price || 0
    : cart?.products?.reduce((sum, { productId, quantity }) => sum + productId.price * quantity, 0) || 0;

  const total = subtotal + platformFee ;

  const getExpectedDeliveryDate = () => {
    const daysToAdd = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
    return deliveryDate;
  };

  const handleOrder = async () => {
    if (selectedAddress == null) return alert('Select a delivery address');
    const deliveryDate = getExpectedDeliveryDate();

    try {
      if (isBuyNow) {
        const res = await axios.post(`${backendUrl}/order/fromProduct`, {
          productId: buyNowProduct._id,
          quantity: 1,
          address: addresses[selectedAddress],
          paymentMethod,
          deliveryDate,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Order placed!');
        localStorage.removeItem('buyNowProduct');
        navigate('/order');
      } else {
        const res = await axios.post(`${backendUrl}/order/fromCart`, {
          address: addresses[selectedAddress],
          paymentMethod,
          deliveryDate,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Order placed!');
        navigate('/order');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to place order');
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
    <div>
      <AdminProfileName/>
    </div>
    <div className="checkout-wrapper">
      <div className="checkout-left">
        <h2>Delivery Address</h2>
        <button className='add-btn' onClick={() => setShowForm(prev => !prev)}>
          {showForm ? 'Cancel' : '+ Add Address'}
        </button>
        {showForm && (
          <div className='form-container'>
            {['street', 'city', 'state', 'pincode', 'phone'].map(field => (
              <input
                key={field}
                name={field}
                value={newAddress[field]}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                onChange={e => setNewAddress(prev => ({ ...prev, [field]: e.target.value }))}
              />
            ))}
            <button className='save-btn' onClick={() => {
              if (Object.values(newAddress).some(v => !v.trim())) return alert('Fill all fields');
              setAddresses(prev => [...prev, newAddress]);
              setNewAddress({ street: '', city: '', state: '', pincode: '', phone: '' });
              setShowForm(false);
            }}>Save</button>
          </div>
        )}

        <div className='addr-list'>
          {addresses.map((addr, i) => (
            <div
              key={i}
              className={`addr-card ${selectedAddress === i ? 'active' : ''}`}
              onClick={() => setSelectedAddress(i)}
            >
              <p>{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
              <p>📞 {addr.phone}</p>
              <button className='del-btn' onClick={e => {
                e.stopPropagation();
                setAddresses(prev => prev.filter((_, j) => j !== i));
                if (selectedAddress === i) setSelectedAddress(null);
              }}>Delete</button>
            </div>
          ))}
        </div>

        <h2 className="summary-header" onClick={() => setSummaryOpen(prev => !prev)}>
          Order Summary &nbsp;<span className="arrow">{summaryOpen ? '▲' : '▼'}</span>
        </h2>

        <div className={`summary-details ${summaryOpen ? 'open' : ''}`}>
          {isBuyNow ? (
            <div className="item-row" key={buyNowProduct._id}>
              <img src={buyNowProduct.image} alt={buyNowProduct.title} />
              <div className="item-info">
                <p className="item-title">{buyNowProduct.title}</p>
                <p>Qty: 1</p>
              </div>
              <p className="item-price">₹{buyNowProduct.price}</p>
            </div>
          ) : (
            cart?.products?.map(({ productId, quantity }) => (
              <div key={productId._id} className="item-row">
                <img src={productId.image} alt={productId.title} />
                <div className="item-info">
                  <p className="item-title">{productId.title}</p>
                  <p>Qty: {quantity}</p>
                </div>
                <p className="item-price">₹{productId.price * quantity}</p>
              </div>
            ))
          )}
        </div>

        <h2>Payment Method</h2>
        <div className='payment-opt'>
          {['COD', 'Online'].map(opt => (
            <label key={opt}>
              <input
                type='radio'
                value={opt}
                checked={paymentMethod === opt}
                onChange={e => setPaymentMethod(e.target.value)}
              /> {opt}
            </label>
          ))}
        </div>
        <button className='place-btn' onClick={handleOrder}>Complete Order</button>
      </div>

      <div className='checkout-right'>
        <div className='price-block'>
          <h3>Price Details</h3>
          <div className='row'><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className='row'><span>Platform Fee</span><span>₹{platformFee}</span></div>
          <hr />
          <div className='row total'><span>Total Payable</span><span>₹{total}</span></div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Checkout;
