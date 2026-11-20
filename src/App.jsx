import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterToolbar } from './components/FilterToolbar';
import { DestinationGrid } from './components/DestinationGrid';
import { MapExplorer } from './components/MapExplorer';
import { TripPlanner } from './components/TripPlanner';
import { EnquiryForm } from './components/EnquiryForm';
import { ApiLogDrawer } from './components/ApiLogDrawer';

let logCounter = 0;

export const App = () => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Filters & Search
  const [filterState, setFilterState] = useState({ type: 'all', month: 'any' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlySaved, setShowOnlySaved] = useState(false);

  // Preferences
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('paradise_currency') || 'INR';
  });

  // Wishlist / Saved in localStorage
  const [savedDestIds, setSavedDestIds] = useState(() => {
    try {
      const stored = localStorage.getItem('paradise_saved_trips');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [selectedDestId, setSelectedDestId] = useState('andaman');
  const [enquiryPrefill, setEnquiryPrefill] = useState(null);
  const [apiLogs, setApiLogs] = useState([]);

  const handleCurrencyChange = (newCurr) => {
    setCurrency(newCurr);
    try {
      localStorage.setItem('paradise_currency', newCurr);
    } catch {}
  };

  const handleToggleSave = (destId) => {
    setSavedDestIds((prev) => {
      const next = prev.includes(destId)
        ? prev.filter((id) => id !== destId)
        : [...prev, destId];
      try {
        localStorage.setItem('paradise_saved_trips', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleToggleSavedView = () => {
    setShowOnlySaved((prev) => !prev);
    const placesEl = document.getElementById('places');
    if (placesEl) placesEl.scrollIntoView({ behavior: 'smooth' });
  };

  // Telemetry API Logger callback
  const logApiCall = useCallback((method, url, status, durationMs, note = '') => {
    const entry = {
      id: `log-${++logCounter}`,
      method,
      url,
      status,
      durationMs,
      note,
      timeStr: new Date().toLocaleTimeString()
    };
    setApiLogs((prev) => [entry, ...prev]);
  }, []);

  const clearApiLogs = useCallback(() => {
    setApiLogs([]);
  }, []);

  // Fetch destination catalog
  const loadDestinations = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    const startTime = performance.now();
    const url = 'destinations.json';

    try {
      const res = await fetch(url);
      const duration = Math.round(performance.now() - startTime);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setDestinations(data);
      logApiCall('GET', url, res.status, duration, `Loaded ${data.length} destinations`);
      if (data.length > 0) {
        setSelectedDestId(data[0].id);
      }
    } catch (err) {
      const failDuration = Math.round(performance.now() - startTime);
      logApiCall('GET', url, 'ERR', failDuration, err.message || 'Fetch Failed');
      setFetchError(err.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  }, [logApiCall]);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  // Navigation callbacks
  const handleSelectPlan = (id) => {
    setSelectedDestId(id);
    const planEl = document.getElementById('plan');
    if (planEl) planEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickEnquire = (id) => {
    const d = destinations.find((item) => item.id === id);
    const targetMonth = filterState.month !== 'any' ? filterState.month : d?.season?.[0] ?? 'any';
    setEnquiryPrefill({ destId: id, month: targetMonth });
    setSelectedDestId(id);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
      const nameInput = document.getElementById('name');
      if (nameInput) nameInput.focus();
    }
  };

  const handleClearFilters = () => {
    setFilterState({ type: 'all', month: 'any' });
    setSearchQuery('');
    setShowOnlySaved(false);
  };

  return (
    <>
      <Navbar
        savedCount={savedDestIds.length}
        isSavedViewActive={showOnlySaved}
        onToggleSavedView={handleToggleSavedView}
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
      />

      <main id="top">
        <Hero
          destCount={destinations.length}
          filterState={filterState}
          onFilterChange={setFilterState}
        />

        {/* Places Catalog Section */}
        <section id="places" className="places">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Explore Destinations</span>
              <h2>Fourteen ways to experience the South.</h2>
              <p>Filter by region type, travel month, keywords, or view your saved wishlist.</p>

              {/* Loading Spinner */}
              {isLoading && (
                <div
                  id="destSpinner"
                  className="d-flex align-items-center justify-content-center gap-3 p-4 bg-white rounded-4 border shadow-sm my-3"
                >
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading destinations...</span>
                  </div>
                  <span className="fw-semibold text-muted">
                    Fetching destinations from <code>destinations.json</code>...
                  </span>
                </div>
              )}

              {/* Error Alert */}
              {fetchError && (
                <div
                  id="destErrorAlert"
                  className="alert alert-danger d-flex align-items-center justify-content-between p-3 rounded-4 shadow-sm my-3"
                  role="alert"
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-4">⚠️</span>
                    <div>
                      <strong>Failed to load destinations:</strong> <span>{fetchError}</span>
                      <div className="small mt-1 text-muted">
                        When running locally, serve via HTTP (e.g. <code>npm run dev</code> or <code>npx serve</code>) to allow <code>fetch()</code> requests.
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm fw-bold"
                    onClick={loadDestinations}
                  >
                    🔄 Retry
                  </button>
                </div>
              )}
            </div>

            {!isLoading && (
              <>
                <FilterToolbar
                  filterState={filterState}
                  onFilterChange={setFilterState}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  savedCount={savedDestIds.length}
                  showOnlySaved={showOnlySaved}
                  onToggleShowSaved={() => setShowOnlySaved((prev) => !prev)}
                />
                <DestinationGrid
                  destinations={destinations}
                  filterState={filterState}
                  searchQuery={searchQuery}
                  savedDestIds={savedDestIds}
                  showOnlySaved={showOnlySaved}
                  currency={currency}
                  onToggleSave={handleToggleSave}
                  onClearFilters={handleClearFilters}
                  onSelectPlan={handleSelectPlan}
                  onQuickEnquire={handleQuickEnquire}
                  onLogApi={logApiCall}
                />
              </>
            )}
          </div>
        </section>

        {/* Interactive Google Maps */}
        <MapExplorer
          destinations={destinations}
          selectedDestId={selectedDestId}
          onSelectDest={setSelectedDestId}
          onLogApi={logApiCall}
        />

        {/* Day-by-Day Trip Planner & Cost Calculator */}
        <TripPlanner
          destinations={destinations}
          selectedDestId={selectedDestId}
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
          onSelectDest={setSelectedDestId}
          onPrefillEnquiry={handleQuickEnquire}
          onLogApi={logApiCall}
        />

        {/* Enquiry Form with Formspree POST */}
        <EnquiryForm
          destinations={destinations}
          prefillData={enquiryPrefill}
          onLogApi={logApiCall}
        />
      </main>

      {/* Footer */}
      <footer>
        <div className="wrap">
          <div>
            &copy; 2026 Paradise Travel. Built with React 18 &amp; Bootstrap 5. Live weather powered by Open-Meteo.
          </div>
          <div>
            Sample indicative pricing. Itineraries verified against South India &amp; Kerala Tourism guidelines.
          </div>
        </div>
      </footer>

      {/* Real-time REST API Logger Drawer */}
      <ApiLogDrawer logs={apiLogs} onClear={clearApiLogs} />
    </>
  );
};
