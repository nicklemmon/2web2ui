import React, { createContext } from 'react';

const DashboardContext = createContext();

export function DashboardContextProvider({ value, children }) {
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export default DashboardContext;
