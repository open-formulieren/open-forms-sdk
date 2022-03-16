import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Button from 'components/Button';
import {getLoginUrl} from 'components/utils';


const LoginButton = ({option, ...extra}) => (
  <Button variant="primary" component="a" href={getLoginUrl(option)} {...extra}>
    <FormattedMessage
      description="Login button label"
      defaultMessage="Login with {provider}"
      values={{provider: option.label}}
    />
  </Button>
);

LoginButton.propTypes = {
  option: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    logo: PropTypes.shape({
      title: PropTypes.string.isRequired,
      imageSrc: PropTypes.string.isRequired,
      href: PropTypes.string,
    }),
  }),
};

export default LoginButton;
export {default as LoginButtonIcon} from './LoginButtonIcon'
