import {FormLabel, Paragraph} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';
import React from 'react';

import {getBEMClassName} from 'utils';

const Label = ({id, isRequired = false, disabled = false, children}) => {
  const modifiers = isRequired ? ['required'] : [];
  return (
    <Paragraph className={getBEMClassName('label', modifiers)}>
      <FormLabel htmlFor={id} disabled={disabled}>
        {children}
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
