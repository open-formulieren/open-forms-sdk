import {useEffect, useRef} from 'react';
import {useLocation} from 'react-router-dom';

const isDev = process.env.NODE_ENV === 'development';

function usePrevious(value) {
  const ref = useRef({
    value: value,
    prev: null,
  });

  const current = ref.current.value;

  if (value !== current) {
    ref.current = {
      value: value,
      prev: current,
    };
  }

  return ref.current.prev;
}

const ANALYTICS_PROVIDERS = {
  debug: async location =>
    isDev && console.log(`Tracking navigation to ${window.location.origin}${location.pathname}`),
  gtag: async location => {
    return (
      window.gtag &&
      window.gtag('event', 'page_view', {
        page_location: location.href,
        page_path: location.pathname,
      })
    );
  },
  siteimprove: async (location, previousLocation) =>
    /* SiteImprove
    Docs: https://support.siteimprove.com/hc/en-gb/articles/115001615171-Siteimprove-Analytics-Custom-Visit-Tracking
    Note: siteimprove requires the full URL to track pages, not merely the path
    */
    window._sz &&
    window._sz.push([
      'trackdynamic',
      {
        url: window.location.origin + location.pathname + location.hash.substring(1),
        ref:
          previousLocation &&
          window.location.origin + previousLocation.pathname + previousLocation.hash.substring(1),
        title: document.title,
      },
    ]),
  // from: https://developer.matomo.org/guides/spa-tracking
  // alternatively: https://www.npmjs.com/package/@datapunt/matomo-tracker-react (from Amsterdam)
  matomoOrPiwik: async (location, previousLocation) => {
    /* Matomo, Piwik and Piwik PRO are all supported
    Matomo: https://developer.matomo.org/guides/spa-tracking
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
const trackPageView = (location, previousLocation) => {
  const promises = Object.values(ANALYTICS_PROVIDERS).map(callback =>
    callback(location, previousLocation)
  );
  Promise.all(promises).catch(error => {
    throw error;
  });
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
export {ANALYTICS_PROVIDERS};
// exporting makes it possible to plug in other providers that are not supported out of the box.
