import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import ProductCard from '../Product/ProductCard';
import SidebarFilter from '../Product/SidebarFilter';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingOthers, setLoadingOthers] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [otherProducts, setOtherProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const token = localStorage.getItem('token');

  // ✅ Fetch single product
  useEffect(() => {
    setLoadingProduct(true);
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${backendUrl}/product/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setTimeout(() => setLoadingProduct(false), 200);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ Fetch other products
  useEffect(() => {
    setLoadingOthers(true);
    const fetchOthers = async () => {
      try {
        const res = await axios.get(`${backendUrl}/product`);
        const filtered = res.data.products.filter((p) => p._id !== id);
        setOtherProducts(filtered);
        setFilteredProducts(filtered);
      } catch (err) {
        console.error('Error loading other products');
      } finally {
        setTimeout(() => setLoadingOthers(false), 1500);
      }
    };
    fetchOthers();
  }, [id]);

  // ✅ Filter change handler
  const handleFilterChange = ({ categories, brands, priceSort }) => {
    let result = [...otherProducts];

    if (categories.length > 0) {
      result = result.filter(p => categories.includes(p.category));
    }

    if (brands.length > 0) {
      result = result.filter(p => brands.includes(p.brand));
    }

    if (priceSort === 'lowToHigh') {
      result.sort((a, b) => +a.price - +b.price);
    } else if (priceSort === 'highToLow') {
      result.sort((a, b) => +b.price - +a.price);
    }

    setFilteredProducts(result);
  };

  // ✅ Add to cart
  const handleAddToCart = async () => {
    if (!token) {
      navigate("/login")
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/cart/add`,
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Item added to cart successfully!');
      navigate('/cart');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Error adding item to cart');
    }
  };

  // ✅ Buy Now
  const handleBuyNow = () => {
    if (!token) {
      navigate("/login")
      return;
    }

    localStorage.setItem('buyNowProduct', JSON.stringify(product));
    navigate('/checkout?mode=buyNow');
  };

  // ✅ Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${backendUrl}/review/add`,
        { productId: id, rating, comment: reviewText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Review submitted successfully!');
      setReviewText('');
      setRating(5);
      setMessage('');

      const updated = await axios.get(`${backendUrl}/product/${id}`);
      setProduct(updated.data.product);
    } catch (error) {
      const msg = error.response?.data?.message || 'Error submitting review.';
      setMessage(msg);
    }
  };

  if (loadingProduct || loadingOthers) return <Spinner />;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-detail-page">
      <div className="product-detail-top">
        <div className="product-detail-image">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="product-detail-info">
          <h2>{product.title}</h2>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Category:</strong> {product.category} / {product.subCategory}</p>
          <p><strong>Color:</strong> {product.color}</p>
          <p className="price">₹{product.price}</p>

          <div className="action-buttons">
            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="review-section">
        <h3>Customer Reviews</h3>
        {product.reviews?.length > 0 ? (
          product.reviews.map((r) => (
            <div key={r._id} className="review-card">
              <p><strong>{r.userId?.name}</strong> - ⭐ {r.rating}</p>
              <p>{r.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>

      <div className="add-review-form">
        <h3>Write a Review</h3>
        {message && <p className="alert">{message}</p>}
        <form onSubmit={handleReviewSubmit}>
          <label>
            Rating:
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <textarea
            placeholder="Write your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          />
          <button type="submit">Submit Review</button>
        </form>
      </div>

      <div className="product-bottom-layout">
        <div className="sidebar-fixed">
          <SidebarFilter products={otherProducts} onFilterChange={handleFilterChange} />
        </div>
        <div className="product-scrollable-list">
          <h3>Explore More Products</h3>
          <div className="product-list">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))
            ) : (
              <p>No products match the selected filters.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
