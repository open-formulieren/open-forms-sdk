import useQuery from './useQuery';
import {START_FORM_QUERY_PARAM} from 'components/constants';

const useStartSubmission = () => {
  const query = useQuery();
  return !!query.get(START_FORM_QUERY_PARAM);
};

export default useStartSubmission;
