import React from 'react';
import _ from 'lodash';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { defaultQuery } from 'src/helpers/api';

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      queryFn: defaultQuery,
    },
  },
});

export function QueryCacheProvider({ children }) {
  return <ReactQueryCacheProvider queryCache={queryCache}>{children}</ReactQueryCacheProvider>;
}
