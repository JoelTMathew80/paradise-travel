import React, { useState } from 'react';
import { formatCurrency, CURRENCIES } from '../utils/helpers';

export const CostCalculator = ({ dest, currency = 'INR', onCurrencyChange }) => {
  const [travellers, setTravellers] = useState(2);
  const [nights, setNights] = useState(dest.nights || 3);

  const ratePerNight = dest.price / (dest.nights || 1);
  const perPersonTotal = Math.round(ratePerNight * nights);
  const grandTotal = perPersonTotal * travellers;

  return (
    <div className="info-card calc-card">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h4 className="mb-0">🧮 Group Cost Calculator</h4>
        {onCurrencyChange && (
          <select
            className="form-select form-select-sm"
            style={{ width: 'auto', fontSize: '12px' }}
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
          >
            {Object.keys(CURRENCIES).map((c) => (
              <option key={c} value={c}>
                {c} ({CURRENCIES[c].symbol})
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="calc-fields">
        <div className="field">
          <label htmlFor="calcTravellers">Travellers</label>
          <input
            type="number"
            id="calcTravellers"
            min="1"
            max="20"
            value={travellers}
            onChange={(e) => setTravellers(Math.max(1, parseInt(e.target.value, 10) || 1))}
          />
        </div>
        <div className="field">
          <label htmlFor="calcNights">Nights</label>
          <input
            type="number"
            id="calcNights"
            min="1"
            max="14"
            value={nights}
            onChange={(e) => setNights(Math.max(1, parseInt(e.target.value, 10) || 1))}
          />
        </div>
      </div>

      <div className="calc-result">
        <span className="calc-note">Estimated Total for Group</span>
        <div className="calc-total" id="calcTotalOutput">
          {formatCurrency(grandTotal, currency)}
        </div>
        <span className="calc-note" id="calcPerPersonOutput">
          {formatCurrency(perPersonTotal, currency)} per person ({nights} nights)
        </span>
      </div>
    </div>
  );
};
