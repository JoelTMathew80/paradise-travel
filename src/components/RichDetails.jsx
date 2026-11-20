import React from 'react';
import { inr } from '../utils/helpers';
import { CostCalculator } from './CostCalculator';

export const RichDetails = ({ dest }) => {
  if (!dest) return null;

  const b = dest.budget || { stay: 0, food: 0, transport: 0, activities: 0 };
  const totalB = b.stay + b.food + b.transport + b.activities;
  const pStay = totalB > 0 ? ((b.stay / totalB) * 100).toFixed(1) : '25';
  const pFood = totalB > 0 ? ((b.food / totalB) * 100).toFixed(1) : '25';
  const pTrans = totalB > 0 ? ((b.transport / totalB) * 100).toFixed(1) : '25';
  const pAct = totalB > 0 ? ((b.activities / totalB) * 100).toFixed(1) : '25';

  return (
    <div className="rich-details" id="richDetails">
      {/* Transit Guidelines */}
      <div className="info-card">
        <h4>🧭 How to reach</h4>
        <div className="reach-list">
          <div className="reach-item">
            <span className="reach-label">✈️ Nearest Airport</span>
            <span>{dest.reach?.airport || 'Not specified'}</span>
          </div>
          <div className="reach-item">
            <span className="reach-label">🚆 Nearest Railway</span>
            <span>{dest.reach?.railway || 'Not specified'}</span>
          </div>
          <div className="reach-item">
            <span className="reach-label">🚕 Local Transport</span>
            <span>{dest.reach?.local || 'Not specified'}</span>
          </div>
        </div>
      </div>

      {/* Indicative Budget Breakdown */}
      <div className="info-card">
        <h4>📊 Sample Budget ({dest.nights} Nights)</h4>
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
            <span className="dot seg-stay" /> Stay: {inr(b.stay)}
          </div>
          <div className="budget-item">
            <span className="dot seg-food" /> Food: {inr(b.food)}
          </div>
          <div className="budget-item">
            <span className="dot seg-trans" /> Transit: {inr(b.transport)}
          </div>
          <div className="budget-item">
            <span className="dot seg-act" /> Activities: {inr(b.activities)}
          </div>
        </div>
        <div className="budget-total">
          <span>Total / Person:</span>
          <span>{inr(totalB)}</span>
        </div>
      </div>

      {/* Group Cost Estimator */}
      <CostCalculator dest={dest} />

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
