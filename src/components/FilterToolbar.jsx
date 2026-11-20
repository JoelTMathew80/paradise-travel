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

export const FilterToolbar = ({
  filterState,
  onFilterChange,
  searchQuery,
  onSearchChange,
  savedCount,
  showOnlySaved,
  onToggleShowSaved
}) => {
  return (
    <div className="toolbar-wrapper">
      {/* Search Input Bar */}
      <div className="search-bar-row">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by destination, state, or activity (e.g., tea, scuba, temple, backwaters)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search destinations"
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="toolbar">
        <div className="chips" role="group" aria-label="Filter by type">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`chip ${!showOnlySaved && filterState.type === cat.id ? 'active' : ''}`}
              data-type={cat.id}
              aria-pressed={!showOnlySaved && filterState.type === cat.id}
              onClick={() => {
                if (showOnlySaved) onToggleShowSaved();
                onFilterChange({ ...filterState, type: cat.id });
              }}
            >
              {cat.label}
            </button>
          ))}

          {/* Saved Wishlist Chip */}
          <button
            className={`chip chip-wishlist ${showOnlySaved ? 'active' : ''}`}
            onClick={onToggleShowSaved}
            aria-pressed={showOnlySaved}
          >
            ❤️ Saved ({savedCount})
          </button>
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
              <option key={idx} value={String(idx)}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
