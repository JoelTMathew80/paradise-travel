import React, { useState, useEffect } from 'react';

export const Navbar = () => {
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
            <button
              className="icon-btn"
              onClick={toggleTheme}
              aria-label="Switch colour theme"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Theme'}
            </button>
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
