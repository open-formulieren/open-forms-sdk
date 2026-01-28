import {Navigate} from 'react-router';

import useAuthVisible from '@/hooks/useAuthVisible';
import useFormContext from '@/hooks/useFormContext';
import useInitialDataReference from '@/hooks/useInitialDataReference';

const FormLandingPage: React.FC = () => {
  const {introductionPageContent = ''} = useFormContext();
  const {addInitialDataReference} = useInitialDataReference();
  const {addToUrl: addAuthVisible} = useAuthVisible();
  const startPageUrl = introductionPageContent ? 'introductie' : 'startpagina';

  const targetUrl = addAuthVisible(addInitialDataReference(startPageUrl));
  return <Navigate replace to={targetUrl} />;
};

export default FormLandingPage;
