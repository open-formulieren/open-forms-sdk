import {Navigate} from 'react-router';

import useFormContext from '@/hooks/useFormContext';
import useQueryParams from '@/hooks/useQueryParams';

const FormLandingPage: React.FC = () => {
  const {introductionPageContent = ''} = useFormContext();
  const {preserveQueryParams} = useQueryParams();
  const startPageUrl = introductionPageContent ? 'introductie' : 'startpagina';

  const targetUrl = preserveQueryParams(startPageUrl);
  return <Navigate replace to={targetUrl} />;
};

export default FormLandingPage;
