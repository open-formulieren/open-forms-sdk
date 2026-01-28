import {AUTH_VISIBLE_QUERY_PARAM} from '@/components/constants';
import type {UseQueryParamResult} from '@/hooks/useQueryParam';
import useQueryParam from '@/hooks/useQueryParam';

/**
 * Hook to extract the 'auth_visible' query param and append it to the URL.
 */
const useAuthVisible = (): UseQueryParamResult => useQueryParam(AUTH_VISIBLE_QUERY_PARAM);

export default useAuthVisible;
