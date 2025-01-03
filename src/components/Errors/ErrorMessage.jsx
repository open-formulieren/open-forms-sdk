import {Alert} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';

import useScrollIntoView from 'hooks/useScrollIntoView';

const ICONS = {
  error: <i className="fa fas fa-exclamation-circle" />,
  info: <i className="fa fas fa-info-circle" />,
  warning: <i className="fa fas fa-exclamation-triangle" />,
  ok: <i className="fa fas fa-check-circle" />,
};

const ARIA_TAGS = {
  error: {role: 'alert'},
  warning: {role: 'alert'},
  info: {role: 'status', 'aria-live': 'polite'},
  ok: {role: 'status', 'aria-live': 'polite'},
};

const ALERT_MODIFIERS = ['info', 'warning', 'error', 'ok'];

const ErrorMessage = ({children, modifier = 'error'}) => {
  const errorRef = useScrollIntoView();
  if (!children) return null;
  return (
    <Alert type={modifier} icon={ICONS[modifier]} ref={errorRef} {...ARIA_TAGS[modifier]}>
      {children}
    </Alert>
  );
};

ErrorMessage.propTypes = {
  children: PropTypes.node,
  modifier: PropTypes.oneOf(ALERT_MODIFIERS),
};

export {ALERT_MODIFIERS};
export default ErrorMessage;
