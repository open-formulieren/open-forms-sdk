import {useSearchParams} from 'react-router-dom';

const useQuery = () => {
  const [searchParams] = useSearchParams();
  return searchParams;
};

export default useQuery;
