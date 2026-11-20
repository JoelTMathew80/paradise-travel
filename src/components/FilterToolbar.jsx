import React from 'react';
import { MONTHS } from '../utils/helpers';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'beach', label: 'Beaches' },
  { id: 'hills', label: 'Hills' },
  { id: 'culture', label: 'History' },
  { id: 'backwaters', label: 'Backwaters' },
  { id: 'wildlife', label: 'Wildlife' },
  { id: 'waterfalls', label: 'Waterfalls' }
];

export const FilterToolbar = ({ filterState, onFilterChange }) => {
  return (
    <div className="toolbar">
      <div className="chips" role="group" aria-label="Filter by type">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className="chip"
            data-type={cat.id}
            aria-pressed={filterState.type === cat.id}
            onClick={() => onFilterChange({ ...filterState, type: cat.id })}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="field">
        <label htmlFor="fMonth">Travelling in</label>
        <select
          id="fMonth"
          value={filterState.month}
          onChange={(e) => onFilterChange({ ...filterState, month: e.target.value })}
        >
          <option value="any">Any month</option>
          {MONTHS.map((m, idx) => (
            <option key={idx} value={String(idx)}>{m}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
