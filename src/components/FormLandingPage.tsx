import {Navigate} from 'react-router';

import useInitialDataReference from 'hooks/useInitialDataReference';

import useFormContext from '@/hooks/useFormContext';

const FormLandingPage: React.FC = () => {
  const {introductionPageContent = ''} = useFormContext();
  const {addInitialDataReference} = useInitialDataReference();
  const startPageUrl = introductionPageContent ? 'introductie' : 'startpagina';
  return <Navigate replace to={addInitialDataReference(startPageUrl)} />;
};

export default FormLandingPage;
