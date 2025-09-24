import type {IntlShape} from 'react-intl';
import {useIntl} from 'react-intl';
import {useSearchParams} from 'react-router';

import ErrorMessage from '@/components/Errors/ErrorMessage';

import type {AuthErrorCode, MessageParamName} from './constants';
import {MAPPING_PARAMS_SERVICE} from './constants';

/**
 * Check if there are any authentication error parameters in the query string and
 * return them.
 *
 * As soon as one of the candidates is found, it is returned, as they are mutually
 * exclusive.
 */
const useDetectAuthErrorMessage = (): [MessageParamName, AuthErrorCode] | undefined => {
  const [params] = useSearchParams();
  for (const [key] of MAPPING_PARAMS_SERVICE) {
    const errorCode = params.get(key);
    if (errorCode) return [key, errorCode as AuthErrorCode];
  }
  return undefined;
};

export interface AuthenticationErrorProps {
  parameter: MessageParamName;
  errorCode: AuthErrorCode;
}

/**
 * Display the appropriate error message for the given failing backend and error code.
 *
 * Since the backends are mutually exclusive, there can only ever be one message displayed
 * at a time.
 */
const AuthenticationError: React.FC<AuthenticationErrorProps> = ({parameter, errorCode}) => {
  const intl = useIntl();
  const message = getErrorMessage(intl, parameter, errorCode);
  return (
    <div className="openforms-authentication-errors">
      <ErrorMessage level="error">{message}</ErrorMessage>
    </div>
  );
};

const getErrorMessage = (
  intl: IntlShape,
  parameter: MessageParamName,
  errorCode: AuthErrorCode
): string => {
  const service = Object.fromEntries(MAPPING_PARAMS_SERVICE)[parameter];

  switch (errorCode) {
    case 'login-cancelled': {
      return intl.formatMessage(
        {
          description: 'DigiD/EHerkenning cancellation message. MUST BE THIS EXACT STRING!',
          defaultMessage: 'Je hebt het inloggen met {service} geannuleerd.',
        },
        {service: service}
      );
    }
  }

  // otherwise, look at the service itself to return the appropriate message
  switch (parameter) {
    case '_digid-message': {
      return intl.formatMessage({
        description: 'DigiD error message. MUST BE THIS EXACT STRING!',
        defaultMessage: `
            Inloggen bij deze organisatie is niet gelukt. Probeert u het later
            nog een keer. Lukt het nog steeds niet? Log in bij Mijn DigiD. Zo
            controleert u of uw DigiD goed werkt. Mogelijk is er een storing bij
            de organisatie waar u inlogt.
          `,
      });
    }
    default:
      return intl.formatMessage(
        {
          description: 'Auth error message',
          defaultMessage:
            'Er is een fout opgetreden bij het inloggen met {service}. Probeer het later opnieuw.',
        },
        {service: service}
      );
  }
};

export {useDetectAuthErrorMessage};
export default AuthenticationError;
