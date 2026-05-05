import React from 'react';
import './PromoSlider.css';

// Ahora el componente recibe las imágenes (images) como parámetro
const PromoSlider = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="promo-slider-wrapper">
      <h3 className="slider-title">Producto en Acción</h3> 
      <div className="promo-slider-track">
        {images.map((url, index) => (
          <div key={index} className="promo-slide">
            <img src={url} alt={`Acción ${index + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromoSlider;