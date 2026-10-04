import { useState } from 'react';
import { Link } from 'react-router-dom';
import {formatPrice} from "../../../utils/formatPrice"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hook/useAuth';

// Icons
const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const BedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
  </svg>
);

const BathIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>
    <line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/>
  </svg>
);

const AreaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 9h18M9 21V9"/>
  </svg>
);
const AREA_UNITS = {
  sqft: "sq ft",
  acre: "acres",
  acres: "acres",
};

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
const { user, favorites } = useSelector((state) => state.auth);
const { handleAddFavorite, handleRemoveFavorite } = useAuth();

const propertyId = property._id || property.id;
const fav = favorites.some((f) => f._id === propertyId);

const handleFavClick = async (e) => {
  e.preventDefault();

  if (!user) {
    navigate('/login');
    return;
  }

  if (fav) {
    await handleRemoveFavorite(propertyId);
  } else {
    await handleAddFavorite(propertyId);
  }
};

  const { title, price, location, category, area, areaUnit ,bedrooms, bathrooms, description, image } = property;

  return (
    <div className="lp-prop-card">
      {/* Image */}
      <div className="lp-prop-card__img-wrap">
        <img
          src={property.propertyImages?.[0]}
          alt={property.title}
          className="property-card__image"
        />
        <button
  className={`lp-prop-card__fav${fav ? ' active' : ''}`}
  onClick={handleFavClick}
  aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
>
          <HeartIcon filled={fav} />
        </button>
        <span className="lp-prop-card__category">{category}</span>
      </div>

      {/* Body */}
      <div className="lp-prop-card__body">
        <div className="lp-prop-card__price">{formatPrice(property.price)}</div>
        <div className="lp-prop-card__title">{title}</div>
        <div className="lp-prop-card__location">
          <LocationIcon />
          {location}
        </div>
        <div className="lp-prop-card__pills">
          <span className="lp-prop-pill">
  <AreaIcon />{area} {AREA_UNITS[areaUnit] || areaUnit}
</span>
          {bedrooms > 0 && (
            <span className="lp-prop-pill">
              <BedIcon />{bedrooms} Bed
            </span>
          )}
          <span className="lp-prop-pill">
            <BathIcon />{bathrooms} Bath
          </span>
        </div>
        <p className="lp-prop-card__desc">{description}</p>
      </div>

      {/* CTA */}
      <div className="lp-prop-card__footer">
        <Link to={`/properties/${property._id || property.id}`} className="lp-prop-card__btn" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
