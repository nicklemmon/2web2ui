import React, { createContext } from 'react';

export const DomainsContext = createContext();
DomainsContext.displayName = 'DomainsContext';

export function DomainsProvider({ value, children }) {
  return <DomainsContext.Provider value={value}>{children}</DomainsContext.Provider>;
}
