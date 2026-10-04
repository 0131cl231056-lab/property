import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from "../../../utils/formatPrice";

const CityCard = ({ city }) => {
  return (
    <div className="city-card">
      <div className="city-card__image-wrapper">
        <img src={city.image} alt={city.city} className="city-card__image" />
      </div>
      
      <div className="city-card__content">
        <h3 className="city-card__title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {city.city}
        </h3>
        
        <div className="city-card__count">{city.propertyCount} Properties</div>
        
        <div className="city-card__price-row">
          <span className="city-card__price-label">Starting from</span>
          <span className="city-card__price-value">
              {formatPrice(city.startPrice)}
          </span>
        </div>
        
        <div className="city-card__price-row" style={{ marginBottom: '24px' }}>
          <span className="city-card__price-label">Average</span>
          <span className="city-card__price-value">
              {formatPrice(city.avgPrice)}
          </span>
        </div>
        
        <Link to={`/properties?city=${city.city}`} className="city-card__button" style={{ textDecoration: 'none' }}>
          Explore
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default CityCard;
