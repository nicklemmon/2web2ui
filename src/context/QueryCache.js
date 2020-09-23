import React from 'react';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { sparkpost as sparkpostRequest } from 'src/helpers/axiosInstances';

function defaultQuery(key, { method, token, headers }) {
  return sparkpostRequest({
    url: key,
    method,
    headers: {
      Authorization: token,
      ...headers,
    },
  }).then(res => res.data.results);
}

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
