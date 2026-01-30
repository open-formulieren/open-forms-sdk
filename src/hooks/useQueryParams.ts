import {
  type ParserMap,
  createSerializer,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';

import {AUTH_VISIBLE_QUERY_PARAM, INITIAL_DATA_PARAM} from '@/components/constants';

const searchParams: ParserMap = {
  [INITIAL_DATA_PARAM]: parseAsString,
  [AUTH_VISIBLE_QUERY_PARAM]: parseAsStringLiteral(['all', '']),
};

type PersistentParam = keyof typeof searchParams;

export interface UsePreserveQueryParamsResult {
  preserveQueryParams: (url: string, params: PersistentParam[]) => string;
}
/**
 * Hook that returns functions to extract query parameters and append them to URLs.
 */
const useQueryParams = (): UsePreserveQueryParamsResult => {
  const [values] = useQueryStates(searchParams);

  const preserve = (url: string, params: PersistentParam[]): string => {
    const filteredParsers = params.reduce(
      (acc, param) => ({...acc, [param]: searchParams[param]}),
      {}
    );

    const filteredValues = params.reduce((acc, param) => ({...acc, [param]: values[param]}), {});

    // URL handling in JS requires a proper base since you can't just feed `foo` or `/foo`
    // to the constructor. We only extract the pathname + query string again at the end.
    const base = window.location.origin;
    const parsedUrl = new URL(url, base);

    const serialize = createSerializer(filteredParsers);
    const newSearch = serialize(parsedUrl.search, filteredValues);
    return `${parsedUrl.pathname}${newSearch}`;
  };

  return {preserveQueryParams: preserve};
};

export default useQueryParams;
