import React from 'react';
import './ProductSummary.css';

const ProductSummary = ({ texto }) => {
  if (!texto) return null;

  return (
    <div className="product-summary-wrapper">
      <p className="product-summary-text">{texto}</p>
    </div>
  );
};

export default ProductSummary;