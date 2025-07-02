import React, { useState, useEffect } from 'react';
import './SidebarFilter.css';

const SidebarFilter = ({ products, onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceSort, setPriceSort] = useState('');

  // Get unique categories and brands from products
  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];

  // handle checkbox toggle
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategories(prev =>
      prev.includes(value)
        ? prev.filter(c => c !== value)
        : [...prev, value]
    );
  };

  const handleBrandChange = (e) => {
    const value = e.target.value;
    setSelectedBrands(prev =>
      prev.includes(value)
        ? prev.filter(b => b !== value)
        : [...prev, value]
    );
  };

  const handlePriceChange = (e) => {
    setPriceSort(e.target.value);
  };

  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      brands: selectedBrands,
      priceSort: priceSort
    });
  }, [selectedCategories, selectedBrands, priceSort]);

  return (
    <div className="sidebar">
      <h3>Filters</h3>

      <div className="filter-group">
        <h4>Category</h4>
        {categories.map((cat, index) => (
          <label key={index}>
            <input
              type="checkbox"
              value={cat}
              onChange={handleCategoryChange}
              checked={selectedCategories.includes(cat)}
            />{' '}
            {cat}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Brand</h4>
        {brands.map((brand, index) => (
          <label key={index}>
            <input
              type="checkbox"
              value={brand}
              onChange={handleBrandChange}
              checked={selectedBrands.includes(brand)}
            />{' '}
            {brand}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Price</h4>
        <select onChange={handlePriceChange} value={priceSort}>
          <option value="">Select</option>
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default SidebarFilter;
