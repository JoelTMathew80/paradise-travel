import React, { useState, useEffect } from 'react';
import { CURRENCIES } from '../utils/helpers';

export const Navbar = ({
  savedCount = 0,
  onOpenWishlist,
  currency,
  onCurrencyChange
}) => {
  const [theme, setTheme] = useState(() => {
    return (
      document.documentElement.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('places');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="site">
      <div className="wrap">
        <div className="bar">
          {/* Brand Logo */}
          <a className="brand" href="#top" aria-label="Paradise Travel home">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="16" cy="13" r="7" fill="#E05638" />
              <path d="M2 21q4-4 7 0t7 0 7 0 7 0v9H2z" fill="#0E7C7B" />
            </svg>
            <span>Paradise</span>
          </a>

          {/* Desktop Center Navigation Tabs */}
          <nav className="nav-tabs-wrapper d-none d-lg-flex" aria-label="Main navigation">
            <ul className="nav-tabs-list">
              <li>
                <button
                  className={`nav-tab-btn ${activeSection === 'places' ? 'active' : ''}`}
                  onClick={() => handleNavClick('places')}
                >
                  📍 Places
                </button>
              </li>
              <li>
                <button
                  className={`nav-tab-btn ${activeSection === 'map' ? 'active' : ''}`}
                  onClick={() => handleNavClick('map')}
                >
                  🗺️ Explore Map
                </button>
              </li>
              <li>
                <button
                  className={`nav-tab-btn ${activeSection === 'plan' ? 'active' : ''}`}
                  onClick={() => handleNavClick('plan')}
                >
                  🗓️ Trip Plan
                </button>
              </li>
              <li>
                <button
                  className={`nav-tab-btn ${activeSection === 'contact' ? 'active' : ''}`}
                  onClick={() => handleNavClick('contact')}
                >
                  ✉️ Enquire
                </button>
              </li>
            </ul>
          </nav>

          {/* Right Utility Actions */}
          <div className="nav-actions">
            {/* Currency Selector */}
            <div className="currency-pill-wrap" title="Change display currency">
              <select
                className="currency-select-pill"
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value)}
                aria-label="Select display currency"
              >
                {Object.keys(CURRENCIES).map((code) => (
                  <option key={code} value={code}>
                    {code} ({CURRENCIES[code].symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Saved Wishlist Tab Button */}
            <button
              className="nav-wishlist-btn"
              onClick={onOpenWishlist}
              title="Open your saved wishlist drawer"
              aria-label={`Saved destinations (${savedCount})`}
            >
              <span>❤️</span>
              <span className="d-none d-sm-inline">Saved</span>
              <span className="saved-count-pill">{savedCount}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Switch colour theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Mobile Hamburger Button (ONLY visible on small screens) */}
            <button
              className="mobile-menu-btn d-lg-none"
              id="menuBtn"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobileNavMenu"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Collapsible) */}
        {mobileMenuOpen && (
          <div className="mobile-nav-menu d-lg-none" id="mobileNavMenu">
            <ul className="mobile-links-list">
              <li>
                <button onClick={() => handleNavClick('places')}>
                  📍 Places Catalog
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('map')}>
                  🗺️ Explore on Map
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('plan')}>
                  🗓️ Day-by-Day Itineraries
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('contact')}>
                  ✉️ Custom Trip Enquiry
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};
