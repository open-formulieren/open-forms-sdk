import {FormattedMessage} from "react-intl";
import PropTypes from "prop-types";
import React from "react";

import Button from 'components/Button';

export const START_FORM_QUERY_PARAM = '_start';

const getLoginUrl = (loginOption) => {
  const nextUrl = new URL(window.location.href);
  
  const queryParams = Array.from(nextUrl.searchParams.keys());
  queryParams.map(param => nextUrl.searchParams.delete(param));

  nextUrl.searchParams.set(START_FORM_QUERY_PARAM, '1');
  const loginUrl = new URL(loginOption.url);
  loginUrl.searchParams.set("next", nextUrl.toString());
  return loginUrl.toString();
};

const LoginButton = ({option}) => (
  <Button variant="primary" component="a" href={getLoginUrl(option)}>
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
