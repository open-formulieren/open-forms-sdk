import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';
import {useSearchParams} from 'react-router';

import ErrorMessage from 'components/Errors/ErrorMessage';

const MAPPING_PARAMS_SERVICE = {
  '_digid-message': 'DigiD',
  '_eherkenning-message': 'EHerkenning',
  '_eidas-message': 'eIDAS',
  '_yivi-message': 'Yivi',
};

const CANCEL_LOGIN_PARAM = 'login-cancelled';

const useDetectAuthErrorMessages = () => {
  const [params] = useSearchParams();

  let parameters = {};

  for (const [key, value] of params.entries()) {
    if (key in MAPPING_PARAMS_SERVICE) {
      parameters[key] = value;
      return parameters;
    }
  }
};

const AuthenticationErrors = ({parameters}) => {
  const intl = useIntl();

  let messagesToDisplay = [];

  for (const [parameter, message] of Object.entries(parameters)) {
    const service = MAPPING_PARAMS_SERVICE[parameter];
    switch (message) {
      case CANCEL_LOGIN_PARAM: {
        messagesToDisplay.push(
          intl.formatMessage(
            {
              description: 'DigiD/EHerkenning cancellation message. MUST BE THIS EXACT STRING!',
              defaultMessage: 'Je hebt het inloggen met {service} geannuleerd.',
            },
            {service: service}
          )
        );
        break;
      }
      default: {
        let errorMessage;
        switch (parameter) {
          case '_digid-message': {
            errorMessage = intl.formatMessage({
              description: 'DigiD error message. MUST BE THIS EXACT STRING!',
              defaultMessage: `
                  Inloggen bij deze organisatie is niet gelukt. Probeert u het later
                  nog een keer. Lukt het nog steeds niet? Log in bij Mijn DigiD. Zo
                  controleert u of uw DigiD goed werkt. Mogelijk is er een storing bij
                  de organisatie waar u inlogt.
                `,
            });
            break;
          }
          default:
            errorMessage = intl.formatMessage(
              {
                description: 'Auth error message',
                defaultMessage:
                  'Er is een fout opgetreden bij het inloggen met {service}. Probeer het later opnieuw.',
              },
              {service: service}
            );
        }
        messagesToDisplay.push(errorMessage);
        break;
      }
    }
  }

  return (
    <div className="openforms-authentication-errors">
      <ErrorMessage level="error">{messagesToDisplay[0]}</ErrorMessage>
    </div>
  );
};

AuthenticationErrors.propTypes = {
  parameters: PropTypes.object.isRequired,
};

export {MAPPING_PARAMS_SERVICE, CANCEL_LOGIN_PARAM};
export {AuthenticationErrors, useDetectAuthErrorMessages};
