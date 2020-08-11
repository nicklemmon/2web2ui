import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ScreenReaderOnly } from 'src/components/matchbox';
import Form from './Form';
import findRouteByPath from 'src/helpers/findRouteByPath';
import { Helmet } from 'react-helmet';
import { selectRoutes } from 'src/selectors/routes';

/**
 * Returns layout component from routes config
 */
export const Layout = ({ children, location, routes }) => {
  const route = findRouteByPath(location.pathname, undefined, routes);
  const LayoutComponent = route.layout || Form;

  return (
    <LayoutComponent>
      {route.title && (
        <>
          {/* `defer` solves issue with <title> not updating when a new tab is opened: https://github.com/nfl/react-helmet/issues/315 */}
          <Helmet defer={false}>
            <title>{route.title} | SparkPost</title>
          </Helmet>

          {/*
            Screen reader only ARIA live region to help inform users of a route change.
            See: https://www.gatsbyjs.org/blog/2019-07-11-user-testing-accessible-client-routing/
            and
            https://www.gatsbyjs.org/blog/2020-02-10-accessible-client-side-routing-improvements/
          */}
          <ScreenReaderOnly>
            <div aria-live="assertive" aria-atomic="true">
              {route.title}
            </div>
          </ScreenReaderOnly>
        </>
      )}

      {children}
    </LayoutComponent>
  );
};

export default withRouter(
  connect(state => ({
    routes: selectRoutes(state),
  }))(Layout),
);
