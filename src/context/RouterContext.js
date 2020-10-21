import React, { createContext, useMemo, useCallback } from 'react';
import { withRouter } from 'react-router';
import qs from 'qs';

// see, https://github.com/ReactTraining/react-router/issues/6430
// note, maintainers do not recommend using __RouterContext from react-router
const RouterContext = createContext();

export const ProviderComponent = ({ children, ...routerProps }) => {
  const value = useMemo(
    () => ({
      ...routerProps,
      requestParams: {
        // merge path and querystring params together
        ...qs.parse(routerProps.location.search, { ignoreQueryPrefix: true }),
        ...routerProps.match.params,
      },
    }),
    [routerProps],
  );

  const updateRoute = useCallback(
    newParams => {
      const queryString = qs.stringify(newParams, { arrayFormat: 'repeat' });
      routerProps.history.push(`${routerProps.location.pathname}?${queryString}`);
    },
    [routerProps.history, routerProps.location.pathname],
  );

  return (
    <RouterContext.Provider value={{ ...value, updateRoute }}>{children}</RouterContext.Provider>
  );
};

export const RouterContextProvider = withRouter(ProviderComponent);
export default RouterContext;
