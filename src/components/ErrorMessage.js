import React from 'react';
import PropTypes from 'prop-types';

import Body from 'components/Body';
import FAIcon from 'components/FAIcon';
import useScrollIntoView from 'hooks/useScrollIntoView';
import {getBEMClassName} from 'utils';


const ErrorMessage = ({ children, modifiers=['error'] }) => {
  const errorRef = useScrollIntoView();
  if (!children) return null;
  return (
    <div ref={errorRef} className={getBEMClassName('alert', modifiers)}>
      <span className={getBEMClassName('alert__icon', ['wide'])}>
        <FAIcon icon="exclamation-circle" />
      </span>
      <Body component="div">
        {children}
      </Body>
    </div>
  );
};

ErrorMessage.propTypes = {
  children: PropTypes.node,
  modifiers: PropTypes.arrayOf(PropTypes.string),
};

export default ErrorMessage;
