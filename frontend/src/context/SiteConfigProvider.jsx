import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config';
import { SiteConfigContext } from './siteConfigState';

export const SiteConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(() => fetch(`${API_URL}/site-config`)
    .then(async (res) => {
      const data = await res.json();
      if (res.ok && data.success) setConfig(data.config);
    })
    .catch((err) => console.error('Failed to load site configurations:', err))
    .finally(() => setLoading(false)), []);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  return (
    <SiteConfigContext.Provider value={{ config, loading, refreshConfig: fetchConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
};
