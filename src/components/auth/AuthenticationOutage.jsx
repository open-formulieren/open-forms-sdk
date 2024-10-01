import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import ErrorMessage from 'components/Errors/ErrorMessage';
import useQuery from 'hooks/useQuery';

const AUTHENTICATION_OUTAGE_QUERY_PARAM = 'of-auth-problem';

export const useDetectAuthenticationOutage = () => {
  const query = useQuery();
  return query.get(AUTHENTICATION_OUTAGE_QUERY_PARAM);
};

const AuthenticationOutage = ({loginOption}) => (
  <ErrorMessage>
    <FormattedMessage
      description="Authentication outage message"
      defaultMessage={`
          This form cannot be used temporarily due to a malfunction with {label}. 
          Please try again later.`}
      values={{label: loginOption.label}}
    />
  </ErrorMessage>
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
