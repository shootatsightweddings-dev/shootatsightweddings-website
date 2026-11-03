import { createContext, useContext } from 'react';

export const SiteConfigContext = createContext(null);

export const useSiteConfig = () => useContext(SiteConfigContext) || {
  config: null,
  loading: false,
  refreshConfig: () => {},
};
