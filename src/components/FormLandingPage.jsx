import {Navigate} from 'react-router-dom';

import useFormContext from 'hooks/useFormContext';
import useInitialDataReference from 'hooks/useInitialDataReference';

const FormLandingPage = () => {
  const {introductionPageContent = ''} = useFormContext();
  const {addInitialDataReference} = useInitialDataReference();
  const startPageUrl = introductionPageContent ? 'introductie' : 'startpagina';
  return <Navigate replace to={addInitialDataReference(startPageUrl)} />;
};

FormLandingPage.propTypes = {};

export default FormLandingPage;
