import React, { useEffect, useState } from 'react';
import './Product.css';
import ProductCard from './ProductCard';
import SidebarFilter from './SidebarFilter';
import Spinner from '../Spinner/Spinner';
import axios from 'axios';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${backendUrl}/product`);
        setTimeout(() => {
          setProducts(res.data.products);
          setFiltered(res.data.products);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  // handle filters from sidebar
  const handleFilterChange = ({ categories, brands, priceSort }) => {
    let result = [...products];

    if (categories.length > 0) {
      result = result.filter(p => categories.includes(p.category));
    }

    if (brands.length > 0) {
      result = result.filter(p => brands.includes(p.brand));
    }

    if (priceSort === 'lowToHigh') {
      result = result.sort((a, b) => +a.price - +b.price);
    } else if (priceSort === 'highToLow') {
      result = result.sort((a, b) => +b.price - +a.price);
    }

    setFiltered(result);
  };

  if (loading) return <Spinner />;

  return (
    <div className="product-page">
      <SidebarFilter products={products} onFilterChange={handleFilterChange} />
      <div className="product-list">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Product;
