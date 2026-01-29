import {Navigate} from 'react-router';

import {AUTH_VISIBLE_QUERY_PARAM} from '@/components/constants';
import useFormContext from '@/hooks/useFormContext';
import useInitialDataReference from '@/hooks/useInitialDataReference';
import useQueryParam from '@/hooks/useQueryParam';

const FormLandingPage: React.FC = () => {
  const {introductionPageContent = ''} = useFormContext();
  const {addInitialDataReference} = useInitialDataReference();
  const {addToUrl: addAuthVisible} = useQueryParam(AUTH_VISIBLE_QUERY_PARAM);
  const startPageUrl = introductionPageContent ? 'introductie' : 'startpagina';

  const targetUrl = addAuthVisible(addInitialDataReference(startPageUrl));
  return <Navigate replace to={targetUrl} />;
};

export default FormLandingPage;
