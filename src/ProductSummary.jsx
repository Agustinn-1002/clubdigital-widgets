import React from 'react';
import './ProductSummary.css';

const ProductSummary = ({ texto }) => {
  if (!texto) return null;

  return (
    <div className="product-summary-wrapper">
      {/* Usamos dangerouslySetInnerHTML para que los <br /> y negritas funcionen */}
      <div 
        className="product-summary-text"
        dangerouslySetInnerHTML={{ __html: texto }} 
      />
    </div>
  );
};

export default ProductSummary;