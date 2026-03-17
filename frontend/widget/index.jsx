import React from 'react';
import ReactDOM from 'react-dom/client';
import LeadCaptureWidget from './LeadCaptureWidget';

function mount() {
  // Find the host div inserted by the embed snippet
  const container = document.getElementById('crm-widget-root');
  if (!container) {
    console.warn('[CRM Widget] No #crm-widget-root element found.');
    return;
  }

  // Read config from data attributes or global variables
  const apiBase  = container.dataset.apiBase  || window.__CRM_API_BASE__  || '';
  const token    = container.dataset.siteToken || window.__CRM_SITE_TOKEN__ || '';
  const title    = container.dataset.title    || '';
  const subtitle = container.dataset.subtitle || '';

  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <LeadCaptureWidget
        apiBase={apiBase}
        siteToken={token}
        title={title}
        subtitle={subtitle}
      />
    </React.StrictMode>
  );
}

// Mount immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
