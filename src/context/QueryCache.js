import React from 'react';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';

const queryCache = new QueryCache();

export function QueryCacheProvider({ children }) {
  return <ReactQueryCacheProvider queryCache={queryCache}>{children}</ReactQueryCacheProvider>;
}
