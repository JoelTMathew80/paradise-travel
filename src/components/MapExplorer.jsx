import React, { useState, useEffect, useRef } from 'react';

const GOOGLE_MAPS_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

const PLACE_TYPES = [
  'tourist attractions',
  'Restaurants',
  'Hotels',
  'Beaches',
  'Viewpoints',
  'Temples'
];

function buildMapEmbedUrl(query) {
  if (GOOGLE_MAPS_KEY && GOOGLE_MAPS_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY') {
    return `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_MAPS_KEY}&q=${encodeURIComponent(query)}`;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
}

export const MapExplorer = ({ destinations, selectedDestId, onSelectDest, onLogApi }) => {
  const [placeType, setPlaceType] = useState('tourist attractions');
  const [isIntersected, setIsIntersected] = useState(false);
  const [isLoadingIframe, setIsLoadingIframe] = useState(true);
  const containerRef = useRef(null);

  const currentDest = destinations.find((d) => d.id === selectedDestId) || destinations[0];
  const query = currentDest ? `${placeType} in ${currentDest.name}` : '';
  const externalGmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isIntersected) {
            setIsIntersected(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '120px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isIntersected]);

  const handleIframeLoad = () => {
    setIsLoadingIframe(false);
    if (onLogApi) {
      onLogApi('EMBED', `maps.google.com/?q=${encodeURIComponent(query)}`, 200, 180, 'Google Maps Embed Search');
    }
  };

  const embedUrl = isIntersected ? buildMapEmbedUrl(query) : '';

  return (
    <section id="map" className="map-section">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Interactive Map</span>
          <h2>Explore on Google Maps</h2>
          <p>Discover tourist attractions, viewpoints, historic temples, beaches, and local restaurants for any destination.</p>
        </div>

        <div className="map-card-wrapper shadow-sm">
          <div className="map-controls-row">
            <div className="map-control-group">
              <label htmlFor="mapDestSelect">Destination</label>
              <select
                id="mapDestSelect"
                value={selectedDestId}
                onChange={(e) => {
                  setIsLoadingIframe(true);
                  onSelectDest(e.target.value);
                }}
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="map-control-group">
              <label htmlFor="mapTypeSelect">Discover</label>
              <select
                id="mapTypeSelect"
                value={placeType}
                onChange={(e) => {
                  setIsLoadingIframe(true);
                  setPlaceType(e.target.value);
                }}
              >
                {PLACE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="map-current-query d-none d-md-flex">
              <span className="map-query-label">Searching:</span>
              <span className="map-query-text">{query}</span>
            </div>

            <a
              id="openInGoogleMapsBtn"
              className="btn-open-gmaps"
              href={externalGmapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open "${query}" on Google Maps in a new tab`}
            >
              <span>Open in Google Maps</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>

          <div className="map-frame-container" id="mapFrameContainer" ref={containerRef}>
            {isLoadingIframe && (
              <div className="map-loading-overlay" id="mapLoadingOverlay">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading map...</span>
                </div>
                <span>Fetching map data for {currentDest?.name}...</span>
              </div>
            )}
            {isIntersected ? (
              <iframe
                id="googleMapIframe"
                title={`Google Map for ${query}`}
                src={embedUrl}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={handleIframeLoad}
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                <span>Scroll to load interactive map...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
