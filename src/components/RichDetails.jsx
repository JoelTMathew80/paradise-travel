import React, { useState } from 'react';
import { formatCurrency } from '../utils/helpers';
import { CostCalculator } from './CostCalculator';

export const RichDetails = ({ dest, currency = 'INR', onCurrencyChange }) => {
  const [checkedItems, setCheckedItems] = useState({});

  if (!dest) return null;

  const b = dest.budget || { stay: 0, food: 0, transport: 0, activities: 0 };
  const totalB = b.stay + b.food + b.transport + b.activities;
  const pStay = totalB > 0 ? ((b.stay / totalB) * 100).toFixed(1) : '25';
  const pFood = totalB > 0 ? ((b.food / totalB) * 100).toFixed(1) : '25';
  const pTrans = totalB > 0 ? ((b.transport / totalB) * 100).toFixed(1) : '25';
  const pAct = totalB > 0 ? ((b.activities / totalB) * 100).toFixed(1) : '25';

  const togglePackingItem = (idx) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const flightsUrl = dest.airportCode
    ? `https://www.google.com/travel/flights?q=flights+to+${dest.airportCode}`
    : `https://www.google.com/travel/flights?q=flights+to+${encodeURIComponent(dest.name)}`;

  const trainsUrl = dest.railwayCode
    ? `https://www.irctc.co.in/nget/train-search`
    : `https://www.google.com/search?q=trains+to+${encodeURIComponent(dest.name)}`;

  return (
    <div className="rich-details" id="richDetails">
      {/* Transit Guidelines & Direct Search Shortcuts */}
      <div className="info-card">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h4 className="mb-0">🧭 How to reach</h4>
          <span className="badge bg-light text-dark border">Transit Guide</span>
        </div>

        <div className="reach-list">
          <div className="reach-item">
            <span className="reach-label">✈️ Nearest Airport</span>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 w-100">
              <span>{dest.reach?.airport || 'Not specified'}</span>
              <a
                href={flightsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transit-action-link"
                title="Search flights on Google Flights"
              >
                Find Flights ↗
              </a>
            </div>
          </div>

          <div className="reach-item">
            <span className="reach-label">🚆 Nearest Railway</span>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 w-100">
              <span>{dest.reach?.railway || 'Not specified'}</span>
              <a
                href={trainsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transit-action-link"
                title="Search train connectivity"
              >
                Check Trains ↗
              </a>
            </div>
          </div>

          <div className="reach-item">
            <span className="reach-label">🚕 Local Transport</span>
            <span>{dest.reach?.local || 'Not specified'}</span>
          </div>
        </div>
      </div>

      {/* Indicative Budget Breakdown */}
      <div className="info-card">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h4 className="mb-0">📊 Sample Budget ({dest.nights} Nights)</h4>
          <span className="badge bg-light text-dark border">{currency}</span>
        </div>

        <div
          className="budget-bar"
          title={`Stay ${pStay}%, Food ${pFood}%, Transport ${pTrans}%, Activities ${pAct}%`}
        >
          <div className="budget-seg seg-stay" style={{ width: `${pStay}%` }} />
          <div className="budget-seg seg-food" style={{ width: `${pFood}%` }} />
          <div className="budget-seg seg-trans" style={{ width: `${pTrans}%` }} />
          <div className="budget-seg seg-act" style={{ width: `${pAct}%` }} />
        </div>

        <div className="budget-list">
          <div className="budget-item">
            <span className="dot seg-stay" /> Stay: {formatCurrency(b.stay, currency)}
          </div>
          <div className="budget-item">
            <span className="dot seg-food" /> Food: {formatCurrency(b.food, currency)}
          </div>
          <div className="budget-item">
            <span className="dot seg-trans" /> Transit: {formatCurrency(b.transport, currency)}
          </div>
          <div className="budget-item">
            <span className="dot seg-act" /> Activities: {formatCurrency(b.activities, currency)}
          </div>
        </div>

        <div className="budget-total">
          <span>Total / Person:</span>
          <span>{formatCurrency(totalB, currency)}</span>
        </div>
      </div>

      {/* Group Cost Estimator */}
      <CostCalculator dest={dest} currency={currency} onCurrencyChange={onCurrencyChange} />

      {/* Interactive Seasonal Packing Checklist */}
      {dest.packing && dest.packing.length > 0 && (
        <div className="info-card packing-card">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h4 className="mb-0">🎒 Seasonal Packing Checklist</h4>
            <small className="text-muted">Interactive checklist</small>
          </div>
          <ul className="packing-list">
            {dest.packing.map((item, idx) => (
              <li
                key={idx}
                className={`packing-item ${checkedItems[idx] ? 'checked' : ''}`}
                onClick={() => togglePackingItem(idx)}
              >
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={!!checkedItems[idx]}
                  onChange={() => togglePackingItem(idx)}
                  aria-label={item}
                />
                <span className="packing-text">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Travel Tips & Advisories */}
      <div className="info-card">
        <h4>⚠️ Travel Tips & Advice</h4>
        <ul className="tips-list">
          {dest.tips?.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
