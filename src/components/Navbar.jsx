import React, { useState, useEffect } from 'react';
import { CURRENCIES } from '../utils/helpers';

export const Navbar = ({ savedCount = 0, onToggleSavedView, isSavedViewActive, currency, onCurrencyChange }) => {
  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site">
      <div className="wrap">
        <div className="bar">
          <a className="brand" href="#top" aria-label="Paradise Travel home">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="16" cy="13" r="7" fill="#E05638" />
              <path d="M2 21q4-4 7 0t7 0 7 0 7 0v9H2z" fill="#0E7C7B" />
            </svg>
            Paradise
          </a>

          <div className="nav-actions">
            {/* Currency Selector */}
            <select
              className="currency-select"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              title="Change display currency"
              aria-label="Currency selector"
            >
              {Object.keys(CURRENCIES).map((code) => (
                <option key={code} value={code}>
                  {code} ({CURRENCIES[code].symbol})
                </option>
              ))}
            </select>

            {/* Saved Wishlist Toggle */}
            <button
              className={`nav-wishlist-btn ${isSavedViewActive ? 'active' : ''}`}
              onClick={onToggleSavedView}
              title="View your saved wishlist destinations"
              aria-label="Saved destinations"
            >
              <span>❤️</span>
              <span className="d-none d-sm-inline">Saved</span>
              <span className="badge rounded-pill bg-danger ms-1">{savedCount}</span>
            </button>

            {/* Theme Toggle */}
            <button
              className="icon-btn"
              onClick={toggleTheme}
              aria-label="Switch colour theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Mobile Menu */}
            <button
              className="icon-btn"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="links"
            >
              Menu
            </button>
          </div>

          <ul className={`links ${menuOpen ? 'open' : ''}`} id="links">
            <li><a href="#places" onClick={closeMenu}>Places</a></li>
            <li><a href="#map" onClick={closeMenu}>Explore map</a></li>
            <li><a href="#plan" onClick={closeMenu}>Trip plan</a></li>
            <li><a href="#contact" onClick={closeMenu}>Enquire</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
};
