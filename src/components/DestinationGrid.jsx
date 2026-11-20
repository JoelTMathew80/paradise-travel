import React from 'react';
import { MONTHS } from '../utils/helpers';
import { DestinationCard } from './DestinationCard';

export const DestinationGrid = ({
  destinations,
  filterState,
  onClearFilters,
  onSelectPlan,
  onQuickEnquire,
  onLogApi
}) => {
  const filtered = destinations.filter((d) => {
    const matchesType = filterState.type === 'all' || d.type === filterState.type;
    const matchesMonth =
      filterState.month === 'any' || d.season.includes(Number(filterState.month));
    return matchesType && matchesMonth;
  });

  const monthLabel =
    filterState.month === 'any' ? '' : ` in ${MONTHS[Number(filterState.month)]}`;
  const countText = `Showing ${filtered.length} ${
    filtered.length === 1 ? 'destination' : 'destinations'
  }${monthLabel}`;

  return (
    <>
      <p className="count" id="count" aria-live="polite">
        {countText}
      </p>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>Nothing fits that combination. Try another month or category.</p>
          <button className="btn-custom" onClick={onClearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid" id="grid">
          {filtered.map((dest) => (
            <DestinationCard
              key={dest.id}
              dest={dest}
              onSelectPlan={onSelectPlan}
              onQuickEnquire={onQuickEnquire}
              onLogApi={onLogApi}
            />
          ))}
        </div>
      )}
    </>
  );
};
