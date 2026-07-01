const TELEMETRY_ENDPOINT = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/v1/telemetry` 
  : 'http://localhost:5000/v1/telemetry';

export const sendTelemetry = (eventType, data = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Telemetry] ${eventType}:`, data);
    return;
  }

  try {
    // Fire and forget beacon
    const payload = JSON.stringify({
      event: eventType,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      data
    });
    
    if (navigator.sendBeacon) {
      navigator.sendBeacon(TELEMETRY_ENDPOINT, payload);
    } else {
      fetch(TELEMETRY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(() => {});
    }
  } catch (err) {
    // Ignore telemetry errors
  }
};
