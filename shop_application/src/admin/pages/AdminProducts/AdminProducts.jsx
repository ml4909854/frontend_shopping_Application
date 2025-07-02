import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminProducts.css';
import AdminProfileName from '../AdminProfile/AdminProfileName';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: '',
    subCategory: '',
    color: '',
    price: '',
    image: null,
  });
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem('token');
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${backendURL}/product`);
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    try {
      if (editId) {
        await axios.patch(`${backendURL}/product/update/${editId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${backendURL}/product/create`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchProducts();
      setShowForm(false);
      setFormData({
        title: '',
        brand: '',
        category: '',
        subCategory: '',
        color: '',
        price: '',
        image: null,
      });
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${backendURL}/product/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setFormData({
      title: product.title,
      brand: product.brand,
      category: product.category,
      subCategory: product.subCategory,
      color: product.color,
      price: product.price,
      image: null,
    });
    setShowForm(true);
  };

  const filtered = products
    .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((p) => (filterCategory ? p.category === filterCategory : true));

  const productsPerPage = 20;
  const totalPages = Math.ceil(filtered.length / productsPerPage);
  const displayedProducts = filtered.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <>
    <AdminProfileName/>
    <div className="admin-products-page">
      <div className="admin-products-wrapper">
        <aside className="product-sidebar">
          <h3>Filter by Category</h3>
          <button onClick={() => setFilterCategory('')}>All</button>
          {categories.map((cat, i) => (
            <button key={i} onClick={() => setFilterCategory(cat)}>
              {cat}
            </button>
          ))}
        </aside>

        <main>
          <div className="top-bar">
            <input
              className="search-input"
              type="text"
              placeholder="Search product by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="create-btn" onClick={() => setShowForm(true)}>
              + Add Product
            </button>
          </div>

          <div className="product-grid">
            {displayedProducts.map((product) => (
              <div className="admin-product-card" key={product._id}>
                <img src={product.image} alt={product.title} />
                <h4>{product.title}</h4>
                <p>Brand: {product.brand}</p>
                <p>Category: {product.category}</p>
                <p>Price: ₹{product.price}</p>
                <div className="actions">
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button className="danger" onClick={() => handleDelete(product._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </button>
          </div>
        </main>
      </div>

      {showForm && (
        <div className="modal">
          <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
          <h3>{editId ? 'Edit Product' : 'Add Product'}</h3>
          <form onSubmit={handleSubmit}>
            <input name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} required />
            <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleInputChange} required />
            <input name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} required />
            <input name="subCategory" placeholder="Sub Category" value={formData.subCategory} onChange={handleInputChange} required />
            <input name="color" placeholder="Color" value={formData.color} onChange={handleInputChange} required />
            <input name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} required />
            <input type="file" name="image" onChange={handleInputChange} accept="image/*" />
            <button type="submit">{editId ? 'Update' : 'Create'}</button>
          </form>
        </div>
      )}
    </div>
    </>
  );
};

export default AdminProducts;
