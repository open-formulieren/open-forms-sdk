import {Navigate} from 'react-router';

import useFormContext from '@/hooks/useFormContext';
import useQueryParams from '@/hooks/useQueryParams';

const FormLandingPage: React.FC = () => {
  const {
    introductionPageContent = '',
    type,
    helpCalloutPageContent,
    helpCalloutPageDisplay,
  } = useFormContext();
  const {preserveQueryParams} = useQueryParams();

  let startPageUrl: string;
  if (type === 'single_step') startPageUrl = 'sp';
  else if (introductionPageContent) startPageUrl = 'introductie';
  else if (helpCalloutPageContent && helpCalloutPageDisplay === 'before_start_page')
    startPageUrl = 'hulp';
  else startPageUrl = 'startpagina';

  const targetUrl = preserveQueryParams(startPageUrl);
  return <Navigate replace to={targetUrl} />;
};

export default FormLandingPage;
