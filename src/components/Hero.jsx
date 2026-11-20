import React from 'react';
import { MONTHS } from '../utils/helpers';
import { SceneArt } from './SceneArt';

export const Hero = ({ destCount, filterState, onFilterChange }) => {
  const [selectedType, setSelectedType] = React.useState(filterState.type);
  const [selectedMonth, setSelectedMonth] = React.useState(filterState.month);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ type: selectedType, month: selectedMonth });
    const target = document.getElementById('places');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="wrap hero">
      <div className="hero-grid">
        <div>
          <span className="eyebrow">✨ Curated Southern India Escapes</span>
          <h1>Go when the weather is <em>on your side.</em></h1>
          <p className="lede">
            <span>{destCount || '--'}</span> handpicked beaches, hill stations, backwaters and ruins across Southern India, each matched to the months when it is at its absolute best.
          </p>

          <form className="finder" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="hType"><span>📍</span> I want</label>
              <select
                id="hType"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">Anything</option>
                <option value="beach">A beach</option>
                <option value="hills">Hills and green</option>
                <option value="culture">History and culture</option>
                <option value="backwaters">Backwaters</option>
                <option value="wildlife">Wildlife & safari</option>
                <option value="waterfalls">Waterfalls</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="hMonth"><span>🗓️</span> Travelling in</label>
              <select
                id="hMonth"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="any">Any month</option>
                {MONTHS.map((m, idx) => (
                  <option key={idx} value={String(idx)}>{m}</option>
                ))}
              </select>
            </div>

            <button className="btn-custom" type="submit">
              Find places →
            </button>
          </form>
        </div>

        <div className="hero-art">
          <SceneArt
            kind="beach"
            colors={['#9FE3E0', '#FDE7C2', '#FFB347', '#0B7F86', '#F4D9A6', '#0E9AA0']}
          />
        </div>
      </div>
    </div>
  );
};
