import React from 'react';
import { MONTHS } from '../utils/helpers';
import { DestinationCard } from './DestinationCard';

export const DestinationGrid = ({
  destinations,
  filterState,
  searchQuery = '',
  savedDestIds = [],
  showOnlySaved = false,
  currency = 'INR',
  onToggleSave,
  onClearFilters,
  onSelectPlan,
  onQuickEnquire,
  onLogApi
}) => {
  const query = searchQuery.trim().toLowerCase();

  const filtered = destinations.filter((d) => {
    // 1. Saved filter
    if (showOnlySaved && !savedDestIds.includes(d.id)) {
      return false;
    }

    // 2. Type filter
    const matchesType = filterState.type === 'all' || d.type === filterState.type;

    // 3. Month filter
    const matchesMonth =
      filterState.month === 'any' || d.season.includes(Number(filterState.month));

    // 4. Search query
    let matchesSearch = true;
    if (query) {
      const matchName = d.name.toLowerCase().includes(query);
      const matchWhere = d.where.toLowerCase().includes(query);
      const matchBlurb = d.blurb.toLowerCase().includes(query);
      const matchTags = d.tags?.some((t) => t.toLowerCase().includes(query));
      matchesSearch = matchName || matchWhere || matchBlurb || matchTags;
    }

    return matchesType && matchesMonth && matchesSearch;
  });

  const monthLabel =
    filterState.month === 'any' ? '' : ` in ${MONTHS[Number(filterState.month)]}`;
  const searchNote = query ? ` matching "${searchQuery}"` : '';
  const savedNote = showOnlySaved ? ' in your saved wishlist' : '';

  const countText = `Showing ${filtered.length} ${
    filtered.length === 1 ? 'destination' : 'destinations'
  }${savedNote}${monthLabel}${searchNote}`;

  return (
    <>
      <p className="count" id="count" aria-live="polite">
        {countText}
      </p>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>
            {showOnlySaved
              ? 'You have not saved any destinations yet. Click the ❤️ on any card to save it!'
              : 'Nothing fits that combination. Try clearing your search or filters.'}
          </p>
          <button className="btn-custom" onClick={onClearFilters}>
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid" id="grid">
          {filtered.map((dest) => (
            <DestinationCard
              key={dest.id}
              dest={dest}
              currency={currency}
              isSaved={savedDestIds.includes(dest.id)}
              onToggleSave={onToggleSave}
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
