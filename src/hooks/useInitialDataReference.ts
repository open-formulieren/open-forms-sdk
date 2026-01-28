import useQueryParam from '@/hooks/useQueryParam';

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
  const {value, addToUrl} = useQueryParam(PARAM_NAME);

  return {
    initialDataReference: value,
    addInitialDataReference: addToUrl,
  };
};

export default useInitialDataReference;
