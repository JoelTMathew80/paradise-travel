import React, { useState, useEffect } from 'react';
import { SceneArt } from './SceneArt';
import { fetchWeatherForDest } from '../utils/weather';
import { RichDetails } from './RichDetails';

const DURATION_OPTIONS = [2, 3, 5];

export const TripPlanner = ({
  destinations,
  selectedDestId,
  onSelectDest,
  onPrefillEnquiry,
  onLogApi
}) => {
  const [daysCount, setDaysCount] = useState(3);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  const dest = destinations.find((d) => d.id === selectedDestId) || destinations[0];

  useEffect(() => {
    setSelectedDayIndex(0);
  }, [selectedDestId, daysCount]);

  useEffect(() => {
    if (!dest) return;
    let isMounted = true;
    setLoadingWeather(true);
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

  if (!dest) return null;

  const totalAvailableDays = dest.days?.length || 1;
  const visibleDays = Math.min(daysCount, totalAvailableDays);
  const currentDay = dest.days?.[selectedDayIndex] || dest.days?.[0] || {
    title: 'Sightseeing',
    morning: 'Explore local sights',
    afternoon: 'Enjoy lunch and activities',
    evening: 'Sunset and relaxation'
  };

  return (
    <section id="plan" className="plan-section">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Curated Itineraries</span>
          <h2>A day-by-day blueprint.</h2>
          <p>
            Choose a destination and trip duration to explore realistic morning, afternoon, and evening recommendations.
          </p>
        </div>

        <div className="plan-toolbar">
          <div className="plan-toolbar-left">
            <label htmlFor="planDest">Select destination:</label>
            <select
              id="planDest"
              value={dest.id}
              onChange={(e) => onSelectDest(e.target.value)}
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="duration-selector" role="group" aria-label="Trip duration">
            <span className="duration-label">Trip length:</span>
            {DURATION_OPTIONS.map((len) => (
              <button
                key={len}
                className="duration-btn"
                data-len={len}
                aria-pressed={daysCount === len}
                onClick={() => setDaysCount(len)}
              >
                {len} Days
              </button>
            ))}
          </div>
        </div>

        {/* Tabs for Day 1, Day 2, etc. */}
        <div className="tabs" id="tabs" role="tablist">
          {Array.from({ length: visibleDays }).map((_, i) => (
            <button
              key={i}
              className="tab-custom"
              role="tab"
              aria-selected={i === selectedDayIndex}
              onClick={() => setSelectedDayIndex(i)}
            >
              Day {i + 1}
            </button>
          ))}
        </div>

        {/* Main Day Panel */}
        <div className="panel" id="panel">
          <div className="panel-main">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div>
                <span className="eyebrow">
                  {dest.name} · Day {selectedDayIndex + 1} of {visibleDays}
                </span>
                <h3 style={{ fontSize: '25px', marginBlock: '6px' }}>{currentDay.title}</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--muted)', fontWeight: 600 }}>
                  Recommended Season: {dest.seasonText} · 📍 {dest.where}
                </p>
              </div>

              <div
                className="plan-weather-pill"
                id="planWeatherLivePill"
                title={`Live weather at ${dest.name} via Open-Meteo`}
              >
                {loadingWeather ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" /> Live weather...
                  </>
                ) : weather ? (
                  <>
                    <span>{weather.icon}</span> <strong>{weather.temp}°C</strong> ({weather.text})
                  </>
                ) : (
                  <>
                    <span>🌡️</span> Season: {dest.seasonText}
                  </>
                )}
              </div>
            </div>

            <div className="slots-grid">
              <div className="slot morning">
                <span className="slot-tag">🌅 Morning</span>
                <p>{currentDay.morning}</p>
              </div>
              <div className="slot afternoon">
                <span className="slot-tag">☀️ Afternoon</span>
                <p>{currentDay.afternoon}</p>
              </div>
              <div className="slot evening">
                <span className="slot-tag">🌙 Evening</span>
                <p>{currentDay.evening}</p>
              </div>
            </div>
          </div>

          <div className="panel-side">
            <div className="art">
              <SceneArt kind={dest.sc[0]} colors={dest.sc[1]} />
            </div>
            <button
              className="btn-custom"
              style={{ width: '100%' }}
              onClick={() => onPrefillEnquiry(dest.id)}
            >
              ✈️ Plan this trip (Enquire now)
            </button>
          </div>
        </div>

        {/* Rich Travel Details, Budget Breakdown & Cost Calculator */}
        <RichDetails dest={dest} />
      </div>
    </section>
  );
};
