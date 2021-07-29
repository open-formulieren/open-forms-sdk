import React from 'react';
import PropTypes from 'prop-types';

import Body from 'components/Body';
import FAIcon from 'components/FAIcon';
import useQuery from 'hooks/useQuery';
import {getBEMClassName} from 'utils';

const AUTHENTICATION_OUTAGE_QUERY_PARAM = 'of-auth-problem';

export const useDetectAuthenticationOutage = () => {
  const query = useQuery();
  return query.get(AUTHENTICATION_OUTAGE_QUERY_PARAM);
};

const AuthenticationOutage = ({ loginOption }) => (
  <div className={getBEMClassName('alert', ['error'])}>
    <span className={getBEMClassName('alert__icon', ['wide'])}>
      <FAIcon icon="exclamation-circle" />
    </span>
    <Body>
      {`Dit formulier is tijdelijk niet beschikbaar wegens een storing bij de
        ${loginOption.label} authenticatieservice. Gelieve later opnieuw te proberen.`}
    </Body>
  </div>
);

AuthenticationOutage.propTypes = {
  loginOption: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    logo: PropTypes.shape({
      title: PropTypes.string.isRequired,
      imageSrc: PropTypes.string.isRequired,
      href: PropTypes.string,
    }),
  }).isRequired,
};

export default AuthenticationOutage;
