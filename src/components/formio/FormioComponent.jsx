import PropTypes from 'prop-types';

import {default as Checkbox} from './checkbox';

const FormioComponent = ({component}) => {
  switch (component.type) {
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
    type: PropTypes.oneOf(['checkbox']).isRequired,
    key: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    validate: PropTypes.shape({
      required: PropTypes.bool,
    }),
  }).isRequired,
};

export default FormioComponent;
