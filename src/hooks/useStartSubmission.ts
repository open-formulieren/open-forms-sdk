import {useSearchParams} from 'react-router';

import {START_FORM_QUERY_PARAM} from '@/components/constants';

const useStartSubmission = (): boolean => {
  const [params] = useSearchParams();
  return !!params.get(START_FORM_QUERY_PARAM);
};

export default useStartSubmission;
