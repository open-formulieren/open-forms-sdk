import {FormLabel, Paragraph} from '@utrecht/component-library-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {FormattedMessage} from 'react-intl';

import {ConfigContext} from 'Context';

const Label = ({id, isRequired = false, disabled = false, children}) => {
  const {requiredFieldsWithAsterisk} = useContext(ConfigContext);
  return (
    <Paragraph className="utrecht-form-field__label">
      <FormLabel
        htmlFor={id}
        disabled={disabled}
        className={classNames({
          'utrecht-form-label--openforms-required': isRequired,
        })}
      >
        <FormattedMessage
          description="Form field label, field possibly optional"
          defaultMessage="{withAsterisk, select, true {<label></label>} other {<label></label> (optional)}}"
          values={{
            withAsterisk: requiredFieldsWithAsterisk,
            label: () => children,
          }}
        />
      </FormLabel>
    </Paragraph>
  );
};

Label.propTypes = {
  id: PropTypes.string,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default Label;
