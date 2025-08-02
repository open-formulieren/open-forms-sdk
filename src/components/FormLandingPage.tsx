import {Navigate} from 'react-router';

import useFormContext from '@/hooks/useFormContext';
import useInitialDataReference from '@/hooks/useInitialDataReference';

const FormLandingPage: React.FC = () => {
  const {introductionPageContent = ''} = useFormContext();
  const {addInitialDataReference} = useInitialDataReference();
  const startPageUrl = introductionPageContent ? 'introductie' : 'startpagina';
  return <Navigate replace to={addInitialDataReference(startPageUrl)} />;
};

export default FormLandingPage;
