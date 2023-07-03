import PropTypes from 'prop-types';
import React from 'react';

import {default as DateField} from './date';
import {default as EmailField} from './email';
import {default as RadioField} from './radio';
import {default as TextField} from './textfield';

const FormioComponent = ({component}) => {
  switch (component.type) {
    case 'bsn':
    case 'phoneNumber':
    case 'textfield': {
      return <TextField component={component} />;
    }
    case 'email': {
      return <EmailField component={component} />;
    }
    case 'date': {
      return <DateField component={component} />;
    }
    case 'radio': {
      return <RadioField component={component} />;
    }
    default: {
      return (
        <code>
          <pre>{JSON.stringify(component, null, 2)}</pre>
        </code>
      );
    }
  }
};

FormioComponent.propTypes = {
  // a very minimal definition of a component - this only defines the minimally expected properties.
  component: PropTypes.shape({
    type: PropTypes.oneOf(['textfield', 'email', 'date', 'phoneNumber', 'bsn', 'radio']).isRequired,
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    validate: PropTypes.shape({
      required: PropTypes.bool,
      maxLength: PropTypes.number,
    }),
  }).isRequired,
};

export default FormioComponent;
