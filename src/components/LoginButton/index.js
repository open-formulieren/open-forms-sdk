import Button from "../Button";
import {FormattedMessage} from "react-intl";
import PropTypes from "prop-types";
import React from "react";

export const START_FORM_QUERY_PARAM = '_start';


const LoginButton = ({option, getLoginUrl}) => (
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
  getLoginUrl: PropTypes.func.isRequired,
};

export default LoginButton;
