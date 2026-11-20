import React, { useState } from 'react';
import { inr } from '../utils/helpers';

export const CostCalculator = ({ dest }) => {
  const [travellers, setTravellers] = useState(2);
  const [nights, setNights] = useState(dest.nights || 3);

  const ratePerNight = dest.price / (dest.nights || 1);
  const perPersonTotal = Math.round(ratePerNight * nights);
  const grandTotal = perPersonTotal * travellers;

  return (
    <div className="info-card calc-card">
      <h4>🧮 Cost Calculator</h4>
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
          {inr(grandTotal)}
        </div>
        <span className="calc-note" id="calcPerPersonOutput">
          {inr(perPersonTotal)} per person ({nights} nights)
        </span>
      </div>
    </div>
  );
};
