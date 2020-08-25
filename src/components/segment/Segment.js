import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import getConfig from 'src/helpers/getConfig';
import { segmentPage } from 'src/helpers/segment';
import { segmentIdentify } from 'src/helpers/segment';
import { usernameSelector } from 'src/selectors/currentUser';

const getScript = key => `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var t=analytics.methods[e];analytics[t]=analytics.factory(t)}analytics.load=function(e,t){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+e+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=t};analytics.SNIPPET_VERSION="4.1.0";
analytics.load("${key}");
}}();`;

const Segment = props => {
  const enabled = getConfig('segment.enabled') || false;
  const history = useHistory();
  const prevPathname = useRef(history.location.pathname);

  useEffect(() => {
    const unlisten = history.listen(location => {
      if (enabled && prevPathname.current !== location.pathname) {
        prevPathname.current = location.pathname;
        segmentPage();
        segmentIdentify(props.identity.user_id, props.identity);
      }
    });
    return () => unlisten();
  }, [enabled, history, props.identity]);

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
  identity: {
    user_id: usernameSelector(state),
    email: state.currentUser.email,
    createdAt: state.currentUser.created,
    service_level: state.account.service_level,
    plan: state.account.subscription.code,
    user_role: state.currentUser.access_level,
    company: state.account.company_name,
    first_name: state.currentUser.first_name,
    last_name: state.currentUser.last_name,
  },
});

export default connect(mapStateToProps)(Segment);
