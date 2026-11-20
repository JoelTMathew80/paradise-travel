import React, { useState, useEffect } from 'react';
import { MONTHS } from '../utils/helpers';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/placeholder_enquiry';

export const EnquiryForm = ({ destinations, prefillData, onLogApi }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [destId, setDestId] = useState('');
  const [month, setMonth] = useState('any');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [toast, setToast] = useState({ show: false, type: 'success', title: '', body: '' });

  useEffect(() => {
    if (prefillData?.destId) {
      setDestId(prefillData.destId);
    }
    if (prefillData?.month !== undefined) {
      setMonth(String(prefillData.month));
    }
  }, [prefillData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('Transmitting enquiry payload...');

    const destObj = destinations.find((d) => d.id === destId);
    const destName = destObj ? destObj.name : 'Unspecified';
    const monthName = month !== 'any' && MONTHS[Number(month)] ? MONTHS[Number(month)] : 'Flexible';

    const payload = {
      name: name.trim(),
      email: email.trim(),
      destination: destName,
      month: monthName,
      notes: notes.trim(),
      submittedAt: new Date().toISOString()
    };

    const startTime = performance.now();

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const duration = Math.round(performance.now() - startTime);
      if (onLogApi) {
        onLogApi('POST', FORMSPREE_ENDPOINT, res.status, duration, 'Enquiry Form Dispatch');
      }

      if (res.ok) {
        setStatusMessage(`Thanks, ${name}! Your enquiry for ${destName} was successfully received.`);
        setToast({
          show: true,
          type: 'success',
          title: '🎉 Enquiry Sent!',
          body: `Thank you ${name}, your trip request for ${destName} has been dispatched.`
        });
        setName('');
        setEmail('');
        setNotes('');
      } else {
        setStatusMessage(`Formspree endpoint responded with HTTP ${res.status}. Request logged in API console.`);
        setToast({
          show: true,
          type: 'warning',
          title: `ℹ️ HTTP ${res.status}:`,
          body: 'Request was transmitted via POST (application/json) to Formspree endpoint. Check API Log.'
        });
      }
    } catch (err) {
      const failDuration = Math.round(performance.now() - startTime);
      if (onLogApi) {
        onLogApi('POST', FORMSPREE_ENDPOINT, 'ERR', failDuration, 'Network error / endpoint unavailable');
      }
      setStatusMessage(`Submission error: ${err.message || 'Network failure'}. See API Log for details.`);
      setToast({
        show: true,
        type: 'danger',
        title: '⚠️ Submission Error:',
        body: `Could not connect to Formspree endpoint (${err.message}).`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <div className="contact-head">
          <span className="eyebrow">Start Planning</span>
          <h2>Tell us where you want to go.</h2>
          <p>
            Share your preferred dates and travel style. We will put together a customized, season-aligned itinerary.
          </p>
        </div>

        <form className="form" id="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              placeholder="E.g. Joel Mathew"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="eDest">Destination</label>
            <select
              id="eDest"
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
            >
              <option value="">Not sure yet</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="eMonth">Travel Month</label>
            <select
              id="eMonth"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="any">Any month</option>
              {MONTHS.map((m, idx) => (
                <option key={idx} value={String(idx)}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="field wide">
            <label htmlFor="msg">Trip Notes & Preferences</label>
            <textarea
              id="msg"
              rows={3}
              placeholder="Group size, special requests, dietary needs, or budget"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="wide">
            <button className="btn-custom" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Sending...
                </>
              ) : (
                <span>Send enquiry →</span>
              )}
            </button>
          </div>

          {statusMessage && (
            <p className="status-custom" role="status" aria-live="polite">
              {statusMessage}
            </p>
          )}
        </form>
      </div>

      {/* Bootstrap Toast */}
      {toast.show && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
          <div
            className={`toast show align-items-center border-0 shadow-lg text-bg-${toast.type}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center gap-2">
                <strong>{toast.title}</strong> {toast.body}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                aria-label="Close"
                onClick={() => setToast({ ...toast, show: false })}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
