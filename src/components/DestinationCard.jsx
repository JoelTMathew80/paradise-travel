import React, { useState, useEffect } from 'react';
import { inr } from '../utils/helpers';
import { SceneArt } from './SceneArt';
import { fetchWeatherForDest } from '../utils/weather';

export const DestinationCard = ({ dest, onSelectPlan, onQuickEnquire, onLogApi }) => {
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

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
      <div className="pic">
        <SceneArt kind={dest.sc[0]} colors={dest.sc[1]} />
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

      <div className="body">
        <div>
          <div className="card-title-row">
            <h3>{dest.name}</h3>
          </div>
          <p className="where">📍 {dest.where}</p>
        </div>

        <p className="card-blurb">{dest.blurb}</p>

        <ul className="meta">
          <li>🗓️ {dest.seasonText}</li>
          <li>🌙 {dest.nights} nights</li>
          <li>{typeName}</li>
        </ul>

        <div className="foot">
          <div className="price">
            {inr(dest.price)}
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
