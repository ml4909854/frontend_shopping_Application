import React from 'react';
import './Spinner.css';

const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner" />
      <p>Loading...</p>
    </div>
  );
};

export default Spinner;
