import React from 'react';
import { Helmet } from 'react-helmet';
import getConfig from 'src/helpers/getConfig';
import SegmentIdentify from './SegmentIdentify';
import SegmentPage from './SegmentPage';

const getScript = key => `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var t=analytics.methods[e];analytics[t]=analytics.factory(t)}analytics.load=function(e,t){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+e+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=t};analytics.SNIPPET_VERSION="4.1.0";
analytics.load("${key}");
}}();`;

export const Segment = () => {
  const enabled = getConfig('segment.enabled') || false;

  if (enabled) {
    const key = getConfig('segment.publicKey');
    if (key) {
      return (
        <>
          <Helmet>
            <script type="text/javascript">{getScript(key)}</script>
          </Helmet>
          <SegmentIdentify />
          <SegmentPage />
        </>
      );
    }
  }

  return null;
};

export default Segment;
