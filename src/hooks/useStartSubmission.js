import {START_FORM_QUERY_PARAM} from 'components/constants';

import useQuery from './useQuery';

const useStartSubmission = () => {
  const query = useQuery();
  return !!query.get(START_FORM_QUERY_PARAM);
};

export default useStartSubmission;
