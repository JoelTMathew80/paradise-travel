import React from 'react';
import { formatCurrency } from '../utils/helpers';

export const WishlistDrawer = ({
  isOpen,
  onClose,
  savedDestinations,
  currency,
  onRemoveSave,
  onClearAll,
  onSelectPlan
}) => {
  if (!isOpen) return null;

  return (
    <div className="wishlist-drawer-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="wishlist-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="wishlist-drawer-header">
          <div className="d-flex align-items-center gap-2">
            <span className="fs-5">❤️</span>
            <h3 className="mb-0 fs-5 fw-bold">My Saved Wishlist</h3>
            <span className="badge bg-danger rounded-pill">
              {savedDestinations.length}
            </span>
          </div>
          <button
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close saved wishlist"
          >
            ✕
          </button>
        </div>

        <div className="wishlist-drawer-body">
          {savedDestinations.length === 0 ? (
            <div className="wishlist-empty-state">
              <span className="fs-1 mb-2">🏖️</span>
              <h4>Your wishlist is empty</h4>
              <p className="text-muted small">
                Explore destinations and tap the heart icon on any card to save your dream escapes here.
              </p>
              <button
                className="btn-custom btn-sm mt-3"
                onClick={() => {
                  onClose();
                  const places = document.getElementById('places');
                  if (places) places.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Browse Destinations →
              </button>
            </div>
          ) : (
            <div className="wishlist-items-list">
              {savedDestinations.map((dest) => (
                <div key={dest.id} className="wishlist-item-card">
                  <div className="wishlist-item-thumb">
                    <img
                      src={dest.image || 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80'}
                      alt={dest.name}
                    />
                  </div>
                  <div className="wishlist-item-info">
                    <div className="d-flex align-items-start justify-content-between gap-1">
                      <h4 className="wishlist-item-title">{dest.name}</h4>
                      <button
                        className="wishlist-item-remove"
                        onClick={() => onRemoveSave(dest.id)}
                        title="Remove from saved"
                        aria-label={`Remove ${dest.name}`}
                      >
                        ✕
                      </button>
                    </div>
                    <p className="wishlist-item-where">📍 {dest.where}</p>
                    <div className="wishlist-item-meta">
                      <span className="wishlist-item-price">
                        {formatCurrency(dest.price, currency)}
                        <small> / {dest.nights}N</small>
                      </span>
                      <span className="wishlist-item-season">🗓️ {dest.seasonText}</span>
                    </div>
                    <div className="wishlist-item-actions mt-2">
                      <button
                        className="btn-wishlist-plan"
                        onClick={() => {
                          onSelectPlan(dest.id);
                          onClose();
                        }}
                      >
                        View Itinerary →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {savedDestinations.length > 0 && (
          <div className="wishlist-drawer-footer">
            <button className="btn-clear-wishlist" onClick={onClearAll}>
              Clear All Saved
            </button>
            <button
              className="btn-custom btn-sm"
              onClick={() => {
                onClose();
                const contact = document.getElementById('contact');
                if (contact) contact.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Enquire for Trip →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
