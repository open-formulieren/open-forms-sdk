import {useSearchParams} from 'react-router';

export interface UseQueryParamResult {
  value: string | null;
  addToUrl: (url: string) => string;
}

/**
 * Generic hook to extract a query parameter and provide a callback to append it to URLs.
 * @param param The name of the query parameter to track
 */
const useQueryParam = (param: string): UseQueryParamResult => {
  const [searchParams] = useSearchParams();
  const value = searchParams?.get(param);

  return {
    value,
    addToUrl: (url: string) => setQueryParameter(url, param, value),
  };
};

/**
 * Set (or remove) a query parameter on the (relative) URL.
 * @param url       The (relative) path, as you would pass it to react router.
 * @param param     The name of the query parameter.
 * @param value     The parameter value. If empty, the parameter will be removed.
 */
export const setQueryParameter = (url: string, param: string, value: string | null): string => {
  // URL handling in JS requires a proper base since you can't just feed `foo` or `/foo`
  // to the constructor. We only extract the pathname + query string again at the end.
  const base = window.location.origin;
  const parsedUrl = new URL(url, base);
  if (value) {
    parsedUrl.searchParams.set(param, value);
  } else {
    parsedUrl.searchParams.delete(param);
  }
  return `${parsedUrl.pathname}${parsedUrl.search}`;
};

export default useQueryParam;
