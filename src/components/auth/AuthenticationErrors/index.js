import React from 'react';
import PropTypes from 'prop-types';

import FAIcon from 'components/FAIcon';
import Body from 'components/Body';
import useQuery from 'hooks/useQuery';
import {getBEMClassName} from 'utils';

const MAPPING_PARAMS_SERVICE = {
  '_digid-message': 'DigiD',
  '_eherkenning-message': 'EHerkenning',
};

const CANCEL_LOGIN_PARAM = 'login-cancelled';


const useDetectAuthErrorMessages = () => {
  const query = useQuery();

  let parameters = {};

  for (const [key, value] of query.entries()){
    if ( key in MAPPING_PARAMS_SERVICE) {
      parameters[key] = value;
      return parameters;
    }
  }
};


const AuthenticationErrors = ({parameters}) => {

  let messagesToDisplay = [];
  for (const [parameter, message] of Object.entries(parameters)) {
      switch (message) {
        case CANCEL_LOGIN_PARAM: {
          messagesToDisplay.push(`Je hebt het inloggen met ${MAPPING_PARAMS_SERVICE[parameter]} geannuleerd.`);
          break;
        }
        default:
          messagesToDisplay.push(`Er is een fout opgetreden bij het inloggen met ${MAPPING_PARAMS_SERVICE[parameter]}. Probeer het later opnieuw.`);
          break;
    }
  }

  return (
    <div className={getBEMClassName('alert', ['error', 'with-margin'])}>
      <span className={getBEMClassName('alert__icon', ['wide'])}>
        <FAIcon icon="exclamation-circle" />
      </span>
      <Body>
        {messagesToDisplay[0]}
      </Body>
    </div>
  );
};

AuthenticationErrors.propTypes = {
  parameters: PropTypes.object.isRequired,
}

export {AuthenticationErrors, useDetectAuthErrorMessages};
