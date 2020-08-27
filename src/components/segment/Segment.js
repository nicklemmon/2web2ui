import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import getConfig from 'src/helpers/getConfig';
import { segmentPage, TRAITS } from 'src/helpers/segment';
import { segmentIdentify } from 'src/helpers/segment';
import { usernameSelector } from 'src/selectors/currentUser';

const getScript = key => `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var t=analytics.methods[e];analytics[t]=analytics.factory(t)}analytics.load=function(e,t){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+e+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=t};analytics.SNIPPET_VERSION="4.1.0";
analytics.load("${key}");
}}();`;

export const Segment = props => {
  const enabled = getConfig('segment.enabled') || false;
  const history = useHistory();
  const prevPathname = useRef(history.location.pathname);

  // dispatch is passed by connect, but we want the rest of the props as traits
  const { dispatch, ...traits } = props;

  // On URL path changes, inform segment via "PAGE" event
  useEffect(() => {
    const unlisten = history.listen(location => {
      if (enabled && prevPathname.current !== location.pathname) {
        prevPathname.current = location.pathname;
        segmentPage();
      }
    });
    return () => unlisten();
  }, [enabled, history]);

  // Any time a trait changes, inform segment via "IDENTIFY" event
  useEffect(() => {
    segmentIdentify({
      ...Object.values(TRAITS).reduce((allTraits, current) => {
        if (traits[current]) {
          allTraits[current] = traits[current];
        }
        return allTraits;
      }, {}),
      tenant: getConfig('tenantId'),
    });
  }, [traits]);

  if (enabled) {
    const key = getConfig('segment.publicKey');
    if (key) {
      return (
        <Helmet>
          <script type="text/javascript">{getScript(key)}</script>
        </Helmet>
      );
    }
  }

  return null;
};

const mapStateToProps = state => ({
  [TRAITS.USER_ID]: usernameSelector(state),
  [TRAITS.EMAIL]: state.currentUser.email,
  [TRAITS.CREATED_AT]: state.currentUser.created,
  [TRAITS.SERVICE_LEVEL]: state.account.service_level,
  [TRAITS.PLAN]: state.account?.subscription?.code,
  [TRAITS.USER_ROLE]: state.currentUser.access_level,
  [TRAITS.COMPANY]: state.account.company_name,
  [TRAITS.FIRST_NAME]: state.currentUser.first_name,
  [TRAITS.LAST_NAME]: state.currentUser.last_name,
});

export default connect(mapStateToProps)(Segment);
