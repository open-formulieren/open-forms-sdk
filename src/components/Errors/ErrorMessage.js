import {Alert} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';
import React from 'react';

import useScrollIntoView from 'hooks/useScrollIntoView';

const ICONS = {
  error: <i className="fa fas fa-exclamation-circle" />,
  info: <i className="fa fas fa-info-circle" />,
  warning: <i className="fa fas fa-exclamation-triangle" />,
  ok: <i className="fa fas fa-check-circle" />,
};

const ErrorMessage = ({children, modifier = 'error'}) => {
  const errorRef = useScrollIntoView();
  if (!children) return null;
  return (
    <Alert type={modifier} icon={ICONS[modifier]} ref={errorRef}>
      {children}
    </Alert>
  );
};

ErrorMessage.propTypes = {
  children: PropTypes.node,
  modifier: PropTypes.string,
};

export default ErrorMessage;
