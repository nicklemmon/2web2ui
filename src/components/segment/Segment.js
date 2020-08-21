import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import getConfig from 'src/helpers/getConfig';
import { segmentPage } from 'src/helpers/segment';

const getScript = key => `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var t=analytics.methods[e];analytics[t]=analytics.factory(t)}analytics.load=function(e,t){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+e+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=t};analytics.SNIPPET_VERSION="4.1.0";
analytics.load("${key}");
}}();`;

export default () => {
  const enabled = getConfig('segment.enabled') || false;
  const history = useHistory();
  const prevPathname = useRef(history.location.pathname);

  useEffect(() => {
    const unlisten = history.listen(location => {
      if (enabled && prevPathname.current !== location.pathname) {
        prevPathname.current = location.pathname;
        segmentPage();
      }
    });
    return () => unlisten();
  }, [enabled, history]);

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
