import {FormLabel, Paragraph} from '@utrecht/component-library-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const Label = ({id, isRequired = false, disabled = false, children}) => (
  <Paragraph className="utrecht-form-field__label">
    <FormLabel
      htmlFor={id}
      disabled={disabled}
      className={classNames({
        'utrecht-form-label--openforms-required': isRequired,
      })}
    >
      {children}
    </FormLabel>
  </Paragraph>
);

Label.propTypes = {
  id: PropTypes.string,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default Label;
