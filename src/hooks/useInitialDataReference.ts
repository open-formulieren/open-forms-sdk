import {useSearchParams} from 'react-router';

export const PARAM_NAME = 'initial_data_reference';

export interface UseInitialDataReferenceResult {
  initialDataReference: string | null;
  addInitialDataReference: (url: string) => string;
}

/**
 * Hook to extract the initial data reference and callback to append the parameter to
 * (new) URLs.
 */
const useInitialDataReference = (): UseInitialDataReferenceResult => {
  const [searchParams] = useSearchParams();
  const initialDataReference: string | null = searchParams?.get(PARAM_NAME);

  return {
    initialDataReference,
    addInitialDataReference: (url: string) =>
      setInitialDataReferenceParameter(url, initialDataReference),
  };
};

/**
 * Set (or remove) the initial data reference parameter on the (relative) URL.
 * @param  url       The (relative) path, as you would pass it to react router.
 * @param  reference The initial data reference. If empty, the parameter will be removed.
 */
const setInitialDataReferenceParameter = (url: string, reference: string | null): string => {
  // URL handling in JS requires a proper base since you can't just feed `foo` or `/foo`
  // to the constructor. We only extract the pathname + query string again at the end.
  const base = window.location.origin;
  const parsedUrl = new URL(url, base);
  if (reference) {
    parsedUrl.searchParams.set(PARAM_NAME, reference);
  } else {
    parsedUrl.searchParams.delete(PARAM_NAME);
  }
  return `${parsedUrl.pathname}${parsedUrl.search}`;
};

export default useInitialDataReference;
