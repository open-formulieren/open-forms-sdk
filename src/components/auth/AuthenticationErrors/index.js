import React from 'react';
import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';

import ErrorMessage from 'components/ErrorMessage';
import useQuery from 'hooks/useQuery';

const MAPPING_PARAMS_SERVICE = {
  '_digid-message': 'DigiD',
  '_eherkenning-message': 'EHerkenning',
  '_eidas-message': 'eIDAS',
};

const CANCEL_LOGIN_PARAM = 'login-cancelled';

const useDetectAuthErrorMessages = () => {
  const query = useQuery();

  let parameters = {};

  for (const [key, value] of query.entries()) {
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
      default:
        let errorMessage;
        switch (parameter) {
          case '_digid-message': {
            errorMessage = intl.formatMessage({
              description: 'DigiD error message. MUST BE THIS EXACT STRING!',
              defaultMessage: `
                  Er is een fout opgetreden in de communicatie met DigiD.
                  Probeert u het later nogmaals. Indien deze fout blijft aanhouden, kijk
                  dan op de website https://www.digid.nl voor de laatste informatie.
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

  return <ErrorMessage modifiers={['error', 'with-margin']}>{messagesToDisplay[0]}</ErrorMessage>;
};

AuthenticationErrors.propTypes = {
  parameters: PropTypes.object.isRequired,
};

export {AuthenticationErrors, useDetectAuthErrorMessages};
