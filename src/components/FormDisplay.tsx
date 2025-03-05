import {useContext} from 'react';

import {ConfigContext} from 'Context';
import AppDebug from 'components/AppDebug';
import {AppDisplay} from 'components/AppDisplay';
import LanguageSwitcher from 'components/LanguageSwitcher';
import useFormContext from 'hooks/useFormContext';

export interface FormDisplayProps {
  /**
   * Main content.
   */
  children?: React.ReactNode;
  progressIndicator?: React.ReactNode;
  /**
   * @deprecated
   */
  router?: React.ReactNode;
}

/**
 * Layout component to render the form container.
 *
 * Takes in the main body and (optional) progress indicator and forwards them to the
 * AppDisplay component, while adding in any global/skeleton nodes.
 */
const FormDisplay: React.FC<FormDisplayProps> = ({
  children = null,
  progressIndicator = null,
  router = null,
}) => {
  const {translationEnabled} = useFormContext();
  const config = useContext(ConfigContext);

  const appDebug = config.debug ? <AppDebug /> : null;
  const languageSwitcher = translationEnabled ? <LanguageSwitcher /> : null;

  return (
    <AppDisplay
      languageSwitcher={languageSwitcher}
      progressIndicator={progressIndicator}
      appDebug={appDebug}
    >
      {children || router}
    </AppDisplay>
  );
};

export default FormDisplay;
