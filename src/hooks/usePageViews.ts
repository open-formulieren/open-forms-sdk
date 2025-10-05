import {useContext, useEffect, useRef} from 'react';
import {useLocation} from 'react-router';
import type {Location} from 'react-router';

import {ConfigContext} from '@/Context';
import {DEBUG} from '@/utils';

declare global {
  interface Window {
    gtag?: (ev: 'event', event: string, opts: object) => void;
    _sz?: Array<['trackdynamic', object]>;
    _paq?: Array<[string, string?]>;
  }
}

export type AnayticsProvider = (location: Location, previousLocation: Location | null) => void;

const ANALYTICS_PROVIDERS: Record<string, AnayticsProvider> = {
  debug: async location =>
    DEBUG &&
    console.log(
      `Tracking navigation to ${window.location.origin + location.pathname}${location.hash}`
    ),
  gtag: async location => {
    /* Google Analytics
    Hashrouting support: https://support.google.com/analytics/thread/20971249/track-hashtag-in-url-but-after-site-was-loaded
    */
    return (
      window.gtag &&
      window.gtag('event', 'page_view', {
        page_location: window.location.href,
        page_path: location.pathname + location.hash,
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
  matomoOrPiwik: async (location, previousLocation) => {
    /* Matomo, Piwik and Piwik PRO are all supported
    Matomo: https://developer.matomo.org/guides/spa-tracking
    Piwik: https://piwik.org/docs/tracking-javascript-guide/
    Piwik PRO: https://developers.piwik.pro/en/latest/data_collection/web/guides.html
    Hashrouting support: https://developer.matomo.org/guides/spa-tracking / alternatively: https://www.npmjs.com/package/@datapunt/matomo-tracker-react (from Amsterdam)
    */
    if (!window._paq) return;
    window._paq.push(['setCustomUrl', location.pathname + location.hash.substring(1)]);
    window._paq.push(['setDocumentTitle', document.title]);
    if (previousLocation)
      // Piwik Pro seems to add the origin automatically if only a path is provided to the
      // setCustomUrl, but not to the setReferrerUrl.
      window._paq.push([
        'setReferrerUrl',
        window.location.origin + previousLocation.pathname + previousLocation.hash.substring(1),
      ]);
    window._paq.push(['trackPageView']);
  },
};

/**
 * We assume that the provider has been included already in the global scope of the
 * containing page where the SDK is embedded.
 */
const trackPageView = (location: Location, previousLocation: Location | null) => {
  const promises = Object.values(ANALYTICS_PROVIDERS).map(callback =>
    callback(location, previousLocation)
  );
  Promise.all(promises).catch(error => {
    throw error;
  });
};

/**
 * Ensure that the current page view is sent to the (supported) analytics tool(s).
 */
const usePageViews = (): void => {
  const {basePath} = useContext(ConfigContext);
  const location = useLocation();

  // at some point, react-use/usePrevious was used which updates in a useEffect, and this
  // was changed into immediate ref-update-during render. Now, the React (18+) docs warn
  // against this, as it can produce unexpected side-effects with concurrent rendering.
  // TODO: clean this up and avoid reading/writing mutable refs during render.
  const previousLocationRef = useRef<Location | null>(null);
  const previousLocation = previousLocationRef.current;
  if (location !== previousLocation) {
    previousLocationRef.current = location;
  }

  useEffect(() => {
    // if there's no change, do nothing
    if (
      previousLocation &&
      previousLocation.pathname === location.pathname &&
      previousLocation.hash === location.hash
    )
      return;
    const fullPath = `${basePath}${location.pathname}`;
    trackPageView(
      {...location, pathname: fullPath},
      previousLocation && {...previousLocation, pathname: `${basePath}${previousLocation.pathname}`}
    );
  }, [basePath, location, previousLocation]);
};

export default usePageViews;
export {ANALYTICS_PROVIDERS};
// exporting makes it possible to plug in other providers that are not supported out of the box.
