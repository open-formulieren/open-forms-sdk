import React from 'react';
import PropTypes from 'prop-types';

import FAIcon from 'components/FAIcon';
import Body from 'components/Body';
import useQuery from 'hooks/useQuery';
import {getBEMClassName} from 'utils';

const DIGID_AUTH_PARAM = '_digid-message';
const DIGID_CANCEL_LOGIN_PARAM = 'login-cancelled';


const useDetectDigidErrorMessages = () => {
  const query = useQuery();
  return query.get(DIGID_AUTH_PARAM);
};


const DigidAuthenticationErrors = ({digidMessage}) => {
  var message = '';

  switch (digidMessage) {
    case DIGID_CANCEL_LOGIN_PARAM: {
      message = 'Je hebt het inloggen met DigiD geannuleerd.';
      break;
    }
    default:
      message = 'Er is een fout opgetreden bij het inloggen met DigiD. Probeer het later opnieuw.';
      break;
  }

  return (
    <div className={getBEMClassName('alert', ['error', 'with-margin'])}>
      <span className={getBEMClassName('alert__icon', ['wide'])}>
        <FAIcon icon="exclamation-circle" />
      </span>
      <Body>
        {message}
      </Body>
    </div>
  );
};

DigidAuthenticationErrors.propTypes = {
  digidMessage: PropTypes.string.isRequired,
}

export {DigidAuthenticationErrors, useDetectDigidErrorMessages};
