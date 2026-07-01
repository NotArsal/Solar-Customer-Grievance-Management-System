import { useState, useEffect } from 'react';

// Hardcoded for now, but usually fetched from an API endpoint or LaunchDarkly
const LOCAL_FLAGS = {
  enableNewDashboard: false,
  enableAdvancedReporting: false,
  enableTelemetry: true
};

export const useFeatureFlag = (flagName) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    const fetchFlag = async () => {
      try {
        // In a real app, you would fetch from your backend here
        // const response = await fetch('/api/flags');
        // const flags = await response.json();
        const flags = LOCAL_FLAGS;
        
        // Check for URL overrides (e.g., ?ff_enableNewDashboard=true)
        const params = new URLSearchParams(window.location.search);
        const urlOverride = params.get(`ff_${flagName}`);
        
        if (urlOverride !== null) {
          setIsEnabled(urlOverride === 'true');
        } else {
          setIsEnabled(!!flags[flagName]);
        }
      } catch (err) {
        console.error('Failed to fetch feature flags:', err);
        setIsEnabled(false);
      } finally {
        setLoading(false);
      }
    };

    fetchFlag();
  }, [flagName]);

  return { isEnabled, loading };
};
