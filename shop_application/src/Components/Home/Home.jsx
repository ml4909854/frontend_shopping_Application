// Home.jsx
import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate()

  function handleClick(){
    navigate("/product")
  }
  return (
    <div className="home-wrapper">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to <span className="highlight">Mkart</span></h1>
          <p>Shop the Latest Trends in Fashion, Electronics, and More</p>
          <a onClick={handleClick} className="shop-now-btn">Shop Now</a>
        </div>
        <img
          className="hero-img"
          src="https://images.unsplash.com/photo-1725797951116-98dc0cce8ac8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2hvcHBpbmclMjBiYW5uZXJ8ZW58MHx8MHx8fDA%3D"
          alt="Shopping banner"
        />
      </section>
    </div>
  );
};

export default Home;
