import {lazy} from 'react';

import useFormContext from '@/hooks/useFormContext';

const LegacyFormStep = lazy(() => import('./index.jsx'));
const NewFormStep = lazy(() => import('./FormStepNewRenderer'));

/**
 * Check the form feature flag and render either the legacy Formio.js-backed form step,
 * or use our own new renderer (experimental!).
 */
const FormStepWrapper: React.FC = () => {
  const {newRendererEnabled} = useFormContext();
  if (newRendererEnabled) {
    return <NewFormStep />;
  }
  return <LegacyFormStep />;
};

export default FormStepWrapper;
