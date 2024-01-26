import {FormLabel, Paragraph} from '@utrecht/component-library-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {FormattedMessage} from 'react-intl';

import {ConfigContext} from 'Context';

export const LabelContent = ({id, disabled = false, isRequired = false, type, children}) => {
  const {requiredFieldsWithAsterisk} = useContext(ConfigContext);
  return (
    <FormLabel
      htmlFor={id}
      disabled={disabled}
      className={classNames({
        'utrecht-form-label--openforms-required': isRequired && requiredFieldsWithAsterisk,
        [`utrecht-form-label--${type}`]: type,
      })}
    >
      {isRequired ? (
        <>{children}</>
      ) : (
        <FormattedMessage
          description="Form field label, field not required"
          defaultMessage="{withAsterisk, select, true {<label></label>} other {<label></label> (not required)}}"
          values={{
            withAsterisk: requiredFieldsWithAsterisk,
            label: () => children,
          }}
        />
      )}
    </FormLabel>
  );
};

LabelContent.propTypes = {
  id: PropTypes.string,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  type: PropTypes.string,
};

const Label = ({id, isRequired = false, disabled = false, children}) => (
  <Paragraph className="utrecht-form-field__label">
    <LabelContent id={id} isRequired={isRequired} disabled={disabled}>
      {children}
    </LabelContent>
  </Paragraph>
);

Label.propTypes = {
  id: PropTypes.string,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default Label;
