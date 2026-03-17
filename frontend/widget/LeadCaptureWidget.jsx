import { useState } from 'react';

const STYLES = {
  // Floating button
  fab: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#6366f1',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
    zIndex: 9999,
    transition: 'transform 0.2s, box-shadow 0.2s',
    fontSize: '22px',
  },
  // Popup card
  card: {
    position: 'fixed',
    bottom: '92px',
    right: '24px',
    width: '340px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
    zIndex: 9999,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    overflow: 'hidden',
    animation: 'fadeSlideIn 0.25s ease',
  },
  header: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    padding: '18px 20px',
    color: '#fff',
  },
  headerTitle: { margin: 0, fontSize: '16px', fontWeight: '600' },
  headerSub: { margin: '4px 0 0', fontSize: '12px', opacity: 0.85 },
  body: { padding: '20px' },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#111827',
    boxSizing: 'border-box',
    outline: 'none',
    marginBottom: '12px',
    fontFamily: 'inherit',
  },
  textarea: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#111827',
    boxSizing: 'border-box',
    outline: 'none',
    marginBottom: '12px',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '72px',
  },
  btn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  btnDisabled: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#a5b4fc',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
  },
  error: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '12px',
    marginBottom: '12px',
  },
  success: {
    textAlign: 'center',
    padding: '24px 20px',
  },
  successIcon: { fontSize: '48px', marginBottom: '12px' },
  successTitle: { fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '6px' },
  successSub: { fontSize: '13px', color: '#6b7280' },
  footer: {
    textAlign: 'center',
    fontSize: '10px',
    color: '#9ca3af',
    padding: '10px 20px',
    borderTop: '1px solid #f3f4f6',
  },
};

export default function LeadCaptureWidget({ apiBase, siteToken, title, subtitle }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const base = apiBase || window.__CRM_API_BASE__ || '';
  const token = siteToken || window.__CRM_SITE_TOKEN__ || '';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.phone.trim()) { setError('Phone number is required'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${base}/api/widget/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, site_token: token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setSubmitted(false);
    setForm({ name: '', phone: '', email: '', message: '' });
    setError('');
    setOpen(false);
  }

  return (
    <>
      {/* Inject animation keyframes once */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Floating action button */}
      <button
        style={STYLES.fab}
        onClick={() => setOpen((v) => !v)}
        title={open ? 'Close' : 'Contact us'}
        aria-label={open ? 'Close contact form' : 'Open contact form'}
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Popup card */}
      {open && (
        <div style={STYLES.card} role="dialog" aria-modal="true" aria-label="Contact form">
          {/* Header */}
          <div style={STYLES.header}>
            <p style={STYLES.headerTitle}>{title || 'Get in Touch'}</p>
            <p style={STYLES.headerSub}>{subtitle || "We'll get back to you shortly."}</p>
          </div>

          {submitted ? (
            /* Success state */
            <div>
              <div style={STYLES.success}>
                <div style={STYLES.successIcon}>✅</div>
                <p style={STYLES.successTitle}>Message Received!</p>
                <p style={STYLES.successSub}>Our team will reach out to you soon.</p>
              </div>
              <div style={{ padding: '0 20px 20px' }}>
                <button style={STYLES.btn} onClick={handleReset}>Close</button>
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} style={STYLES.body} noValidate>
              {error && <div style={STYLES.error}>{error}</div>}

              <label style={STYLES.label}>Full Name</label>
              <input
                style={STYLES.input}
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
              />

              <label style={STYLES.label}>Phone Number *</label>
              <input
                style={STYLES.input}
                type="tel"
                placeholder="+1 234 567 8900"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
              />

              <label style={STYLES.label}>Email Address</label>
              <input
                style={STYLES.input}
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
              />

              <label style={STYLES.label}>Message</label>
              <textarea
                style={STYLES.textarea}
                placeholder="How can we help you?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
              />

              <button
                type="submit"
                style={loading ? STYLES.btnDisabled : STYLES.btn}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}

          <div style={STYLES.footer}>Powered by CRM &nbsp;·&nbsp; Your data is safe with us</div>
        </div>
      )}
    </>
  );
}
