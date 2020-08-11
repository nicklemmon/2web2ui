import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { PublicRoute, ProtectedRoute } from 'src/components/auth';
import defaultRoutes, { hibanaRoutes } from 'src/config/routes';
import { useHibana } from 'src/context/HibanaContext';
import qs from 'query-string';

export default () => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;
  const routes = isHibanaEnabled ? hibanaRoutes : defaultRoutes;

  return (
    <Switch>
      {routes.map(route => {
        const MyRoute = route.public ? PublicRoute : ProtectedRoute;

        route.exact = !(route.exact === false); // this makes exact default to true

        if (route.redirect) {
          return (
            <Route
              key={route.path}
              exact
              path={route.path}
              render={({ location }) => {
                const search = qs.stringify({
                  ...qs.parse(location.search),
                  ...qs.parse(route.search),
                });
                return <Redirect to={{ ...location, search, pathname: route.redirect }} />;
              }}
            />
          );
        }

        return <MyRoute key={route.path} {...route} />;
      })}
    </Switch>
  );
};
