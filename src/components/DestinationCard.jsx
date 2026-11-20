import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/helpers';
import { SceneArt } from './SceneArt';
import { fetchWeatherForDest } from '../utils/weather';

export const DestinationCard = ({
  dest,
  currency = 'INR',
  isSaved = false,
  onToggleSave,
  onSelectPlan,
  onQuickEnquire,
  onLogApi
}) => {
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchWeatherForDest(dest, onLogApi).then((res) => {
      if (isMounted) {
        setWeather(res);
        setLoadingWeather(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [dest, onLogApi]);

  const typeName = dest.type.charAt(0).toUpperCase() + dest.type.slice(1);

  return (
    <article className="card-custom">
      <div className="pic-wrapper">
        <div className="pic">
          {/* Real Photo or Procedural Fallback */}
          {dest.image && !imageError ? (
            <>
              {!imageLoaded && <div className="skeleton-image" />}
              <img
                src={dest.image}
                alt={`${dest.name}, ${dest.where}`}
                className={`card-real-img ${imageLoaded ? 'loaded' : ''}`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <SceneArt kind={dest.sc[0]} colors={dest.sc[1]} />
          )}

          {/* Wishlist Heart Button */}
          <button
            className={`wishlist-heart-btn ${isSaved ? 'saved' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(dest.id);
            }}
            title={isSaved ? 'Remove from saved' : 'Save to wishlist'}
            aria-label={isSaved ? `Remove ${dest.name} from wishlist` : `Save ${dest.name} to wishlist`}
          >
            {isSaved ? '❤️' : '🤍'}
          </button>

          {/* Live Open-Meteo Weather Badge */}
          <div className="weather-badge" id={`wb-${dest.id}`}>
            {loadingWeather ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  style={{ width: '10px', height: '10px' }}
                  role="status"
                />{' '}
                Live weather
              </>
            ) : weather ? (
              <>
                <span className="live-dot" />
                <span>{weather.icon}</span> {weather.temp}°C · {weather.text}
              </>
            ) : (
              <>
                <span>🌡️</span> Season {dest.seasonText}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="body">
        <div>
          <div className="card-title-row">
            <h3>{dest.name}</h3>
            {dest.rating && (
              <span className="card-rating-badge" title={`${dest.rating} out of 5 based on ${dest.reviewCount} traveler reviews`}>
                ⭐ {dest.rating} <small>({dest.reviewCount})</small>
              </span>
            )}
          </div>
          <p className="where">📍 {dest.where}</p>
        </div>

        <p className="card-blurb">{dest.blurb}</p>

        {/* Feature Tags */}
        {dest.tags && dest.tags.length > 0 && (
          <div className="card-tags">
            {dest.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}

        <ul className="meta">
          <li>🗓️ {dest.seasonText}</li>
          <li>🌙 {dest.nights} nights</li>
          <li>{typeName}</li>
        </ul>

        <div className="foot">
          <div className="price">
            {formatCurrency(dest.price, currency)}
            <small>sample / person ({dest.nights}N)</small>
          </div>
          <div className="card-actions">
            <button
              className="link-btn"
              onClick={() => onSelectPlan(dest.id)}
            >
              View plan →
            </button>
            <button
              className="quick-enquire"
              title="Pre-fill enquiry"
              onClick={() => onQuickEnquire(dest.id)}
            >
              Plan
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
