import React, { useState } from 'react';

export const ApiLogDrawer = ({ logs, onClear }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`api-log-drawer shadow-lg ${collapsed ? 'collapsed' : ''}`}
      id="apiLogDrawer"
      aria-label="API Network Inspector"
    >
      <div
        className="api-log-header"
        id="apiLogHeader"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        <div className="d-flex align-items-center gap-2">
          <span className="api-pulse-dot" />
          <strong>REST API Log</strong>
          <span className="badge bg-dark rounded-pill" id="apiCallCountBadge">
            {logs.length} call{logs.length === 1 ? '' : 's'}
          </span>
        </div>
        <div className="d-flex align-items-center gap-1">
          <button
            className="btn-icon-subtle"
            id="clearApiLogBtn"
            title="Clear log"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
          >
            🗑️
          </button>
          <button
            className="btn-icon-subtle"
            id="toggleApiLogBtn"
            title="Toggle expand/collapse"
          >
            {collapsed ? '▲' : '▼'}
          </button>
        </div>
      </div>

      <div className="api-log-body" id="apiLogBody">
        <div className="api-log-intro">
          <small style={{ color: '#7EA8A3' }}>
            Live network inspector showing HTTP methods, status codes, endpoints, and latency (ms).
          </small>
        </div>

        <div className="api-log-list" id="apiLogList">
          {logs.length === 0 ? (
            <div style={{ color: '#6C9490', padding: '4px 0' }}>
              <small>No requests logged yet.</small>
            </div>
          ) : (
            logs.map((log) => {
              const isError = log.status >= 400 || log.status === 'ERR';
              const isCached = log.status === 'CACHED';
              const statusBadgeClass = isCached
                ? 'status-cached-badge'
                : log.status >= 400
                ? 'status-4xx'
                : 'status-2xx';

              const itemClass = [
                'api-log-item',
                log.method === 'POST' ? 'method-POST' : '',
                log.method === 'EMBED' ? 'method-EMBED' : '',
                isError ? 'status-error' : '',
                isCached ? 'status-cached' : ''
              ]
                .filter(Boolean)
                .join(' ');

              const truncatedUrl =
                log.url.length > 55 ? `${log.url.substring(0, 52)}...` : log.url;

              return (
                <div key={log.id} className={itemClass}>
                  <div className="api-log-top-row">
                    <div className="d-flex align-items-center gap-1">
                      <span className={`api-badge-method ${log.method}`}>
                        {log.method}
                      </span>
                      <span className={`api-badge-status ${statusBadgeClass}`}>
                        {log.status}
                      </span>
                    </div>
                    <span style={{ color: '#6C9490', fontSize: '10px' }}>
                      ⚡ {log.durationMs}ms
                    </span>
                  </div>
                  <div className="api-log-url" title={log.url}>
                    {truncatedUrl}
                  </div>
                  <div className="api-log-meta">
                    <span>{log.note || ''}</span>
                    <span>{log.timeStr}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
};
