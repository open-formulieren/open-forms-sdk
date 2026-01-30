import {Navigate} from 'react-router';

import {AUTH_VISIBLE_QUERY_PARAM, INITIAL_DATA_PARAM} from '@/components/constants';
import useFormContext from '@/hooks/useFormContext';
import useQueryParams from '@/hooks/useQueryParams';

const FormLandingPage: React.FC = () => {
  const {introductionPageContent = ''} = useFormContext();
  const {preserveQueryParams} = useQueryParams();
  const startPageUrl = introductionPageContent ? 'introductie' : 'startpagina';

  const targetUrl = preserveQueryParams(startPageUrl, [
    INITIAL_DATA_PARAM,
    AUTH_VISIBLE_QUERY_PARAM,
  ]);
  return <Navigate replace to={targetUrl} />;
};

export default FormLandingPage;
