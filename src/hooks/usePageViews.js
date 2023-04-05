import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {usePrevious} from 'react-use';

const isDev = process.env.NODE_ENV === 'development';

const ANALYTICS_PROVIDERS = {
  debug: async location =>
    isDev && console.log(`Tracking navigation to ${location.pathname}${location.hash}`),
  gtag: async location => {
    /* Google Analytics
    Hashrouting support: https://support.google.com/analytics/thread/20971249/track-hashtag-in-url-but-after-site-was-loaded
    */
    return (
      window.gtag &&
      window.gtag('event', 'page_view', {
        page_location: location.href,
        page_path: location.pathname + location.hash,
      })
    );
  },
  siteimprove: async (location, previousLocation) =>
    /* SiteImprove
    Docs: https://support.siteimprove.com/hc/en-gb/articles/115001615171-Siteimprove-Analytics-Custom-Visit-Tracking
    Unsure if SiteImprove subscribes to URL changes or not, if they do - we'll fire double events here.
    Hashrouting support: Unknown, so we follow the same concept as Matomo by pretending there is no hash.
    */
    window._sz &&
    window._sz.push([
      'trackdynamic',
      {
        url: location.pathname + location.hash.substring(1),
        ref:
          (previousLocation && previousLocation.pathname + previousLocation.hash.substring(1)) ||
          window.location.pathname + window.location.hash.substring(1),
        title: document.title,
      },
    ]),
  matomoOrPiwik: async (location, previousLocation) => {
    /* Matomo, Piwik and Piwik PRO are all supported
    Matomo: https://matomo.org/docs/guides/spa-tracking/
    Piwik: https://piwik.org/docs/tracking-javascript-guide/
    Piwik PRO: https://developers.piwik.pro/en/latest/data_collection/web/guides.html
    Hashrouting support: https://developer.matomo.org/guides/spa-tracking / alternatively: https://www.npmjs.com/package/@datapunt/matomo-tracker-react (from Amsterdam)
    */
    if (!window._paq) return;
    window._paq.push(['setCustomUrl', location.pathname + location.hash.substring(1)]);
    window._paq.push(['setDocumentTitle', document.title]);
    if (previousLocation)
      window._paq.push([
        'setReferrerUrl',
        previousLocation.pathname + previousLocation.hash.substring(1),
      ]);
    window._paq.push(['trackPageView']);
  },
};

/**
 * We assume that the provider has been included already in the global scope of the
 * containing page where the SDK is embedded.
 */
const trackPageView = location => {
  const promises = Object.values(ANALYTICS_PROVIDERS).map(callback => callback(location));
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
    if (
      previousLocation &&
      previousLocation.pathname === location.pathname &&
      previousLocation.hash === location.hash
    )
      return;
    trackPageView(location, previousLocation);
  }, [location, previousLocation]);
};

export default usePageViews;
export {ANALYTICS_PROVIDERS};
// exporting makes it possible to plug in other providers that are not supported out of
// the box.
