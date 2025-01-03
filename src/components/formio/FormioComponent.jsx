import PropTypes from 'prop-types';

import {default as Checkbox, emptyValue as emptyCheckbox} from './checkbox';
import {default as DateField, emptyValue as emptyDate} from './date';
import {default as EmailField, emptyValue as emptyEmail} from './email';
import {default as RadioField, emptyValue as emptyRadio} from './radio';
import {default as TextField, emptyValue as emptyText} from './textfield';

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
    case 'checkbox': {
      return <Checkbox component={component} />;
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
    type: PropTypes.oneOf(['textfield', 'email', 'date', 'phoneNumber', 'bsn', 'radio', 'checkbox'])
      .isRequired,
    key: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    validate: PropTypes.shape({
      required: PropTypes.bool,
      maxLength: PropTypes.number,
    }),
  }).isRequired,
};

export const getEmptyValue = component => {
  switch (component.type) {
    case 'bsn':
    case 'phoneNumber':
    case 'textfield': {
      return emptyText;
    }
    case 'email': {
      return emptyEmail;
    }
    case 'date': {
      return emptyDate;
    }
    case 'radio': {
      return emptyRadio;
    }
    case 'checkbox': {
      return emptyCheckbox;
    }
    default: {
      return '';
    }
  }
};

export default FormioComponent;
