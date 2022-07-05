import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import usePrevious from 'react-use/esm/usePrevious';

const isDev = process.env.NODE_ENV === 'development';

const ANALYTICS_PROVIDERS = {
  debug: async (location) => (isDev && console.log(`Tracking navigation to ${location.pathname}`)),
  googleAnalytics: async (location) => (window.ga && window.ga.send(['pageview', location.pathname])),
  // https://support.siteimprove.com/hc/en-gb/articles/115001615171-Siteimprove-Analytics-Custom-Visit-Tracking
  // unsure if SiteImprove subscribes to URL changes or not, if they do - we'll fire double events here.
  siteimprove: async (location, previousLocation) => (window._sz && window._sz.push(['trackdynamic', {
    url: location.pathname,
    ref: (previousLocation && previousLocation.pathname) || window.location.pathname,
    title: document.title,
  }])),
  // from: https://developer.matomo.org/guides/spa-tracking
  // alternatively: https://www.npmjs.com/package/@datapunt/matomo-tracker-react (from Amsterdam)
  matomoOrPiwik: async (location, previousLocation) => {
    /* Matomo, Piwik and Piwik PRO are all supported
    Matomo: https://matomo.org/docs/guides/spa-tracking/
    Piwik: https://piwik.org/docs/tracking-javascript-guide/
    Piwik PRO: https://developers.piwik.pro/en/latest/data_collection/web/guides.html
     */
    if (!window._paq) return;
    window._paq.push(['setCustomUrl', location.pathname]);
    window._paq.push(['setDocumentTitle', document.title]);
    if (previousLocation) window._paq.push(['setReferrerUrl', previousLocation.pathname]);
    window._paq.push(['trackPageView']);
  },
};


/**
 * We assume that the provider has been included already in the global scope of the
 * containing page where the SDK is embedded.
 */
const trackPageView = (location) => {
  const promises = Object.values(ANALYTICS_PROVIDERS).map(callback => callback(location));
  Promise.all(promises)
  .catch(error => {throw error});
};


/**
 * Ensure that the current page view is sent to the (supported) analytics tool(s).
 * @return {Void}
 */
const usePageViews = async () => {
  const location = useLocation();
  const previousLocation = usePrevious(location);
  useEffect(() => {
    // if there's no change, do nothing
    if (previousLocation && previousLocation.pathname === location.pathname) return;
    trackPageView(location, previousLocation);
  }, [location, previousLocation]);
};

export default usePageViews;
export { ANALYTICS_PROVIDERS };
// exporting makes it possible to plug in other providers that are not supported out of
// the box.
