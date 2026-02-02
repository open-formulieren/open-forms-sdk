import {
  type ParserMap,
  createSerializer,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';

import {AUTH_VISIBLE_QUERY_PARAM, INITIAL_DATA_PARAM} from '@/components/constants';

const AUTH_VISIBLE_QUERY_PARAMS = ['all', ''] as const;

export type AuthVisibleParam = (typeof AUTH_VISIBLE_QUERY_PARAMS)[number];

const searchParams: ParserMap = {
  [INITIAL_DATA_PARAM]: parseAsString,
  [AUTH_VISIBLE_QUERY_PARAM]: parseAsStringLiteral(AUTH_VISIBLE_QUERY_PARAMS),
};

export interface UsePreserveQueryParamsResult {
  preserveQueryParams: (url: string) => string;
}
/**
 * Hook that returns function that appends pre-defined query params to URLs.
 */
const useQueryParams = (): UsePreserveQueryParamsResult => {
  const [values] = useQueryStates(searchParams);

  const preserveQueryParams = (url: string): string => {
    // URL handling in JS requires a proper base since you can't just feed `foo` or `/foo`
    // to the constructor. We only extract the pathname + query string again at the end.
    const base = window.location.origin;
    const parsedUrl = new URL(url, base);

    const serialize = createSerializer(searchParams);
    const newSearch = serialize(parsedUrl.search, values);
    return `${parsedUrl.pathname}${newSearch}`;
  };

  return {preserveQueryParams};
};

export default useQueryParams;
